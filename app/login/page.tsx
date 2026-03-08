import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Pharos English Lab",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-16">
      <div className="w-full max-w-md">
        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-navy-300">
          Don&rsquo;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
          >
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-navy-300">
          <Link
            href="/reset-password"
            className="font-medium text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </main>
  );
}
