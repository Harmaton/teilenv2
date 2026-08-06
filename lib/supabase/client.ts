import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: async (url, options = {}) => {
                const isAuthRequest = typeof url === 'string' && url.includes('/auth/');
                const maxRetries = isAuthRequest ? 1 : 3;
                const baseTimeout = isAuthRequest ? 10000 : 30000;
                const retryDelays = isAuthRequest ? [1000] : [2000, 5000, 10000];
                
                // Helper to check if error is retryable
                const isRetryableError = (error: any): boolean => {
                    return (
                        error?.code === 'ETIMEDOUT' ||
                        error?.name === 'AbortError' ||
                        error?.message?.includes('aborted') ||
                        error?.message?.includes('timeout') ||
                        error?.message?.includes('fetch failed') ||
                        error?.message?.includes('ECONNREFUSED') ||
                        error?.message?.includes('ENOTFOUND') ||
                        (error?.cause && error.cause.code === 'ETIMEDOUT')
                    );
                };
                
                // Retry logic
                let lastError: any;
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), baseTimeout);
                        
                        const response = await fetch(url, {
                            ...options,
                            signal: controller.signal,
                        });
                        
                        clearTimeout(timeoutId);
                        return response;
                    } catch (error: any) {
                        lastError = error;
                        const isRetryable = isRetryableError(error);
                        const isFinalAttempt = attempt === maxRetries;
                        
                        // Log errors in development - always log with full error details
                        if (process.env.NODE_ENV === 'development') {
                            const errorMessage = error?.message || (typeof error === 'string' ? error : null);
                            const errorName = error?.name || (error instanceof Error ? error.name : null);
                            const errorCode = error?.code || (error as any)?.cause?.code || null;
                            
                            console.error(`Supabase fetch error (attempt ${attempt}/${maxRetries}):`, {
                                error: errorMessage || String(error),
                                errorName: errorName,
                                errorCode: errorCode,
                                errorType: typeof error,
                                errorConstructor: error?.constructor?.name,
                                retryable: isRetryable,
                                url: typeof url === 'string' ? url : 'unknown',
                                rawError: error, // Include raw error for debugging
                            });
                        }
                        
                        // If it's the last attempt or error is not retryable, throw
                        if (isFinalAttempt || !isRetryable) {
                            throw error;
                        }
                        
                        // Wait before retrying (exponential backoff)
                        const delay = retryDelays[attempt - 1] || retryDelays[retryDelays.length - 1];
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`Retrying Supabase request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms...`);
                        }
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
                
                // Should never reach here, but TypeScript needs it
                throw lastError;
            }
        }
    });
}
