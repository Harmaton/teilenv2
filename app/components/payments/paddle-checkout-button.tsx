'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PADDLE_SCRIPT_URL = 'https://cdn.paddle.com/paddle/v2/paddle.js';
let paddleReady: Promise<void> | null = null;
let paddleInitialized = false;

type PaddleClient = {
  Environment: { set: (environment: 'sandbox') => void };
  Initialize: (options: {
    token: string;
    eventCallback?: (event: { name?: string }) => void;
  }) => void;
  Checkout: { open: (options: { transactionId: string }) => void };
};

declare global {
  interface Window {
    Paddle?: PaddleClient;
  }
}

function initializePaddle(): Promise<void> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    return Promise.reject(new Error('Falta configurar el token público de Paddle.'));
  }

  if (window.Paddle) {
    if (!paddleInitialized) {
      if (process.env.NEXT_PUBLIC_PADDLE_ENV !== 'production') {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Initialize({
        token,
        eventCallback: (event) => {
          if (event.name === 'checkout.completed') {
            window.dispatchEvent(new Event('paddle:checkout-completed'));
          }
        },
      });
      paddleInitialized = true;
    }
    return Promise.resolve();
  }

  if (!paddleReady) {
    paddleReady = new Promise<void>((resolve, reject) => {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${PADDLE_SCRIPT_URL}"]`);
      const onLoad = () => {
        if (!window.Paddle) {
          reject(new Error('No se pudo cargar Paddle.js.'));
          return;
        }
        if (process.env.NEXT_PUBLIC_PADDLE_ENV !== 'production') {
          window.Paddle.Environment.set('sandbox');
        }
        window.Paddle.Initialize({
          token,
          eventCallback: (event) => {
            if (event.name === 'checkout.completed') {
              window.dispatchEvent(new Event('paddle:checkout-completed'));
            }
          },
        });
        paddleInitialized = true;
        resolve();
      };

      if (!script) {
        script = document.createElement('script');
        script.src = PADDLE_SCRIPT_URL;
        script.async = true;
        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', () => reject(new Error('No se pudo cargar Paddle.js.')), { once: true });
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', () => reject(new Error('No se pudo cargar Paddle.js.')), { once: true });
      }
    });
  }

  return paddleReady;
}

export default function PaddleCheckoutButton({
  reportId,
  purchaseType = 'report',
}: {
  reportId?: string;
  purchaseType?: 'report' | 'salomon';
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const refreshAfterCheckout = () => router.refresh();
    window.addEventListener('paddle:checkout-completed', refreshAfterCheckout);
    initializePaddle()
      .then(() => {
        if (active) setIsReady(true);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'No se pudo inicializar el pago.');
        }
      });
    return () => {
      active = false;
      window.removeEventListener('paddle:checkout-completed', refreshAfterCheckout);
    };
  }, [router]);

  async function startCheckout() {
    if (!reportId || isLoading) return;
    setIsLoading(true);
    setMessage('');

    try {
      await initializePaddle();
      const response = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, purchaseType }),
      });
      const result = (await response.json()) as { transactionId?: string; error?: string };
      if (!response.ok || !result.transactionId) {
        throw new Error(result.error ?? 'No se pudo iniciar el pago. Inténtalo de nuevo.');
      }

      window.Paddle?.Checkout.open({ transactionId: result.transactionId });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar el pago. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={startCheckout}
        disabled={!isReady || isLoading || !reportId}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Preparando pago…' : isReady ? 'Desbloquear mi reporte' : 'Cargando pago seguro…'}
      </button>
      {message ? (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
