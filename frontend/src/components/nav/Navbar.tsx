"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { content } from "@/content/content";
import { MobileMenu } from "./MobileMenu";

type NavbarProps = {
  onSignIn: () => void;
  onSignUp: () => void;
};

export function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-obsidian/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl">{content.nav.wordmark}</span>
          <span className="rounded-full border border-border bg-surface/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted">
            {content.nav.uwTag}
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 text-sm text-muted md:flex">
          {content.nav.links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-text">
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onSignIn}
            className="rounded-full border border-border bg-surface/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-text"
          >
            {content.nav.signIn}
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="rounded-full bg-gold/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian transition hover:bg-gold"
          >
            {content.nav.signUp}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:text-text md:hidden"
        >
          <FiMenu size={20} />
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={content.nav.links}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        signInLabel={content.nav.signIn}
        signUpLabel={content.nav.signUp}
      />
    </header>
  );
}
