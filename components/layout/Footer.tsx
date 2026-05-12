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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid items-start gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Pharos English Lab home"
              className="-mt-9 -ml-3 inline-block"
            >
              <Image
                src="/pharos-footer-logo.png"
                alt="Pharos English Lab"
                width={900}
                height={220}
                priority
                className="w-[320px] h-auto"
              />
            </Link>

            <p className="mt-4 font-body text-sm leading-relaxed text-navy-300">
              Expert Cambridge diagnostics built on 30+ years of teaching,
              assessment, and exam preparation experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-gold-500">
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

          {/* Diagnostics */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-gold-500">
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

          {/* CTA */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-gold-500">
              Get Started
            </h3>

            <p className="mt-4 font-body text-sm leading-relaxed text-navy-200">
              Ready to understand your current Cambridge level and what to
              improve next?
            </p>

            <Link
              href="/diagnostics"
              className="btn-gold mt-6 inline-flex text-xs"
            >
              Start Your Diagnostic
            </Link>
          </div>

        </div>

        <div className="mt-14 border-t border-navy-800 pt-8 text-center">
          <p className="font-body text-xs text-navy-400">
            &copy; {year} Pharos English Lab. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}