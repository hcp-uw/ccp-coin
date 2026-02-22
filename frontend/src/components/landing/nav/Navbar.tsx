"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { content } from "@/content/content";
import { MobileMenu } from "./MobileMenu";
import { AudioToggle, useAudio } from "@/components/AudioController";
import { ArcadeButton } from "@/components/shared/ArcadeButton";

type NavbarProps = {
  onSignIn: () => void;
  onSignUp: () => void;
};

export function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { playSfx } = useAudio();

  return (
    <header className="sticky top-0 z-40 border-b-[2px] border-border bg-obsidian">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-arcade text-lg text-primary">{content.nav.wordmark}</span>
            <span className="border-[2px] border-border bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-muted">
              {content.nav.uwTag}
            </span>
          </div>

          <div className="hidden items-center md:block">
            {/* Audio Toggle exported from component directly now? No, it's a separate component. */}
          </div>
        </div>



        {/* Desktop Controls */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="mr-2">
            <AudioToggle />
          </div>

          <ArcadeButton
            variant="success"
            onClick={() => { playSfx("click"); onSignIn(); }}
            onMouseEnter={() => playSfx("hover")}
          >
            {content.nav.signIn}
          </ArcadeButton>
          <ArcadeButton
            variant="warning"
            onClick={() => { playSfx("start"); onSignUp(); }}
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
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={[]}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        signInLabel={content.nav.signIn}
        signUpLabel={content.nav.signUp}
      />
    </header >
  );
}
