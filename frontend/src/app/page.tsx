"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/landing/nav/Navbar";
import { HeroSection } from "@/components/landing/hero/HeroSection";
// We import these but only show them in modals now
import { HowItWorksSection } from "@/components/landing/how-it-works/HowItWorksSection";
import { FAQSection } from "@/components/landing/faq/FAQSection";
import { LeaderboardSection } from "@/components/landing/leaderboard/LeaderboardSection";
import { useAudio } from "@/components/AudioController";

export default function Page() {
  const [activeModal, setActiveModal] = useState<"signin" | "signup" | "how" | "faq" | "leaderboard" | null>(null);
  const { playSfx } = useAudio();

  const openSignIn = () => setActiveModal("signin");
  const openSignUp = () => setActiveModal("signup");

  const closeModal = () => {
    playSfx("click");
    setActiveModal(null);
  };

  const RetroModal = ({ title, isOpen, children }: { title: string, isOpen: boolean, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-4 backdrop-blur-sm">
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border-[4px] border-primary bg-obsidian p-6 shadow-[8px_8px_0px_0px_rgba(0,240,255,0.4)] md:p-10">
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 border-[2px] border-border bg-surface px-3 py-1 font-arcade text-xs text-muted hover:bg-white/10 hover:text-text"
          >
            [X] CLOSE
          </button>
          <div className="mb-8 border-b-[2px] border-border pb-4">
            <h2 className="font-arcade text-2xl text-primary md:text-3xl">{title}</h2>
          </div>
          <div className="prose prose-invert max-w-none font-mono text-text">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-shell flex h-screen flex-col overflow-hidden bg-obsidian relative">
        <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />

        {/* Main Attract Mode Screen */}
        <main className="flex-1 overflow-hidden relative mx-auto w-full max-w-[1400px] px-6 py-6 md:py-12 flex flex-col justify-center">
          <HeroSection
            onSignUp={openSignUp}
            onOpenHow={() => setActiveModal("how")}
            onOpenFAQ={() => setActiveModal("faq")}
            onOpenLeaderboard={() => setActiveModal("leaderboard")}
          />
        </main>

        {/* Footer info strip */}
        <footer className="border-t-[2px] border-border bg-obsidian py-2 px-6">
          <div className="mx-auto flex max-w-6xl justify-between items-center font-arcade text-[8px] text-muted md:text-[10px]">
            <span>© 2026 BLOOM ARCADE. ALL RIGHTS RESERVED.</span>
            <span>INSERT COIN TO CONTINUE</span>
          </div>
        </footer>

        {/* --- Modals --- */}
        <RetroModal title="SIGN IN" isOpen={activeModal === "signin"}>
          <form className="mx-auto w-full max-w-md space-y-6" onSubmit={(e) => e.preventDefault()}>
            <label className="block font-arcade text-[10px] uppercase text-primary">
              UW Email
              <input
                type="email"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="name@uw.edu"
              />
            </label>
            <label className="block font-arcade text-[10px] uppercase text-primary">
              Password
              <input
                type="password"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian transition-colors hover:bg-xp/90 hover:shadow-[4px_4px_0px_0px_rgba(255,215,0,0.4)]"
            >
              LOGIN
            </button>
          </form>
        </RetroModal>

        <RetroModal title="NEW CHALLENGER (SIGN UP)" isOpen={activeModal === "signup"}>
          <form className="mx-auto w-full max-w-md space-y-6" onSubmit={(e) => e.preventDefault()}>
            <label className="block font-arcade text-[10px] uppercase text-primary">
              UW Email
              <input
                type="email"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="name@uw.edu"
              />
            </label>
            <label className="block font-arcade text-[10px] uppercase text-primary">
              Expected Grad Year
              <input
                type="text"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="2027"
              />
            </label>
            <button
              type="submit"
              className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian transition-colors hover:bg-xp/90 hover:shadow-[4px_4px_0px_0px_rgba(255,215,0,0.4)]"
            >
              JOIN THE ARENA
            </button>
          </form>
        </RetroModal>

        <RetroModal title="INSTRUCTION MANUAL" isOpen={activeModal === "how"}>
          <HowItWorksSection />
        </RetroModal>

        <RetroModal title="SYSTEM FAQ" isOpen={activeModal === "faq"}>
          <FAQSection />
        </RetroModal>

        <RetroModal title="HALL OF FAME" isOpen={activeModal === "leaderboard"}>
          <div className="pb-8">
            <LeaderboardSection />
          </div>
        </RetroModal>

      </div>
    </MotionConfig>
  );
}
