import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Set New Password | Pharos English Lab",
};

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-16">
      <div className="w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
