"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/auth/UserMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/which-exam", label: "Which Exam?" },
  { href: "/readiness", label: "Readiness" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncMenuState = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setMobileOpen(false);
    };
    syncMenuState(mediaQuery);
    const handleChange = (event: MediaQueryListEvent) => syncMenuState(event);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auth state
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-2 sm:px-5 sm:pt-5">

      <div
        className={clsx(
          "mx-auto max-w-7xl rounded-[1.5rem] bg-navy-900 transition-all duration-300 sm:rounded-[2rem]",
          scrolled
            ? "shadow-[0_12px_40px_rgba(15,23,42,0.22)]"
            : "shadow-[0_8px_28px_rgba(15,23,42,0.14)]"
        )}
      >

        <nav className="relative flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 md:px-10">

          {/* MOBILE CENTERED LOGO */}
          <div className="flex w-full items-center justify-center lg:hidden">
            <Link href="/" aria-label="Pharos English Lab home">
              <Image
                src="/pharos-navbar.png"
                alt="Pharos English Lab"
                width={1000}
                height={300}
                priority
                className="h-[58px] w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          {/* DESKTOP LOGO */}
          <Link
            href="/"
            aria-label="Pharos English Lab home"
            className="hidden shrink-0 lg:block"
          >
            <Image
              src="/pharos-navbar.png"
              alt="Pharos English Lab"
              width={1000}
              height={300}
              priority
              className="h-[78px] w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-[17px] font-semibold tracking-[0.04em] text-white/90 transition-colors duration-200 hover:text-gold-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA / Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/diagnostics"
                  className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-5 py-2.5 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-gold-600"
                >
                  Explore Diagnostics
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="absolute right-5 rounded-lg p-1 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>

        </nav>

      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.5rem] bg-navy-900 shadow-2xl transition-all duration-300 lg:hidden",
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-6 px-6 pb-8 pt-7">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body text-[1.45rem] font-light tracking-[0.03em] text-white/90 transition-colors hover:text-gold-400"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white/10"
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="font-body text-[1.45rem] font-light tracking-[0.03em] text-white/70 transition-colors hover:text-gold-400"
              >
                Log In
              </Link>
              <Link
                href="/diagnostics"
                onClick={() => setMobileOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-gold-500 px-5 py-3 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-gold-600"
              >
                Explore Diagnostics
              </Link>
            </>
          )}

        </div>
      </div>

    </header>
  );
}
