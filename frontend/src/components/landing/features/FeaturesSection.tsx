"use client";

import { motion } from "framer-motion";
import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * Features section using editorial split layout (alternating text-left/text-right).
 * First 3 features are displayed as large editorial blocks.
 * Feature 4 (UW Leaderboard) is absorbed into LeaderboardSection.
 * Feature 5 (AI insight) is covered by AINoteSection.
 */
export function FeaturesSection() {
  // Only show the first 3 core features in editorial layout
  const editorialFeatures = content.features.items.slice(0, 3);

  return (
    <SectionWrapper id="features" className="purple-section-glow relative">
      <FadeIn className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">FEATURES</p>
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
                className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${isReversed ? "lg:flex-row-reverse" : ""
                  }`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                    {index === 0 ? "SYS_INIT // Core loop" : index === 1 ? "PARAMS // Decision format" : "MULTIPLIER // Momentum"}
                  </p>
                  <h3 className="font-display text-3xl text-text lg:text-4xl shadow-secondary/50">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted">{feature.body}</p>
                </div>

                {/* Visual side — abstract accent block */}
                <div className="flex flex-1 items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: isReversed ? -5 : 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative h-48 w-full max-w-sm rounded-[16px] border border-secondary/20 bg-surface/80 lg:h-56 backdrop-blur-sm shadow-[0_0_40px_rgba(184,41,255,0.05)]"
                    style={{ perspective: 1000 }}
                  >
                    {/* Decorative accents */}
                    <div
                      className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl ${feature.accent === "gold"
                        ? "bg-primary/20"
                        : feature.accent === "purple"
                          ? "bg-secondary/20"
                          : "bg-xp/20"
                        }`}
                    />

                    {/* Arcade Grid background */}
                    <div className="absolute inset-0 rounded-[16px] overflow-hidden opacity-10 pointer-events-none">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(226,232,240,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.5)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    </div>

                    <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-muted relative z-10">
                      {index === 0 && (
                        <div className="flex gap-3">
                          <span className="rounded-none border border-primary/40 bg-primary/10 px-3 py-1 text-primary shadow-glow">
                            Daily reset
                          </span>
                          <span className="rounded-none border border-border bg-surface-2 px-3 py-1 text-text">
                            Fair allocation
                          </span>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="border border-border bg-obsidian/80 px-6 py-4 rounded-none">
                          <p className="text-sm text-text">&gt; One call. One outcome.</p>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-[1px] bg-secondary mt-2"
                          />
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-xs text-xp font-bold">X2 STREAK BONUS_</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                                className="h-2 w-8 bg-xp"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
