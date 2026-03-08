"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UpdateFields {
  password: string;
  confirmPassword: string;
}

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateFields>();

  const password = watch("password");

  async function onSubmit(data: UpdateFields) {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/login?message=Password+updated+successfully");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <h1 className="heading-md mb-2 text-center">Set New Password</h1>
      <p className="mb-8 text-center text-sm text-navy-500">
        Enter your new password below
      </p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="Min. 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-navy-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="Re-enter your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
