import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Pharos English Lab",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-16">
      <div className="w-full max-w-md">
        <ResetPasswordForm />

        <p className="mt-6 text-center text-sm text-navy-300">
          <Link
            href="/login"
            className="font-medium text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
          >
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  );
}
