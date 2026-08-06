import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate environment variables
    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set. Please check your environment variables.');
    }
    if (!supabaseAnonKey) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your environment variables.');
    }

    // Validate URL format
    try {
        new URL(supabaseUrl);
    } catch (error) {
        throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable.`);
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                    
                },
                
            },
            global: {
                fetch: async (url, options: RequestInit = {}) => {
                    // Retry configuration for server-side
                    const maxRetries = 3;
                    const baseTimeout = 60000; // 60 seconds for server operations
                    const retryDelays = [2000, 5000, 10000];
                    
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
                    
                    // Validate URL before attempting fetch
                    const urlString = typeof url === 'string' ? url : url?.toString() || 'unknown';
                    if (urlString === 'unknown' || !urlString) {
                        throw new Error(`Invalid fetch URL: ${urlString}`);
                    }

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
                            
                            // Enhanced error logging
                            const errorDetails = {
                                error: error?.message || error?.toString() || 'Unknown error',
                                errorName: error?.name,
                                errorCode: error?.code,
                                errorCause: error?.cause,
                                retryable: isRetryable,
                                url: urlString,
                                attempt: `${attempt}/${maxRetries}`,
                                method: options?.method || 'GET',
                            };
                            
                            // Log errors in development
                            if (process.env.NODE_ENV === 'development') {
                                console.error(`[Server Client] Fetch error (attempt ${attempt}/${maxRetries}):`, errorDetails);
                            }
                            
                            // If it's the last attempt or error is not retryable, throw with better error message
                            if (isFinalAttempt || !isRetryable) {
                                const enhancedError = new Error(
                                    `Failed to fetch from Supabase: ${error?.message || 'Unknown error'}. ` +
                                    `URL: ${urlString.substring(0, 100)}${urlString.length > 100 ? '...' : ''}. ` +
                                    `Attempts: ${attempt}/${maxRetries}. ` +
                                    (error?.code ? `Error code: ${error.code}. ` : '') +
                                    `Please check your network connection and Supabase configuration.`
                                );
                                (enhancedError as any).originalError = error;
                                (enhancedError as any).url = urlString;
                                throw enhancedError;
                            }
                            
                            // Wait before retrying (exponential backoff)
                            const delay = retryDelays[attempt - 1] || retryDelays[retryDelays.length - 1];
                            if (process.env.NODE_ENV === 'development') {
                                console.log(`[Server Client] Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms...`);
                            }
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                    
                    // Should never reach here, but TypeScript needs it
                    throw lastError;
                }
            }
        }
    )
}