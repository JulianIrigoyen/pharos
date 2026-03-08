import Link from "next/link";
import { Compass } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const diagnosticLinks = [
  { href: "/diagnostics/writing", label: "Writing Diagnostic" },
  { href: "/diagnostics/use-of-english", label: "Use of English" },
  { href: "/diagnostics/listening", label: "Listening Diagnostic" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="Pharos English Lab home"
            >
              <Compass
                className="h-7 w-7 text-gold-500 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.8}
              />
              <span className="font-display text-xl font-semibold tracking-wide">
                PHAROS
              </span>
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-300">
              Navigate your Cambridge preparation with expert-level diagnostic
              reports powered by 30+ years of methodology.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-navy-200 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnostic links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-500">
              Diagnostics
            </h3>
            <ul className="mt-4 space-y-3">
              {diagnosticLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-navy-200 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get started */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-500">
              Get Started
            </h3>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-200">
              Ready to understand your exam readiness? Start with a diagnostic
              report today.
            </p>
            <Link
              href="/diagnostics"
              className="btn-gold mt-6 inline-flex text-xs"
            >
              Start a Diagnostic
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-navy-800 pt-8 text-center">
          <p className="font-body text-xs text-navy-400">
            &copy; {year} Pharos English Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
