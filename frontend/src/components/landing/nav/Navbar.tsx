"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { content } from "@/content/content";
import { MobileMenu } from "./MobileMenu";
import { AudioToggle, useAudio } from "@/components/AudioController";
import { motion } from "framer-motion";

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
        <div className="flex items-center gap-3">
          <span className="font-arcade text-lg text-primary">{content.nav.wordmark}</span>
          <span className="border-[2px] border-border bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-muted">
            {content.nav.uwTag}
          </span>
        </div>



        {/* Desktop Controls */}
        <div className="hidden items-center gap-4 md:flex">
          <AudioToggle />

          <button
            type="button"
            onClick={() => { playSfx("click"); onSignIn(); }}
            onMouseEnter={() => playSfx("hover")}
            className="border-[2px] border-border bg-surface px-4 py-2 font-arcade text-[10px] uppercase text-text transition-colors hover:bg-white/10"
          >
            {content.nav.signIn}
          </button>
          <motion.button
            whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px 0px rgba(255, 215, 0, 1)" }}
            type="button"
            onClick={() => { playSfx("start"); onSignUp(); }}
            onMouseEnter={() => playSfx("hover")}
            style={{ boxShadow: "4px 4px 0px 0px rgba(255, 215, 0, 1)" }}
            className="border-[2px] border-xp bg-xp/20 px-4 py-2 font-arcade text-[10px] uppercase text-xp transition-colors hover:bg-xp/40"
          >
            {content.nav.signUp}
          </motion.button>
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
    </header>
  );
}
