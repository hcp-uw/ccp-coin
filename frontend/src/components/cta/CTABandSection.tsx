"use client";

import { FiArrowRight } from "react-icons/fi";
import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { GoldThread } from "@/components/shared/GoldThread";

type CTABandSectionProps = {
  onSignUp: () => void;
};

/**
 * Full-bleed CTA band with gold gradient background, center-aligned layout,
 * and a purple aura blob for depth.
 */
export function CTABandSection({ onSignUp }: CTABandSectionProps) {
  return (
    <>
      <GoldThread />
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-gold/10 to-gold/5" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/15 blur-3xl" />

        <FadeIn className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-4xl text-text lg:text-5xl">
            {content.cta.title}
          </h2>
          <p className="mt-4 text-muted">{content.cta.subtitle}</p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onSignUp}
              className="flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-obsidian transition hover:bg-gold/90"
            >
              {content.cta.primary}
              <FiArrowRight />
            </button>
            <a
              href="#how"
              className="text-xs uppercase tracking-[0.2em] text-muted transition hover:text-text"
            >
              {content.cta.secondary}
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
