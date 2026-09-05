import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const diagnosticLinks = [
  { href: "/diagnostics/writing", label: "Writing Diagnostic" },
  { href: "/diagnostics/use-of-english", label: "Use of English" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr] lg:gap-x-16 xl:gap-x-20">

          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Pharos English Lab home"
              className="-ml-1 inline-block sm:-ml-3 sm:-mt-4"
            >
              <Image
                src="/pharos-footer-logo.png"
                alt="Pharos English Lab"
                width={900}
                height={220}
                priority
                className="h-auto w-[190px] sm:w-[240px] lg:w-[320px]"
              />
            </Link>

            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-navy-300">
              Expert Cambridge diagnostics built on 30+ years of teaching,
              assessment, and exam preparation experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-gold-500">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2.5">
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

          {/* Diagnostics */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-gold-500">
              Diagnostics
            </h3>

            <ul className="mt-4 space-y-2.5">
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

          {/* CTA */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-gold-500">
              Get Started
            </h3>

            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-navy-200">
              Ready to receive expert feedback on your current Cambridge readiness?
            </p>

            <Link
              href="/diagnostics"
              className="btn-gold mt-5 inline-flex w-full max-w-[220px] justify-center"
            >
              Start Your Diagnostic
            </Link>
          </div>

        </div>

        <div className="mt-12 border-t border-navy-800 pt-7 text-center">
          <p className="font-body text-xs tracking-wide text-navy-400">
            &copy; {year} Pharos English Lab. All rights reserved.
            {" "}&middot;{" "}
            <Link
              href="/privacy"
              className="underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}