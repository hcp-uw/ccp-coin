"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/landing/nav/Navbar";
import { HeroSection } from "@/components/landing/hero/HeroSection";
// We import these but only show them in modals now
import { HowItWorksSection } from "@/components/landing/how-it-works/HowItWorksSection";
import { FAQSection } from "@/components/landing/faq/FAQSection";
import { LeaderboardSection } from "@/components/landing/leaderboard/LeaderboardSection";
import { useAudio } from "@/components/AudioController";
import { useEscapeKey } from "@/hooks/useEscapeKey";

// 🔌 Layer 2: Supabase only
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Page() {
  const [activeModal, setActiveModal] = useState<
    "signin" | "signup" | "how" | "faq" | "leaderboard" | "forgotPassword" | null
  >(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { playSfx } = useAudio();
  const router = useRouter();

  const clearAuthState = () => {
    setAuthError(null);
    setForgotSent(false);
    setForgotEmail("");
    setForgotLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = forgotEmail.trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    setAuthError(null);

    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setForgotLoading(false);

    if (error) {
      if (error.code === "over_email_send_rate_limit") {
        setAuthError("Too many reset attempts. Please wait a few minutes before trying again.");
      } else {
        setAuthError(error.message);
      }
      return;
    }

    setForgotSent(true);
  };

  const openSignIn = () => {
    clearAuthState();
    setActiveModal("signin");
  };

  const openSignUp = () => {
    clearAuthState();
    setActiveModal("signup");
  };

  const openForgotPassword = () => {
    setAuthError(null);
    setForgotSent(false);
    setActiveModal("forgotPassword");
  };

  const closeModal = () => {
    playSfx("click");
    setActiveModal(null);
    clearAuthState();
  };

  useEscapeKey(closeModal, activeModal !== null);

  const RetroModal = ({
    title,
    isOpen,
    children,
  }: {
    title: string;
    isOpen: boolean;
    children: ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-4 backdrop-blur-sm">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="retro-modal-title"
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border-[4px] border-primary bg-obsidian p-6 shadow-[8px_8px_0px_0px_rgba(0,240,255,0.4)] md:p-10"
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 border-[2px] border-border bg-surface px-3 py-1 font-arcade text-xs text-muted hover:bg-white/10 hover:text-text"
          >
            [ESC] CLOSE
          </button>

          <div className="mb-8 border-b-[2px] border-border pb-4">
            <h2
              id="retro-modal-title"
              className="font-arcade text-2xl text-primary md:text-3xl"
            >
              {title}
            </h2>
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
        <Navbar
          variant="public"
          onSignIn={openSignIn}
          onSignUp={openSignUp}
        />

        {/* Main Screen */}
        <main className="flex-1 overflow-hidden relative mx-auto w-full max-w-[1400px] px-6 py-6 md:py-12 flex flex-col justify-center">
          <HeroSection
            onSignUp={openSignUp}
            onOpenHow={() => setActiveModal("how")}
            onOpenFAQ={() => setActiveModal("faq")}
            onOpenLeaderboard={() => setActiveModal("leaderboard")}
          />
        </main>

        {/* Footer */}
        <footer className="border-t-[2px] border-border bg-obsidian py-2 px-6">
          <div className="mx-auto flex max-w-6xl justify-between items-center font-arcade text-[8px] text-muted md:text-[10px]">
            <span>© 2026 BLOOM ARCADE. ALL RIGHTS RESERVED.</span>
            <span>INSERT COIN TO CONTINUE</span>
          </div>
        </footer>

        {/* SIGN IN */}
        <RetroModal title="SIGN IN" isOpen={activeModal === "signin"}>
          {authError && (
            <p className="text-red-500 font-arcade text-[10px]">{authError}</p>
          )}
          <form
            className="mx-auto w-full max-w-md space-y-6"
            onSubmit={handleSignIn}
          >
            <label className="block font-arcade text-[10px] uppercase text-primary">
              UW Email
              <input
                name="email"
                type="email"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                placeholder="name@uw.edu"
              />
            </label>

            <label className="block font-arcade text-[10px] uppercase text-primary">
              Password
              <input
                name="password"
                type="password"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian"
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={openForgotPassword}
              className="block w-full text-center font-arcade text-[10px] text-primary underline hover:text-text transition-colors"
            >
              FORGOT PASSWORD?
            </button>
          </form>
        </RetroModal>

        {/* FORGOT PASSWORD */}
        <RetroModal title="RECOVER ACCOUNT" isOpen={activeModal === "forgotPassword"}>
          {authError && (
            <p className="text-red-500 font-arcade text-[10px] mb-4">{authError}</p>
          )}
          {forgotSent ? (
            <div className="text-center space-y-4">
              <p className="font-arcade text-[14px] text-xp">CHECK YOUR INBOX</p>
              <p className="font-mono text-sm text-text">
                If an account exists for <span className="text-primary">{forgotEmail}</span>,
                a password reset link has been sent.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setActiveModal("signin");
                }}
                className="border-[2px] border-primary bg-primary/10 px-4 py-2 font-arcade text-[10px] text-primary hover:bg-primary/20 transition-colors"
              >
                BACK TO SIGN IN
              </button>
            </div>
          ) : (
            <form
              className="mx-auto w-full max-w-md space-y-6"
              onSubmit={handleForgotPassword}
            >
              <label className="block font-arcade text-[10px] uppercase text-primary">
                UW Email
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                  placeholder="name@uw.edu"
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotLoading ? "SENDING..." : "SEND RESET LINK"}
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("signin")}
                className="block w-full text-center font-arcade text-[10px] text-muted hover:text-text transition-colors"
              >
                ← BACK TO SIGN IN
              </button>
            </form>
          )}
        </RetroModal>

        {/* SIGN UP */}
        <RetroModal title="NEW CHALLENGER (SIGN UP)" isOpen={activeModal === "signup"}>
          {authError && (
            <p className="text-red-500 font-arcade text-[10px]">{authError}</p>
          )}
          <form
            className="mx-auto w-full max-w-md space-y-6"
            onSubmit={handleSignUp}
          >
            <label className="block font-arcade text-[10px] uppercase text-primary">
              UW Email
              <input
                name="email"
                type="email"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                placeholder="name@uw.edu"
              />
            </label>

            <label className="block font-arcade text-[10px] uppercase text-primary">
              Expected Grad Year
              <input
                type="text"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                placeholder="2027"
              />
            </label>

            <label className="block font-arcade text-[10px] uppercase text-primary">
              Password
              <input
                name="password"
                type="password"
                className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian"
            >
              JOIN THE ARENA
            </button>
          </form>
        </RetroModal>

        {/* HOW / FAQ / LEADERBOARD unchanged */}
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
