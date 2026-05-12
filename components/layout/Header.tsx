"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
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
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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
        scrolled && "shadow-sm"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          aria-label="Pharos English Lab home"
          className="shrink-0"
        >
          <Image
            src="/pharos-navbar.png"
            alt="Pharos English Lab"
            width={1000}
            height={300}
            priority
        className="h-[110px] w-auto object-contain" 
          />
        </Link>

        {/* Desktop Navigation */}
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

        {/* CTA */}
        <div className="hidden md:flex">
          <Link
            href="/diagnostics"
            className="btn-gold"
          >
            Explore Diagnostics
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-navy-700 md:hidden"
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

      {/* Mobile Menu */}
      <div
        className={clsx(
          "fixed inset-0 top-[80px] z-40 bg-white transition-all duration-300 md:hidden",
          mobileOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-6 px-6 pt-10">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg text-navy-800"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/diagnostics"
            onClick={() => setMobileOpen(false)}
            className="btn-gold mt-4 w-full max-w-xs text-center"
          >
            Explore Diagnostics
          </Link>

        </div>
      </div>

    </header>
  );
}