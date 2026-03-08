"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { trackLead } from "@/lib/analytics";

interface SignupFields {
  name: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFields>();

  async function onSubmit(data: SignupFields) {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.name },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    trackLead({ email: data.email, name: data.name });
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: origin + "/auth/callback?redirect=" + encodeURIComponent(redirect),
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="heading-md mb-2">Check your email</h2>
        <p className="text-sm text-navy-500">
          We sent a verification link to your email address. Please click it to
          verify your account before logging in.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h1 className="heading-md mb-2 text-center">Create Your Account</h1>
      <p className="mb-8 text-center text-sm text-navy-500">
        Join Pharos English Lab to track your progress
      </p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="input-field"
            placeholder="Your full name"
            {...register("name", { required: "Full name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-700">
            Password
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

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-navy-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-navy-400">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="btn-outline w-full gap-2"
      >
        <GoogleIcon />
        Sign up with Google
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
