"use client";

import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * How It Works section using a connected timeline layout.
 * Desktop: horizontal timeline — 4 gold-bordered circles connected by a gold line.
 * Mobile: vertical timeline — gold line on left, steps branching right.
 * No cards, no surface-card wrappers.
 */
export function HowItWorksSection() {
  const { steps } = content.howItWorks;

  return (
    <SectionWrapper id="how" className="purple-section-glow">
      <FadeIn className="space-y-4">
        <p className="eyebrow">Process</p>
        <h2 className="font-display text-4xl text-text lg:text-5xl">
          {content.howItWorks.title}
        </h2>
        <p className="max-w-2xl text-muted">{content.howItWorks.subtitle}</p>
      </FadeIn>

      {/* Desktop: horizontal timeline */}
      <div className="mt-16 hidden lg:block">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.08}>
                {/* Circle node */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-obsidian text-sm font-semibold text-gold">
                    0{index + 1}
                  </div>
                </div>
                {/* Content below */}
                <h3 className="text-center font-display text-2xl text-text lg:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-center text-sm text-muted">{step.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="mt-10 lg:hidden">
        <div className="relative border-l border-gold/40 pl-12">
          {steps.map((step, index) => (
            <FadeIn
              key={step.title}
              className={`relative pb-10 ${index === steps.length - 1 ? "pb-0" : ""}`}
              delay={index * 0.05}
            >
              {/* Circle node on the line */}
              <div className="absolute -left-16 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 bg-obsidian text-xs font-semibold text-gold">
                0{index + 1}
              </div>
              <h3 className="font-display text-2xl text-text">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
