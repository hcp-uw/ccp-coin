"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { content } from "@/content/content";
import { MobileMenu } from "./MobileMenu";
import { AudioToggle, useAudio } from "@/components/AudioController";
import { ArcadeButton } from "@/components/shared/ArcadeButton";

type DashboardStats = {
  balance: number;
  streak: number;
  rank: number;
  accuracy: number;
};

type NavbarProps =
  | { variant: "public"; onSignIn: () => void; onSignUp: () => void }
  | { variant: "dashboard"; username: string; stats?: DashboardStats; onLogout: () => void; onProfile: () => void; onHome?: () => void };

export function Navbar(props: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { playSfx } = useAudio();

  const wordmark = (
    <div className="flex items-center gap-3">
      <span className="font-arcade text-lg text-primary">{content.nav.wordmark}</span>
      <span className="border-[2px] border-border bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-muted">
        {content.nav.uwTag}
      </span>
    </div>
  );

  const navLinkClass = (href: string) =>
    `font-arcade text-[9px] uppercase tracking-[0.2em] transition ${pathname === href ? "text-xp" : "text-muted hover:text-text"}`;

  if (props.variant === "dashboard") {
    const streakBorderClass = props.stats
      ? props.stats.streak >= 10
        ? "border-secondary shadow-[4px_4px_0px_0px_rgb(var(--color-secondary)_/_0.4)]"
        : props.stats.streak >= 5
        ? "border-xp shadow-[4px_4px_0px_0px_rgb(var(--color-xp)_/_0.4)]"
        : "border-border"
      : "border-border";

    return (
      <header className="sticky top-0 z-40 border-b-[2px] border-border bg-obsidian shrink-0">
        <nav className="mx-auto flex max-w-full items-center justify-between px-6 py-3">
          {wordmark}

          {props.stats && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="border-[2px] border-border bg-surface/60 px-3 py-1 flex flex-col items-center gap-0.5">
                <span className="font-arcade text-xs text-xp">{props.stats.balance} DC</span>
                <span className="font-arcade text-[7px] text-muted">BAL</span>
              </div>
              <div className={`border-[2px] bg-surface/60 px-3 py-1 flex flex-col items-center gap-0.5 ${streakBorderClass}`}>
                <span className="font-arcade text-xs text-primary">{props.stats.streak}x</span>
                <span className="font-arcade text-[7px] text-muted">STREAK</span>
              </div>
              <div className="border-[2px] border-border bg-surface/60 px-3 py-1 flex flex-col items-center gap-0.5">
                <span className="font-arcade text-xs text-secondary">#{props.stats.rank}</span>
                <span className="font-arcade text-[7px] text-muted">RANK</span>
              </div>
              <div className="border-[2px] border-border bg-surface/60 px-3 py-1 flex flex-col items-center gap-0.5">
                <span className="font-arcade text-xs text-up">{props.stats.accuracy}%</span>
                <span className="font-arcade text-[7px] text-muted">ACC</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => { playSfx("click"); setMobileOpen(true); }}
            aria-label="Open menu"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border-[2px] border-border bg-obsidian text-muted transition-colors hover:text-text lg:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <span className="border-[2px] border-border bg-surface px-3 py-1 font-arcade text-[8px] text-muted">
              {props.username}
            </span>
            {props.onHome && (
              <ArcadeButton
                variant="success"
                onClick={() => { playSfx("click"); props.onHome!(); }}
                onMouseEnter={() => playSfx("hover")}
              >
                DASHBOARD
              </ArcadeButton>
            )}
            <ArcadeButton
              variant="neutral"
              onClick={() => { playSfx("click"); props.onProfile(); }}
              onMouseEnter={() => playSfx("hover")}
            >
              PROFILE
            </ArcadeButton>
            <ArcadeButton
              variant="warning"
              onClick={() => { playSfx("click"); window.location.href = "/leaderboard"; }}
              onMouseEnter={() => playSfx("hover")}
            >
              LEADERBOARD
            </ArcadeButton>
            <ArcadeButton
              variant="danger"
              onClick={() => { playSfx("click"); props.onLogout(); }}
              onMouseEnter={() => playSfx("hover")}
            >
              LOGOUT
            </ArcadeButton>
          </div>
        </nav>

        <MobileMenu
          variant="dashboard"
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          links={[]}
          onLogout={props.onLogout}
          onProfile={props.onProfile}
          onHome={props.onHome}
          username={props.username}
        />
      </header>
    );
  }

  // Public variant
  return (
    <header className="sticky top-0 z-40 border-b-[2px] border-border bg-obsidian">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          {wordmark}
          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/leaderboard" className={navLinkClass("/leaderboard")}>
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="mr-2">
            <AudioToggle />
          </div>
          <ArcadeButton
            variant="success"
            onClick={() => { playSfx("click"); props.onSignIn(); }}
            onMouseEnter={() => playSfx("hover")}
          >
            {content.nav.signIn}
          </ArcadeButton>
          <ArcadeButton
            variant="warning"
            onClick={() => { playSfx("start"); props.onSignUp(); }}
            onMouseEnter={() => playSfx("hover")}
          >
            {content.nav.signUp}
          </ArcadeButton>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <AudioToggle />
          <button
            type="button"
            onClick={() => { playSfx("click"); setMobileOpen(true); }}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center border-[2px] border-border bg-obsidian text-muted transition-colors hover:text-text md:hidden"
          >
            <FiMenu size={20} />
          </button>
        </div>
      </nav>

      <MobileMenu
        variant="public"
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={[]}
        onSignIn={props.onSignIn}
        onSignUp={props.onSignUp}
        signInLabel={content.nav.signIn}
        signUpLabel={content.nav.signUp}
      />
    </header>
  );
}
