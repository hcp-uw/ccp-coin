"use client";

import { useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiInfo, FiPlay, FiTrendingUp } from "react-icons/fi";
import { content } from "@/content/content";
import { aiInsights, faqs, leaderboard, tickers } from "@/content/mockData";
import { Modal } from "@/components/Modal";
import { PredictionsConsole } from "@/components/PredictionsConsole";

const FadeIn = ({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Page() {
  const [activeModal, setActiveModal] = useState<"signin" | "signup" | "walkthrough" | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-shell">
        <header className="sticky top-0 z-40 border-b border-border bg-obsidian/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl">{content.nav.wordmark}</span>
              <span className="rounded-full border border-border bg-surface/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted">
                {content.nav.uwTag}
              </span>
            </div>
            <div className="hidden items-center gap-6 text-sm text-muted md:flex">
              {content.nav.links.map((link) => (
                <a key={link.href} href={link.href} className="transition hover:text-text">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal("signin")}
                className="rounded-full border border-border bg-surface/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-text"
              >
                {content.nav.signIn}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("signup")}
                className="rounded-full bg-gold/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian transition hover:bg-gold"
              >
                {content.nav.signUp}
              </button>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6">
          <section className="grid gap-12 pb-16 pt-16 lg:grid-cols-[1.1fr_0.9fr]">
            <FadeIn className="space-y-6">
              <p className="text-xs uppercase tracking-[0.32em] text-muted">{content.hero.eyebrow}</p>
              <h1 className="font-display text-4xl leading-tight text-text sm:text-5xl">
                {content.hero.headline}
              </h1>
              <p className="max-w-xl text-lg text-muted">{content.hero.subheadline}</p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setActiveModal("signup")}
                  className="flex items-center gap-2 rounded-full bg-gold/90 px-6 py-3 text-sm font-semibold text-obsidian transition hover:bg-gold"
                >
                  {content.hero.ctaPrimary}
                  <FiArrowRight />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("walkthrough")}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface/70 px-6 py-3 text-sm text-text transition hover:border-gold/60"
                >
                  <FiPlay />
                  {content.hero.ctaSecondary}
                </button>
              </div>

              <div className="grid gap-3 text-sm text-muted">
                {content.hero.supporting.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </FadeIn>

            <FadeIn className="flex justify-center" delay={0.1}>
              <PredictionsConsole tickers={tickers} aiInsights={aiInsights} />
            </FadeIn>
          </section>

          <section className="surface-card mb-16 px-6 py-5">
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted">
              <span>{content.socialProof.label}</span>
              <div className="hidden h-4 w-px bg-border md:block" />
              <div className="flex flex-wrap gap-4 text-[11px] tracking-[0.2em]">
                {content.socialProof.items.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-obsidian/60 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="how" className="pb-16">
            <FadeIn className="space-y-4">
              <h2 className="font-display text-3xl text-text">{content.howItWorks.title}</h2>
              <p className="max-w-2xl text-muted">{content.howItWorks.subtitle}</p>
            </FadeIn>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {content.howItWorks.steps.map((step, index) => (
                <FadeIn
                  key={step.title}
                  className={`surface-card relative flex h-full flex-col gap-4 p-6 ${
                    index % 2 === 0 ? "lg:translate-y-0" : "lg:translate-y-8"
                  }`}
                  delay={index * 0.05}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-sm font-semibold text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-text">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted">{step.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <section id="features" className="pb-16">
            <FadeIn className="space-y-4">
              <h2 className="font-display text-3xl text-text">{content.features.title}</h2>
              <p className="max-w-2xl text-muted">{content.features.subtitle}</p>
            </FadeIn>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <FadeIn className="surface-card flex flex-col justify-between p-6 lg:col-span-7">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Core loop</p>
                  <h3 className="mt-2 font-display text-2xl text-text">{content.features.items[0].title}</h3>
                  <p className="mt-3 text-sm text-muted">{content.features.items[0].body}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-gold">
                    Daily reset
                  </span>
                  <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
                    Fair allocation
                  </span>
                </div>
              </FadeIn>

              <FadeIn className="surface-card p-6 lg:col-span-5">
                <h3 className="font-display text-xl text-text">{content.features.items[1].title}</h3>
                <p className="mt-3 text-sm text-muted">{content.features.items[1].body}</p>
                <div className="mt-6 rounded-2xl border border-border bg-obsidian/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Decision format</p>
                  <p className="mt-2 text-sm text-text">One call, one outcome.</p>
                </div>
              </FadeIn>

              <FadeIn className="surface-card p-6 lg:col-span-4">
                <h3 className="font-display text-xl text-text">{content.features.items[2].title}</h3>
                <p className="mt-3 text-sm text-muted">{content.features.items[2].body}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gold" />
                  <p className="text-xs text-muted">Streaks reward consistency</p>
                </div>
              </FadeIn>

              <FadeIn className="surface-card p-6 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-text">{content.features.items[3].title}</h3>
                    <p className="mt-2 text-sm text-muted">{content.features.items[3].body}</p>
                  </div>
                  <div className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs text-muted">
                    UW-only ranking
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-border bg-obsidian/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Optional layer</p>
                  <p className="mt-2 text-sm text-muted">{content.features.items[4].body}</p>
                </div>
              </FadeIn>
            </div>
          </section>

          <section className="pb-16">
            <FadeIn className="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2">
                <FiInfo className="text-gold" />
              </div>
              <div>
                <p className="text-sm text-text">{content.disclaimers.primary}</p>
                <p className="text-xs text-muted">{content.disclaimers.secondary}</p>
              </div>
            </FadeIn>
          </section>

          <section id="leaderboard" className="pb-16">
            <FadeIn className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Leaderboard preview</p>
                <h2 className="mt-2 font-display text-3xl text-text">UW daily standings</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-xs text-muted">
                <FiTrendingUp />
                Mocked sample
              </div>
            </FadeIn>

            <div className="surface-card mt-8 p-6" data-testid="leaderboard">
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 text-xs uppercase tracking-[0.2em] text-muted">
                <span>Rank</span>
                <span>Student</span>
                <span>Streak</span>
                <span>DubCoins</span>
              </div>
              <div className="mt-4 space-y-3">
                {leaderboard.map((row) => (
                  <div
                    key={row.rank}
                    className={`grid grid-cols-[80px_1fr_120px_120px] items-center gap-4 rounded-2xl border border-border px-4 py-3 text-sm ${
                      row.rank === 1 ? "bg-gold/10" : "bg-surface-2/60"
                    }`}
                  >
                    <span className="font-display text-lg text-text">#{row.rank}</span>
                    <div>
                      <p className="text-text">{row.name}</p>
                      <p className="text-xs text-muted">Accuracy {row.accuracy}</p>
                    </div>
                    <span className="text-text">{row.streak} days</span>
                    <span className="text-text">{row.coins}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-16">
            <FadeIn className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{content.transparency.title}</p>
              <p className="mt-3 text-sm text-text">{content.transparency.body}</p>
              <p className="mt-2 text-xs text-muted">{content.transparency.note}</p>
            </FadeIn>
          </section>

          <section id="faq" className="pb-16">
            <FadeIn>
              <h2 className="font-display text-3xl text-text">FAQ</h2>
              <p className="mt-2 text-muted">Answers for the most common questions.</p>
            </FadeIn>

            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="surface-card p-5">
                  <summary className="faq-summary flex cursor-pointer items-center gap-4 text-sm font-semibold text-text">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="pb-20">
            <FadeIn className="surface-card relative overflow-hidden p-8">
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
              <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-purple/20 blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <h2 className="font-display text-3xl text-text">{content.cta.title}</h2>
                  <p className="mt-3 text-sm text-muted">{content.cta.subtitle}</p>
                </div>
                <div className="flex flex-col items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal("signup")}
                    className="flex items-center gap-2 rounded-full bg-gold/90 px-6 py-3 text-sm font-semibold text-obsidian transition hover:bg-gold"
                  >
                    {content.cta.primary}
                    <FiArrowRight />
                  </button>
                  <a href="#how" className="text-xs uppercase tracking-[0.2em] text-muted">
                    {content.cta.secondary}
                  </a>
                </div>
              </div>
            </FadeIn>
          </section>
        </main>

        <footer className="border-t border-border bg-surface/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <p className="font-display text-xl text-text">DubQuant</p>
              <p className="mt-3 text-sm text-muted">{content.disclaimers.primary}</p>
              <p className="mt-2 text-xs text-muted">{content.disclaimers.secondary}</p>
            </div>
            {content.footer.columns.map((column) => (
              <div key={column.title} className="space-y-3 text-sm text-muted">
                <p className="text-xs uppercase tracking-[0.2em] text-text">{column.title}</p>
                {column.links.map((link) => (
                  <p key={link}>{link}</p>
                ))}
              </div>
            ))}
          </div>
        </footer>

        <Modal
          isOpen={activeModal === "signin"}
          onClose={() => setActiveModal(null)}
          title="Sign in"
          ariaLabel="Sign in to DubQuant"
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
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
          onClose={() => setActiveModal(null)}
          title="Sign up"
          ariaLabel="Sign up for DubQuant"
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
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
          onClose={() => setActiveModal(null)}
          title="DubQuant walkthrough"
          ariaLabel="Watch DubQuant walkthrough"
        >
          <div className="space-y-4">
            <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-surface-2 text-sm text-muted">
              Walkthrough video placeholder
            </div>
            <p className="text-sm text-muted">
              This is a placeholder preview. The full walkthrough will demonstrate the daily DubCoins loop and
              prediction flow.
            </p>
          </div>
        </Modal>
      </div>
    </MotionConfig>
  );
}
