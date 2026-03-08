"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ResetFields {
  email: string;
}

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>();

  async function onSubmit(data: ResetFields) {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      { redirectTo: origin + "/reset-password/update" }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="heading-md mb-2">Check your email</h2>
        <p className="text-sm text-navy-500">
          We sent a password reset link to your email. Click it to set a new
          password.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h1 className="heading-md mb-2 text-center">Reset Password</h1>
      <p className="mb-8 text-center text-sm text-navy-500">
        Enter the email address associated with your account
      </p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input-field"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
