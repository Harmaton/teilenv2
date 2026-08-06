import { LoginForm } from "@/app/components/auth/login-form"
import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
           Teilen Teens
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { login } from "@/_actions/auth";
// import { useAppDispatch } from "@/store/hooks";
// import { setLoading } from "@/store/slices/authSlice";

// export default function LoginPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setIsSubmitting(true);
//     dispatch(setLoading(true));

//     const result = await login(email, password);

//     dispatch(setLoading(false));
//     setIsSubmitting(false);

//     if (!result.success) {
//       setError(
//         (result.error as { message?: string })?.message ?? "Login failed. Please try again."
//       );
//       return;
//     }

//     router.push("/dashboard");
//     router.refresh(); // refresh server components with new session
//   }

//   return (
//     <div className="flex flex-col gap-8 bg-zinc">
      
//       {/* Header */}
//       <div className="flex flex-col gap-1">
//         <Link
//           href="/"
//           className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600 mb-4 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
//         >
//           ← Home
//         </Link>
//         <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
//           Welcome back
//         </h1>
//         <p className="text-sm text-zinc-500 dark:text-zinc-400">
//           Sign in to your account to continue.
//         </p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="you@example.com"
//             required
//             autoComplete="email"
//             className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white focus:ring-offset-0 transition"
//           />
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <div className="flex items-center justify-between">
//             <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
//               Password
//             </label>
//             <Link
//               href="/forgot-password"
//               className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
//             >
//               Forgot password?
//             </Link>
//           </div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             required
//             autoComplete="current-password"
//             className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white focus:ring-offset-0 transition"
//           />
//         </div>

//         {error && (
//           <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
//             {error}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="mt-1 h-11 flex items-center justify-center rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-medium tracking-tight transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? (
//             <span className="flex items-center gap-2">
//               <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//               </svg>
//               Signing in…
//             </span>
//           ) : (
//             "Sign in"
//           )}
//         </button>
//       </form>

//       <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
//         Don&apos;t have an account?{" "}
//         <Link
//           href="/signup"
//           className="font-medium text-zinc-900 dark:text-white hover:underline"
//         >
//           Create one
//         </Link>
//       </p>
//     </div>
//   );
// }