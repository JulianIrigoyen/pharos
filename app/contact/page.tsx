"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, CheckCircle2, BookOpen } from "lucide-react";
import clsx from "clsx";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const subjectOptions = [
  { value: "", label: "Select a subject" },
  { value: "general", label: "General Inquiry" },
  { value: "classes", label: "Private Classes" },
  { value: "diagnostic", label: "Diagnostic Question" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate submission delay — backend wiring comes later
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <main>
      {/* Hero */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="heading-xl">Get in Touch</h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-600">
            Have a question about our diagnostics, private classes, or anything
            else? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-5">
          {/* Contact form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="card flex flex-col items-center p-10 text-center">
                <CheckCircle2
                  className="mb-4 h-14 w-14 text-gold-500"
                  strokeWidth={1.5}
                />
                <h2 className="heading-md">Message Sent</h2>
                <p className="mt-3 font-body text-navy-600">
                  Thank you for reaching out. We will get back to you as soon as
                  possible.
                </p>
                <Link href="/" className="btn-primary mt-8">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={clsx(
                      "input-field",
                      errors.name && "!border-red-400 !ring-red-400/20"
                    )}
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 font-body text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(
                      "input-field",
                      errors.email && "!border-red-400 !ring-red-400/20"
                    )}
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 font-body text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    className={clsx(
                      "input-field",
                      errors.subject && "!border-red-400 !ring-red-400/20"
                    )}
                    {...register("subject", {
                      required: "Please select a subject",
                    })}
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 font-body text-xs text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={clsx(
                      "input-field resize-y",
                      errors.message && "!border-red-400 !ring-red-400/20"
                    )}
                    placeholder="How can we help you?"
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Please write at least 10 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 font-body text-xs text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={clsx(
                    "btn-gold w-full",
                    isSubmitting && "cursor-wait opacity-75"
                  )}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <div className="space-y-8 lg:col-span-2">
            {/* Email */}
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                  <Mail className="h-5 w-5 text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-medium text-navy-900">
                  Email Us
                </h3>
              </div>
              <a
                href="mailto:hello@pharoslab.com"
                className="font-body text-sm text-navy-600 underline decoration-navy-200 underline-offset-4 transition-colors hover:text-navy-900 hover:decoration-navy-500"
              >
                hello@pharoslab.com
              </a>
            </div>

            {/* Private classes */}
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                  <BookOpen
                    className="h-5 w-5 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-display text-lg font-medium text-navy-900">
                  Private Classes
                </h3>
              </div>
              <p className="font-body text-sm leading-relaxed text-navy-600">
                Looking for one-on-one Cambridge exam preparation with an
                experienced teacher? We offer private classes for B2 First and
                C1 Advanced. Get in touch using the form or email us directly
                to discuss availability and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
