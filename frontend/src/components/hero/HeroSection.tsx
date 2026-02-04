"use client";

import { FiArrowRight, FiPlay } from "react-icons/fi";
import { content } from "@/content/content";
import { tickers, aiInsights } from "@/content/mockData";
import { FadeIn } from "@/components/shared/FadeIn";
import { PredictionsConsole } from "@/components/PredictionsConsole";

type HeroSectionProps = {
  onSignUp: () => void;
  onWalkthrough: () => void;
};

export function HeroSection({ onSignUp, onWalkthrough }: HeroSectionProps) {
  return (
    <section className="purple-aura grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
      <FadeIn className="space-y-6">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 className="font-display text-5xl leading-tight text-text sm:text-6xl lg:text-7xl">
          {content.hero.headline}
        </h1>
        <p className="max-w-xl text-lg text-muted">{content.hero.subheadline}</p>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onSignUp}
            className="flex items-center gap-2 rounded-full bg-gold/90 px-6 py-3 text-sm font-semibold text-obsidian transition hover:bg-gold"
          >
            {content.hero.ctaPrimary}
            <FiArrowRight />
          </button>
          <button
            type="button"
            onClick={onWalkthrough}
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
  );
}
