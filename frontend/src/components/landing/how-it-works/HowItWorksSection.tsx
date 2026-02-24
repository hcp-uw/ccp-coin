"use client";

import { motion } from "framer-motion";
import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";

export function HowItWorksSection() {
  const { steps } = content.howItWorks;

  return (
    <div id="how" className="w-full">
      <div className="relative border-l-[4px] border-primary ml-4 pl-8 py-4">
        {/* Animated vertical line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute left-[-4px] top-0 w-[4px] bg-primary shadow-[0_0_10px_rgba(0,240,255,1)] origin-top"
        />

        <div className="space-y-12">
          {steps.map((step, index) => (
            <FadeIn
              key={step.title}
              className="relative"
              delay={index * 0.2}
            >
              {/* Box node on the line */}
              <div className="absolute -left-[3.25rem] top-0 flex h-10 w-10 items-center justify-center border-[4px] border-primary bg-obsidian text-xs font-arcade text-primary shadow-[4px_4px_0_rgba(0,240,255,0.4)]">
                0{index + 1}
              </div>
              <h3 className="font-arcade text-base text-text uppercase mb-2">{step.title}</h3>
              <p className="text-sm font-mono text-muted leading-relaxed">{step.body}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
