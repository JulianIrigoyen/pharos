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
  { value: "diagnostic", label: "Diagnostic Question" },
  { value: "consultation", label: "Private Consultation" },
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
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_data),
    });

    setSubmitted(true);
  };

  return (
    <main>

      {/* Hero */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="heading-xl">Get in Touch</h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-600">
            Have a question about diagnostics, consultations, or your Cambridge preparation? I would be happy to help.
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

                <h2 className="heading-md">
                  Message received
                </h2>

                <p className="mt-3 font-body text-navy-600">
                  Thank you for your message. I will get back to you soon.
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
                    {...register("name", {
                      required: "Name is required",
                    })}
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
                      <option
                        key={option.value}
                        value={option.value}
                      >
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
                    placeholder="How can I help you?"
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

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-2">

            {/* Email */}
            <div className="card p-6">

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                  <Mail
                    className="h-5 w-5 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="font-display text-lg font-medium text-navy-900">
                  Email
                </h3>
              </div>

              <a
                href="mailto:pharosenglishlab@gmail.com"
                className="font-body text-sm text-navy-600 underline decoration-navy-200 underline-offset-4 transition-colors hover:text-navy-900 hover:decoration-navy-500"
              >
                pharosenglishlab@gmail.com
              </a>

            </div>

            {/* Consultation */}
            <div className="card p-6">

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                  <BookOpen
                    className="h-5 w-5 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="font-display text-lg font-medium text-navy-900">
                  Need Extra Guidance?
                </h3>
              </div>

              <p className="font-body text-sm leading-relaxed text-navy-600">
                Some students may feel that after receiving their diagnostic report, they would benefit from more personalised support and expert guidance.
              </p>

              <p className="mt-4 font-body text-sm leading-relaxed text-navy-600">
                Private 45-minute 1:1 consultation sessions can be booked separately upon request. To enquire about availability, simply select "Private Consultation" in the Subject field of the form on the left.
              </p>

              <p className="mt-4 font-body text-sm leading-relaxed text-navy-600">
                These sessions are designed to clarify feedback, answer specific questions, and help you focus on the areas that will have the greatest impact on your exam performance.
              </p>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}