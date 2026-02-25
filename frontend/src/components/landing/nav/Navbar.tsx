"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { content } from "@/content/content";
import { MobileMenu } from "./MobileMenu";
import { AudioToggle, useAudio } from "@/components/AudioController";
import { ArcadeButton } from "@/components/shared/ArcadeButton";

type NavbarProps =
  | { variant: "public"; onSignIn: () => void; onSignUp: () => void }
  | { variant: "dashboard"; username: string; onLogout: () => void; onProfile: () => void };

export function Navbar(props: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { playSfx } = useAudio();

  const wordmark = (
    <div className="flex items-center gap-3">
      <span className="font-arcade text-lg text-primary">{content.nav.wordmark}</span>
      <span className="border-[2px] border-border bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-muted">
        {content.nav.uwTag}
      </span>
    </div>
  );

  if (props.variant === "dashboard") {
    return (
      <header className="sticky top-0 z-40 border-b-[2px] border-border bg-obsidian shrink-0">
        <nav className="mx-auto flex max-w-full items-center justify-between px-6 py-4">
          {wordmark}
          <div className="flex items-center gap-3">
            <span className="border-[2px] border-border bg-surface px-3 py-1 font-arcade text-[8px] text-muted">
              {props.username}
            </span>
            <ArcadeButton
              variant="neutral"
              onClick={() => { playSfx("click"); props.onProfile(); }}
              onMouseEnter={() => playSfx("hover")}
            >
              PROFILE
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
      </header>
    );
  }

  // Public variant
  return (
    <header className="sticky top-0 z-40 border-b-[2px] border-border bg-obsidian">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          {wordmark}
        </div>

        {/* Desktop Controls */}
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

        {/* Mobile controls */}
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
