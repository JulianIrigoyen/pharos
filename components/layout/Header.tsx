"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/readiness", label: "Readiness" },
  { href: "/diagnostics", label: "Diagnostics" },
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncMenuState = (
      event: MediaQueryListEvent | MediaQueryList
    ) => {
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    syncMenuState(mediaQuery);

    const handleChange = (event: MediaQueryListEvent) => {
      syncMenuState(event);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full border-b border-transparent bg-white/95 backdrop-blur transition-all duration-300",
        scrolled && "border-navy-100 shadow-sm"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8 lg:px-8">

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
            className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-[68px] xl:h-[74px]"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-base font-medium tracking-[0.06em] text-navy-700 transition-all duration-200 hover:text-gold-600 xl:text-[17px]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex">
          <Link
            href="/diagnostics"
            className="btn-gold"
          >
            Explore Diagnostics
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-navy-700 transition-colors hover:bg-navy-50 lg:hidden"
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

      <div
        className={clsx(
          "absolute left-0 right-0 top-full z-40 border-t border-navy-100 bg-white shadow-md transition-all duration-300 lg:hidden",
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-7 px-6 pb-10 pt-8">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body text-lg tracking-wide text-navy-800 transition-colors hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/diagnostics"
            onClick={() => setMobileOpen(false)}
            className="btn-gold mt-2 w-full max-w-sm text-center"
          >
            Explore Diagnostics
          </Link>

        </div>
      </div>

    </header>
  );
}