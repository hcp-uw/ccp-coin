"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { GoldThread } from "@/components/shared/GoldThread";

type CTABandSectionProps = {
  onSignUp: () => void;
};

/**
 * Full-bleed CTA band with primary gradient background, center-aligned layout,
 * and a cyan aura blob for depth.
 */
export function CTABandSection({ onSignUp }: CTABandSectionProps) {
  return (
    <>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

        <FadeIn className="relative mx-auto max-w-2xl px-6 text-center z-10">
          <h2 className="font-display text-4xl text-text lg:text-5xl shadow-primary/50">
            {content.cta.title}
          </h2>
          <p className="mt-4 text-muted font-mono">{content.cta.subtitle}</p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onSignUp}
              className="group flex items-center gap-2 rounded-none border border-primary bg-primary/10 px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary shadow-glow transition-all hover:bg-primary hover:text-obsidian"
            >
              {content.cta.primary}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FiArrowRight className="text-lg" />
              </motion.div>
            </motion.button>
            <a
              href="#how"
              className="text-xs font-mono uppercase tracking-widest text-muted transition hover:text-primary mt-4 inline-block border-b border-transparent hover:border-primary pb-1"
            >
              {content.cta.secondary}
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
