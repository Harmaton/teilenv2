import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getPaddle } from '@/lib/paddle';

type JsonRecord = Record<string, unknown>;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role credentials are not configured');
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function asRecord(value: unknown): JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asUuid(value: unknown): string | null {
  const candidate = asString(value);
  return candidate && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function nestedRecord(value: unknown, key: string): JsonRecord {
  return asRecord(asRecord(value)[key]);
}

async function findProfileForCustomer(supabase: ReturnType<typeof getAdminClient>, customerId: string | null) {
  if (!customerId) return null;
  const { data, error } = await supabase
    .from('paddle_customers')
    .select('profile_id')
    .eq('customer_id', customerId)
    .maybeSingle();
  if (error) throw error;
  return asUuid(data?.profile_id);
}

async function syncTransaction(supabase: ReturnType<typeof getAdminClient>, data: JsonRecord) {
  const transactionId = asString(data.id);
  if (!transactionId) throw new Error('Transaction webhook is missing its transaction ID');

  const customerId = asString(data.customerId);
  const customData = asRecord(data.customData);
  const profileId = asUuid(customData.profile_id) ?? await findProfileForCustomer(supabase, customerId);
  if (customerId && profileId) {
    const { error: customerLinkError } = await supabase.from('paddle_customers').upsert({
      customer_id: customerId,
      profile_id: profileId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'customer_id' });
    if (customerLinkError) throw customerLinkError;
  }
  const totals = nestedRecord(data.details, 'totals');
  const payment = asRecord(Array.isArray(data.payments) ? data.payments[0] : null);
  const methodDetails = asRecord(payment.methodDetails);
  const card = asRecord(methodDetails.card);
  const { error } = await supabase.from('paddle_transactions').upsert({
    transaction_id: transactionId,
    profile_id: profileId,
    customer_id: customerId,
    subscription_id: asString(data.subscriptionId),
    status: asString(data.status),
    currency_code: asString(data.currencyCode),
    total_amount: asNumber(totals.total),
    payment_method_type: asString(methodDetails.type),
    card_last4: asString(card.last4),
    raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'transaction_id' });
  if (error) throw error;
}

async function fulfillCompletedTransaction(supabase: ReturnType<typeof getAdminClient>, data: JsonRecord) {
  const customData = asRecord(data.customData);
  const purchaseType = customData.purchase_type;
  if (purchaseType !== 'report' && purchaseType !== 'salomon') return;

  const transactionId = asString(data.id);
  const reportId = asUuid(customData.report_id);
  const profileId = asUuid(customData.profile_id);
  const priceId = purchaseType === 'report'
    ? process.env.PADDLE_REPORT_PRICE_ID
    : process.env.PADDLE_SALOMON_PRICE_ID;
  const items = Array.isArray(data.items) ? data.items.map(asRecord) : [];
  const hasExpectedPrice = !!priceId && items.some((item) => asString(asRecord(item.price).id) === priceId);

  if (!transactionId || !reportId || !profileId || !hasExpectedPrice) {
    throw new Error(`Completed transaction ${transactionId ?? '(unknown)'} has invalid purchase metadata or price configuration`);
  }

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('id, profile_id')
    .eq('id', reportId)
    .eq('profile_id', profileId)
    .maybeSingle();
  if (reportError) throw reportError;
  if (!report) throw new Error(`Completed transaction ${transactionId} references a report not owned by the profile`);

  if (purchaseType === 'salomon') {
    const { data: conversation, error } = await supabase
      .from('salomon_conversations')
      .select('id')
      .eq('report_id', reportId)
      .eq('profile_id', profileId)
      .maybeSingle();
    if (error) throw error;
    if (!conversation) throw new Error(`Completed transaction ${transactionId} references a missing Salomon conversation`);
  }

  const customerId = asString(data.customerId);
  let priorAdjustment: { action: string | null } | null = null;
  if (transactionId) {
    const { data, error } = await supabase.from('paddle_adjustments')
      .select('action')
      .eq('transaction_id', transactionId)
      .eq('status', 'approved')
      .order('updated_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    const latestAdjustment = data?.[0];
    if (latestAdjustment?.action === 'refund' || latestAdjustment?.action === 'chargeback') {
      priorAdjustment = latestAdjustment;
    }
  }
  let customerEmail: string | null = null;
  if (customerId) {
    const { data: customer, error } = await supabase.from('paddle_customers')
      .select('email')
      .eq('customer_id', customerId)
      .maybeSingle();
    if (error) throw error;
    customerEmail = asString(customer?.email);
  }
  const totals = nestedRecord(data.details, 'totals');
  const payment = asRecord(Array.isArray(data.payments) ? data.payments[0] : null);
  const methodDetails = asRecord(payment.methodDetails);
  const card = asRecord(methodDetails.card);
  const { error: purchaseError } = await supabase.from('paddle_purchases').upsert({
    transaction_id: transactionId,
    profile_id: profileId,
    report_id: reportId,
    purchase_type: purchaseType,
    buyer_email: customerEmail,
    status: priorAdjustment ? 'refunded' : 'completed',
    amount: asNumber(totals.total),
    currency_code: asString(data.currencyCode),
    paddle_customer_id: customerId,
    payment_method_type: asString(methodDetails.type),
    card_last4: asString(card.last4),
    raw_payload: data,
  }, { onConflict: 'transaction_id' });
  if (purchaseError) throw purchaseError;

  if (priorAdjustment) return;

  if (purchaseType === 'report') {
    const { error } = await supabase.from('reports')
      .update({ access_type: 'paid' })
      .eq('id', reportId)
      .eq('profile_id', profileId)
      .neq('access_type', 'paid');
    if (error) throw error;
  } else {
    const { error } = await supabase.from('salomon_conversations')
      .update({ is_unlocked: true })
      .eq('report_id', reportId)
      .eq('profile_id', profileId)
      .eq('is_unlocked', false);
    if (error) throw error;
  }
}

async function syncCustomer(supabase: ReturnType<typeof getAdminClient>, data: JsonRecord) {
  const customerId = asString(data.id);
  if (!customerId) throw new Error('Customer webhook is missing its customer ID');
  const customData = asRecord(data.customData);
  const profileId = asUuid(customData.profile_id) ?? await findProfileForCustomer(supabase, customerId);
  const email = asString(data.email);
  const name = asString(data.name);
  const status = asString(data.status);
  const { error } = await supabase.from('paddle_customers').upsert({
    customer_id: customerId,
    profile_id: profileId,
    ...(email ? { email } : {}),
    ...(name ? { name } : {}),
    ...(status ? { status } : {}),
    raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'customer_id' });
  if (error) throw error;
}

async function syncSubscription(supabase: ReturnType<typeof getAdminClient>, data: JsonRecord) {
  const subscriptionId = asString(data.id);
  if (!subscriptionId) throw new Error('Subscription webhook is missing its subscription ID');
  const customerId = asString(data.customerId);
  const customData = asRecord(data.customData);
  const profileId = asUuid(customData.profile_id) ?? await findProfileForCustomer(supabase, customerId);
  const firstItem = asRecord(Array.isArray(data.items) ? data.items[0] : null);
  const price = asRecord(firstItem.price);
  const product = asRecord(firstItem.product);
  const { error } = await supabase.from('paddle_subscriptions').upsert({
    subscription_id: subscriptionId,
    profile_id: profileId,
    customer_id: customerId,
    status: asString(data.status),
    price_id: asString(price.id),
    product_id: asString(product.id),
    currency_code: asString(data.currencyCode),
    next_billed_at: asString(data.nextBilledAt),
    canceled_at: asString(data.canceledAt),
    scheduled_change: data.scheduledChange ?? null,
    raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'subscription_id' });
  if (error) throw error;
}

async function syncCatalogItem(supabase: ReturnType<typeof getAdminClient>, eventType: string, data: JsonRecord) {
  const isPrice = eventType.startsWith('price.');
  const id = asString(data.id);
  if (!id) throw new Error(`${isPrice ? 'Price' : 'Product'} webhook is missing its ID`);

  if (isPrice) {
    const unitPrice = asRecord(data.unitPrice);
    const { error } = await supabase.from('paddle_prices').upsert({
      price_id: id,
      product_id: asString(data.productId),
      name: asString(data.name),
      description: asString(data.description),
      status: asString(data.status),
      currency_code: asString(unitPrice.currencyCode),
      unit_amount: asNumber(unitPrice.amount),
      billing_cycle: data.billingCycle ?? null,
      raw_payload: data,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'price_id' });
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('paddle_products').upsert({
    product_id: id,
    name: asString(data.name),
    description: asString(data.description),
    status: asString(data.status),
    image_url: asString(data.imageUrl),
    raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'product_id' });
  if (error) throw error;
}

async function syncAdjustment(supabase: ReturnType<typeof getAdminClient>, data: JsonRecord) {
  const adjustmentId = asString(data.id);
  if (!adjustmentId) throw new Error('Adjustment webhook is missing its ID');
  const transactionId = asString(data.transactionId);
  const { error } = await supabase.from('paddle_adjustments').upsert({
    adjustment_id: adjustmentId,
    transaction_id: transactionId,
    action: asString(data.action),
    status: asString(data.status),
    raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'adjustment_id' });
  if (error) throw error;

  if (asString(data.status) !== 'approved' || !transactionId) return;
  const action = asString(data.action);
  const isRefund = action === 'refund' || action === 'chargeback';
  const isReversal = action === 'credit_reverse' || action === 'chargeback_reverse';
  if (!isRefund && !isReversal) return;

  const { data: purchase, error: purchaseError } = await supabase
    .from('paddle_purchases')
    .select('profile_id, report_id, purchase_type')
    .eq('transaction_id', transactionId)
    .maybeSingle();
  if (purchaseError) throw purchaseError;
  if (!purchase) return;

  const revoked = isRefund;
  if (purchase.purchase_type === 'report') {
    const { error } = await supabase.from('reports')
      .update({ access_type: revoked ? 'locked' : 'paid' })
      .eq('id', purchase.report_id)
      .eq('profile_id', purchase.profile_id)
      .neq('access_type', revoked ? 'locked' : 'paid');
    if (error) throw error;
  } else {
    const { error } = await supabase.from('salomon_conversations')
      .update({ is_unlocked: !revoked })
      .eq('report_id', purchase.report_id)
      .eq('profile_id', purchase.profile_id)
      .eq('is_unlocked', revoked);
    if (error) throw error;
  }

  const { error: statusError } = await supabase.from('paddle_purchases')
    .update({ status: revoked ? 'refunded' : 'completed' })
    .eq('transaction_id', transactionId);
  if (statusError) throw statusError;
}

export async function handlePaddleWebhook(request: Request) {
  const signature = request.headers.get('paddle-signature');
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error('[paddle] Webhook signature or PADDLE_WEBHOOK_SECRET is missing');
    return NextResponse.json({ error: 'Webhook signature configuration is missing.' }, { status: 500 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, webhookSecret, signature);
  } catch (error) {
    console.warn('[paddle] Rejected webhook after signature/payload verification:', error);
    return NextResponse.json({ error: 'Invalid webhook signature or payload.' }, { status: 400 });
  }

  const supabase = getAdminClient();
  const eventId = event.eventId;
  const payload = JSON.parse(rawBody) as JsonRecord;
  const { data: priorEvent, error: lookupError } = await supabase
    .from('paddle_webhook_events')
    .select('processing_status')
    .eq('event_id', eventId)
    .maybeSingle();
  if (lookupError) {
    console.error('[paddle] Could not check webhook idempotency:', lookupError.message);
    return NextResponse.json({ error: 'Webhook storage is not configured.' }, { status: 500 });
  }
  if (priorEvent?.processing_status === 'processed') {
    return NextResponse.json({ success: true, duplicate: true });
  }

  const eventRecord = {
    event_id: eventId,
    event_type: event.eventType,
    occurred_at: event.occurredAt,
    payload,
    processing_status: 'processing',
    last_error: null,
    processed_at: null,
  };
  const { error: receiptError } = await supabase.from('paddle_webhook_events').upsert(eventRecord, { onConflict: 'event_id' });
  if (receiptError) {
    console.error('[paddle] Could not record webhook:', receiptError.message);
    return NextResponse.json({ error: 'Webhook storage is not configured.' }, { status: 500 });
  }

  try {
    const data = asRecord(event.data);
    if (event.eventType.startsWith('customer.')) {
      await syncCustomer(supabase, data);
    } else if (event.eventType.startsWith('subscription.')) {
      await syncSubscription(supabase, data);
    } else if (event.eventType.startsWith('price.') || event.eventType.startsWith('product.')) {
      await syncCatalogItem(supabase, event.eventType, data);
    } else if (event.eventType.startsWith('transaction.')) {
      await syncTransaction(supabase, data);
      if (event.eventType === 'transaction.completed') {
        await fulfillCompletedTransaction(supabase, data);
      }
    } else if (event.eventType.startsWith('adjustment.')) {
      await syncAdjustment(supabase, data);
    }
    // Every Paddle notification, including event families not used by the app yet, is retained above.

    const { error: markProcessedError } = await supabase.from('paddle_webhook_events')
      .update({ processing_status: 'processed', processed_at: new Date().toISOString(), last_error: null })
      .eq('event_id', eventId);
    if (markProcessedError) throw markProcessedError;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook processing error';
    console.error(`[paddle] Failed to process ${event.eventType} (${eventId}):`, error);
    await supabase.from('paddle_webhook_events')
      .update({ processing_status: 'failed', last_error: message })
      .eq('event_id', eventId);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
