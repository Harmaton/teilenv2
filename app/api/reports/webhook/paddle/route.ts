import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getPaddle } from '@/lib/paddle';

export const runtime = 'nodejs';

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

export async function POST(request: Request) {
  const signature = request.headers.get('paddle-signature');
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook signature configuration is missing.' }, { status: 400 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, webhookSecret, signature);
  } catch (error) {
    console.warn('[paddle] Rejected webhook with invalid signature:', error);
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    if (event.eventType === 'transaction.completed') {
      const transaction = event.data;
      const customData = transaction.customData;
      const reportId = customData?.report_id;
      const profileId = customData?.profile_id;
      const purchaseType = customData?.purchase_type;
      const isSupportedPurchase = purchaseType === 'report' || purchaseType === 'salomon';
      const expectedPriceId = purchaseType === 'report'
        ? process.env.PADDLE_REPORT_PRICE_ID
        : purchaseType === 'salomon'
          ? process.env.PADDLE_SALOMON_PRICE_ID
          : undefined;
      const hasExpectedPrice = !!expectedPriceId && transaction.items.some((item) => item.price?.id === expectedPriceId);

      if (!isSupportedPurchase || typeof reportId !== 'string' || typeof profileId !== 'string' || !hasExpectedPrice) {
        console.error('[paddle] Completed transaction had invalid report purchase metadata:', transaction.id);
        return NextResponse.json({ error: 'Invalid transaction metadata.' }, { status: 400 });
      }

      const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('id, profile_id')
        .eq('id', reportId)
        .eq('profile_id', profileId)
        .maybeSingle();
      if (reportError) throw reportError;
      if (!report) {
        console.error('[paddle] Purchase references a report not owned by profile:', transaction.id);
        return NextResponse.json({ error: 'Purchase report not found.' }, { status: 400 });
      }

      if (purchaseType === 'salomon') {
        const { data: conversation, error: conversationError } = await supabase
          .from('salomon_conversations')
          .select('id')
          .eq('report_id', reportId)
          .eq('profile_id', profileId)
          .maybeSingle();
        if (conversationError) throw conversationError;
        if (!conversation) {
          console.error('[paddle] Salomon purchase references a missing conversation:', transaction.id);
          return NextResponse.json({ error: 'Purchase conversation not found.' }, { status: 400 });
        }
      }

      const { error: purchaseError } = await supabase.from('paddle_purchases').upsert(
        {
          transaction_id: transaction.id,
          profile_id: profileId,
          report_id: reportId,
          purchase_type: purchaseType,
          buyer_email: null,
          status: 'completed',
          amount: transaction.details?.totals?.total ?? null,
          currency_code: transaction.currencyCode,
          raw_payload: JSON.parse(rawBody),
        },
        { onConflict: 'transaction_id', ignoreDuplicates: true },
      );
      if (purchaseError) throw purchaseError;

      if (purchaseType === 'report') {
        const { error: unlockError } = await supabase
          .from('reports')
          .update({ access_type: 'paid' })
          .eq('id', reportId)
          .eq('profile_id', profileId)
          .eq('access_type', 'locked');
        if (unlockError) throw unlockError;
      } else {
        const { error: unlockError } = await supabase
          .from('salomon_conversations')
          .update({ is_unlocked: true })
          .eq('report_id', reportId)
          .eq('profile_id', profileId);
        if (unlockError) throw unlockError;
      }
    }

    if (event.eventType === 'adjustment.created' || event.eventType === 'adjustment.updated') {
      const adjustment = event.data;
      if (adjustment.status === 'approved') {
        const isRefund = adjustment.action === 'refund' || adjustment.action === 'chargeback';
        const isReversal = adjustment.action === 'credit_reverse' || adjustment.action === 'chargeback_reverse';
        if (isRefund || isReversal) {
          const { data: purchase, error: purchaseLookupError } = await supabase
            .from('paddle_purchases')
            .select('profile_id, report_id, purchase_type')
            .eq('transaction_id', adjustment.transactionId)
            .maybeSingle();
          if (purchaseLookupError) throw purchaseLookupError;

          if (purchase) {
            const accessQuery = purchase.purchase_type === 'report'
              ? supabase
                  .from('reports')
                  .update({ access_type: isReversal ? 'paid' : 'locked' })
                  .eq('id', purchase.report_id)
                  .eq('profile_id', purchase.profile_id)
                  .eq('access_type', isReversal ? 'locked' : 'paid')
              : supabase
                  .from('salomon_conversations')
                  .update({ is_unlocked: isReversal })
                  .eq('report_id', purchase.report_id)
                  .eq('profile_id', purchase.profile_id)
                  .eq('is_unlocked', !isReversal);
            const { error: accessError } = await accessQuery;
            if (accessError) throw accessError;

            const { error: statusError } = await supabase
              .from('paddle_purchases')
              .update({ status: isReversal ? 'completed' : 'refunded' })
              .eq('transaction_id', adjustment.transactionId);
            if (statusError) throw statusError;
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[paddle] Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
