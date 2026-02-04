"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { content } from "@/content/content";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/nav/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { CredibilityStrip } from "@/components/credibility/CredibilityStrip";
import { HowItWorksSection } from "@/components/how-it-works/HowItWorksSection";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { AINoteSection } from "@/components/ai-note/AINoteSection";
import { LeaderboardSection } from "@/components/leaderboard/LeaderboardSection";
import { FAQSection } from "@/components/faq/FAQSection";
import { CTABandSection } from "@/components/cta/CTABandSection";
import { FooterSection } from "@/components/footer/FooterSection";

export default function Page() {
  const [activeModal, setActiveModal] = useState<"signin" | "signup" | "walkthrough" | null>(null);

  const openSignIn = () => setActiveModal("signin");
  const openSignUp = () => setActiveModal("signup");
  const openWalkthrough = () => setActiveModal("walkthrough");
  const closeModal = () => setActiveModal(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-shell">
        <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />

        <main className="mx-auto max-w-6xl px-6">
          <HeroSection onSignUp={openSignUp} onWalkthrough={openWalkthrough} />
          <CredibilityStrip />
          <HowItWorksSection />
          <FeaturesSection />
          <AINoteSection />
          <LeaderboardSection />
          <FAQSection />
        </main>

        <CTABandSection onSignUp={openSignUp} />
        <FooterSection />

        <Modal
          isOpen={activeModal === "signin"}
          onClose={closeModal}
          title="Sign in"
          ariaLabel="Sign in to DubQuant"
        >
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
              UW Email
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-border bg-obsidian/70 px-3 py-2 text-sm text-text"
                placeholder="name@uw.edu"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
              Password
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-border bg-obsidian/70 px-3 py-2 text-sm text-text"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-gold/90 px-4 py-2 text-sm font-semibold text-obsidian"
            >
              Continue
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={activeModal === "signup"}
          onClose={closeModal}
          title="Sign up"
          ariaLabel="Sign up for DubQuant"
        >
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
              UW Email
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-border bg-obsidian/70 px-3 py-2 text-sm text-text"
                placeholder="name@uw.edu"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
              Expected Grad Year
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-border bg-obsidian/70 px-3 py-2 text-sm text-text"
                placeholder="2027"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-gold/90 px-4 py-2 text-sm font-semibold text-obsidian"
            >
              Join
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={activeModal === "walkthrough"}
          onClose={closeModal}
          title="DubQuant walkthrough"
          ariaLabel="Watch DubQuant walkthrough"
        >
          <div className="space-y-4">
            <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-surface-2 text-sm text-muted">
              Walkthrough video placeholder
            </div>
            <p className="text-sm text-muted">
              This is a placeholder preview. The full walkthrough will demonstrate the daily
              DubCoins loop and prediction flow.
            </p>
          </div>
        </Modal>
      </div>
    </MotionConfig>
  );
}
