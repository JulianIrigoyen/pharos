import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Pharos English Lab",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-16">
      <div className="w-full max-w-md">
        <Suspense>
          <SignupForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-navy-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
