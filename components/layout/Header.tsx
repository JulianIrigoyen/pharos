"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled && "shadow-md"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label="Pharos English Lab home"
        >
          <Compass
            className="h-7 w-7 text-gold-500 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
          <span className="font-display text-xl font-semibold tracking-wide text-navy-900">
            PHAROS
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm tracking-wide text-navy-700 transition-colors duration-200 hover:text-navy-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link href="/diagnostics" className="btn-gold hidden md:inline-flex">
          Get Started
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 hover:bg-navy-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={clsx(
          "fixed inset-0 top-[72px] z-40 bg-white transition-all duration-300 md:hidden",
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center gap-6 px-6 pt-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-lg tracking-wide text-navy-800 transition-colors duration-200 hover:text-gold-500"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/diagnostics"
            className="btn-gold mt-4 w-full max-w-xs text-center"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
