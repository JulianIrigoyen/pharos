import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Headphones,
  BookOpen,
  Clock,
  CheckCircle2,
  Download,
  ArrowRight,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

export const metadata: Metadata = {
  title: "My Dashboard | Pharos English Lab",
  description: "View your diagnostics, reports and account information.",
};

// ─── Config maps ────────────────────────────────────────────────────────────

const diagnosticInfo = {
  writing: {
    label: "Writing Diagnostic",
    icon: FileText,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
  "use-of-english": {
    label: "Use of English Diagnostic",
    icon: BookOpen,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  listening: {
    label: "Listening Diagnostic",
    icon: Headphones,
    iconColor: "text-gold-500",
    iconBg: "bg-gold-50",
  },
} as const;

const statusConfig = {
  paid: {
    label: "Ready to Start",
    badgeClass: "bg-gold-50 text-gold-700 border border-gold-200",
    icon: ArrowRight,
  },
  submitted: {
    label: "Under Review",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: Clock,
  },
  completed: {
    label: "Report Ready",
    badgeClass: "bg-green-50 text-green-700 border border-green-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Payment Issue",
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
    icon: AlertCircle,
  },
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, created_at, diagnostic_type, exam_level, amount_paid, currency, status, pdf_url"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const displayName = (user.user_metadata?.full_name as string) || null;
  const email = user.email || "";
  const initials = (displayName || email).charAt(0).toUpperCase();

  type OrderRow = Pick<
    Order,
    | "id"
    | "created_at"
    | "diagnostic_type"
    | "exam_level"
    | "amount_paid"
    | "currency"
    | "status"
    | "pdf_url"
  >;

  const typedOrders = (orders || []) as OrderRow[];

  const completedCount = typedOrders.filter(
    (o) => o.status === "completed"
  ).length;
  const inProgressCount = typedOrders.filter((o) =>
    (["paid", "submitted", "processing"] as Order["status"][]).includes(o.status)
  ).length;

  return (
    <main>
      {/* ── Welcome header ── */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-900 text-2xl font-semibold text-white">
                {initials}
              </div>
              <div>
                {displayName && (
                  <h1 className="heading-lg">{displayName}</h1>
                )}
                <p className="font-body text-sm text-navy-500">{email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pl-20 sm:pl-0">
              <div className="text-center">
                <p className="font-body text-3xl font-semibold text-navy-900">
                  {typedOrders.length}
                </p>
                <p className="mt-0.5 font-body text-xs uppercase tracking-wider text-navy-400">
                  Total
                </p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-semibold text-green-600">
                  {completedCount}
                </p>
                <p className="mt-0.5 font-body text-xs uppercase tracking-wider text-navy-400">
                  Completed
                </p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-semibold text-gold-500">
                  {inProgressCount}
                </p>
                <p className="mt-0.5 font-body text-xs uppercase tracking-wider text-navy-400">
                  In Progress
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── My Diagnostics ── */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl">
          <h2 className="heading-md mb-8">My Diagnostics</h2>

          {typedOrders.length === 0 ? (
            /* Empty state */
            <div className="card p-12 text-center">
              <BookOpen
                className="mx-auto mb-4 h-12 w-12 text-navy-200"
                strokeWidth={1.5}
              />
              <h3 className="heading-sm mb-2">No diagnostics yet</h3>
              <p className="mb-6 font-body text-sm text-navy-500">
                Purchase a diagnostic to get started with your Cambridge exam
                preparation.
              </p>
              <Link href="/diagnostics" className="btn-gold">
                Explore Diagnostics
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {typedOrders.map((order) => {
                const info =
                  diagnosticInfo[
                    order.diagnostic_type as keyof typeof diagnosticInfo
                  ];
                const status =
                  statusConfig[order.status as keyof typeof statusConfig];
                const Icon = info?.icon ?? FileText;
                const StatusIcon = status?.icon ?? Clock;

                return (
                  <div key={order.id} className="card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      {/* Left: icon + info */}
                      <div className="flex items-start gap-4">
                        <div
                          className={clsx(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                            info?.iconBg ?? "bg-navy-50"
                          )}
                        >
                          <Icon
                            className={clsx(
                              "h-6 w-6",
                              info?.iconColor ?? "text-navy-500"
                            )}
                            strokeWidth={1.5}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-body text-base font-medium text-navy-900">
                              {info?.label ?? order.diagnostic_type}
                            </h3>
                            <span className="inline-flex items-center rounded-lg bg-cambridge/20 px-2.5 py-0.5 font-body text-xs font-semibold text-navy-700">
                              {order.exam_level === "B2"
                                ? "B2 First"
                                : "C1 Advanced"}
                            </span>
                          </div>

                          <p className="mt-1 font-body text-sm text-navy-400">
                            {formatDate(order.created_at)} ·{" "}
                            {formatAmount(order.amount_paid, order.currency)}
                          </p>

                          {/* Status badge */}
                          <div
                            className={clsx(
                              "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium",
                              status?.badgeClass ??
                                "bg-navy-50 text-navy-600 border border-navy-200"
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status?.label ?? order.status}
                          </div>
                        </div>
                      </div>

                      {/* Right: action button */}
                      <div className="flex shrink-0 items-center pl-16 sm:pl-0">
                        {order.status === "paid" && (
                          <Link
                            href={`/exam/${order.id}`}
                            className="btn-gold gap-2 text-xs"
                          >
                            Start Exam
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}

                        {order.status === "completed" && order.pdf_url && (
                          <a
                            href={order.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary gap-2 text-xs"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Report
                          </a>
                        )}

                        {order.status === "completed" && !order.pdf_url && (
                          <span className="font-body text-xs italic text-navy-400">
                            Report being prepared
                          </span>
                        )}

                        {(order.status === "submitted" ||
                          order.status === "processing") && (
                          <span className="font-body text-xs italic text-navy-400">
                            Report in 24–48 hrs
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Account Info ── */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-5xl">
          <h2 className="heading-md mb-6">Account Information</h2>
          <div className="card max-w-md p-6">
            <div className="space-y-4">
              {displayName && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50">
                    <User
                      className="h-4 w-4 text-navy-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-navy-400">
                      Name
                    </p>
                    <p className="font-body text-sm text-navy-900">
                      {displayName}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50">
                  <Mail
                    className="h-4 w-4 text-navy-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-wider text-navy-400">
                    Email
                  </p>
                  <p className="font-body text-sm text-navy-900">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse more ── */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-md text-center">
          <h2 className="heading-md !text-white mb-3">
            Ready for another diagnostic?
          </h2>
          <p className="mb-8 font-body text-sm text-navy-200">
            Each diagnostic targets a different Cambridge exam skill. Build a
            complete picture of your readiness.
          </p>
          <Link href="/diagnostics" className="btn-gold">
            Explore Diagnostics
          </Link>
        </div>
      </section>
    </main>
  );
}
