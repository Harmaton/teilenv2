"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function GoogleAuthButton() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.91h6.61c-.13 1.06-.86 2.66-2.47 3.74l-.02.15 3.59 2.72.25.02c2.28-2.07 3.56-5.12 3.56-8.49"
          fill="#4285F4"
        />
        <path
          d="M12 24c3.24 0 5.95-1.05 7.93-2.86l-3.78-2.9c-1.01.7-2.37 1.19-4.15 1.19-3.17 0-5.86-2.06-6.82-4.92l-.14.01-3.73 2.82-.05.13C3.23 21.3 7.29 24 12 24"
          fill="#34A853"
        />
        <path
          d="M5.18 14.51c-.25-.73-.4-1.51-.4-2.31 0-.8.15-1.58.39-2.31l-.01-.15-3.77-2.86-.12.06A11.94 11.94 0 0 0 0 12.2c0 1.93.47 3.76 1.27 5.36l3.91-3.05"
          fill="#FBBC05"
        />
        <path
          d="M12 4.75c2.26 0 3.78.97 4.65 1.79l3.4-3.31C17.94 1.19 15.24 0 12 0 7.29 0 3.23 2.7 1.27 6.64l3.9 3.05C6.14 6.82 8.83 4.75 12 4.75"
          fill="#EA4335"
        />
      </svg>
      Iniciar sesión con Google
    </Button>
  );
}