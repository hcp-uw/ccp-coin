"use client";

import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * Features section using editorial split layout (alternating text-left/text-right).
 * First 3 features are displayed as large editorial blocks.
 * Feature 4 (UW Leaderboard) is absorbed into LeaderboardSection.
 * Feature 5 (AI insight) is covered by AINoteSection.
 * No card grid — generous whitespace + bold typography.
 */
export function FeaturesSection() {
  // Only show the first 3 core features in editorial layout
  const editorialFeatures = content.features.items.slice(0, 3);

  return (
    <SectionWrapper id="features">
      <FadeIn className="space-y-4">
        <p className="eyebrow">Features</p>
        <h2 className="font-display text-4xl text-text lg:text-5xl">
          {content.features.title}
        </h2>
        <p className="max-w-2xl text-muted">{content.features.subtitle}</p>
      </FadeIn>

      <div className="mt-16 space-y-24 lg:space-y-32">
        {editorialFeatures.map((feature, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <FadeIn key={feature.title} delay={index * 0.05}>
              <div
                className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-4">
                  <p className="eyebrow">
                    {index === 0 ? "Core loop" : index === 1 ? "Decision format" : "Momentum"}
                  </p>
                  <h3 className="font-display text-3xl text-text lg:text-4xl">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted">{feature.body}</p>
                </div>

                {/* Visual side — abstract accent block */}
                <div className="flex flex-1 items-center justify-center">
                  <div className="relative h-48 w-full max-w-sm rounded-3xl border border-border bg-surface/40 lg:h-56">
                    {/* Decorative accents */}
                    <div
                      className={`absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl ${
                        feature.accent === "gold"
                          ? "bg-gold/20"
                          : feature.accent === "purple"
                            ? "bg-purple/20"
                            : "bg-muted/10"
                      }`}
                    />
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted">
                      {index === 0 && (
                        <div className="flex gap-3">
                          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold">
                            Daily reset
                          </span>
                          <span className="rounded-full border border-border bg-surface-2 px-3 py-1">
                            Fair allocation
                          </span>
                        </div>
                      )}
                      {index === 1 && (
                        <p className="text-sm text-text">One call, one outcome.</p>
                      )}
                      {index === 2 && (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-gold" />
                          <p className="text-xs text-muted">Streaks reward consistency</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
