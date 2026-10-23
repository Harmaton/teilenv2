import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPaddle } from '@/lib/paddle';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    
    const body = (await request.json()) as { reportId?: unknown; purchaseType?: unknown };
    if (typeof body.reportId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.reportId)) {
      return NextResponse.json({ error: 'El informe no es válido.' }, { status: 400 });
    }
    if (body.purchaseType !== 'report' && body.purchaseType !== 'salomon') {
      return NextResponse.json({ error: 'El tipo de compra no es válido.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
    }

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, profile_id, status, access_type')
      .eq('id', body.reportId)
      .eq('profile_id', user.id)
      .maybeSingle();

    if (reportError) {
      console.error('[paddle] Could not verify report ownership:', reportError.message);
      return NextResponse.json({ error: 'No se pudo verificar el informe.' }, { status: 500 });
    }
    if (!report) {
      return NextResponse.json({ error: 'No se encontró el informe.' }, { status: 404 });
    }
    if (report.status !== 'completed') {
      return NextResponse.json({ error: 'El informe todavía no está listo.' }, { status: 409 });
    }
    if (body.purchaseType === 'report' && report.access_type !== 'locked') {
      return NextResponse.json({ error: 'Este informe ya está desbloqueado.' }, { status: 409 });
    }
    if (body.purchaseType === 'salomon' && report.access_type === 'locked') {
      return NextResponse.json({ error: 'Primero debes desbloquear el informe.' }, { status: 409 });
    }

    if (body.purchaseType === 'salomon') {
      const { data: conversation, error: conversationError } = await supabase
        .from('salomon_conversations')
        .select('id, is_unlocked')
        .eq('report_id', report.id)
        .eq('profile_id', user.id)
        .maybeSingle();
      if (conversationError) {
        console.error('[paddle] Could not verify Salomon conversation:', conversationError.message);
        return NextResponse.json({ error: 'No se pudo verificar el acceso al chat.' }, { status: 500 });
      }
      if (!conversation) {
        return NextResponse.json({ error: 'No se encontró la conversación.' }, { status: 404 });
      }
      if (conversation.is_unlocked) {
        return NextResponse.json({ error: 'El chat ya está desbloqueado.' }, { status: 409 });
      }
    }

    const priceId = body.purchaseType === 'report'
      ? process.env.PADDLE_REPORT_PRICE_ID
      : process.env.PADDLE_SALOMON_PRICE_ID;
    if (!priceId) {
      throw new Error(`PADDLE_${body.purchaseType.toUpperCase()}_PRICE_ID is not configured`);
    }

    const transaction = await getPaddle().transactions.create({
      items: [{ priceId, quantity: 1 }],
      collectionMode: 'automatic',
      customData: {
        purchase_type: body.purchaseType,
        report_id: report.id,
        profile_id: user.id,
      },
    });

    return NextResponse.json({ transactionId: transaction.id });
  } catch (error) {
    console.error('[paddle] Could not create checkout transaction:', error);
    const paddleErrorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;
    if (paddleErrorCode === 'transaction_default_checkout_url_not_set') {
      return NextResponse.json(
        {
          error:
            'La cuenta de Paddle no tiene configurado un enlace de pago predeterminado. Configúralo para el entorno (Sandbox o Live) de esta app e inténtalo de nuevo.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' }, { status: 500 });
  }
}
