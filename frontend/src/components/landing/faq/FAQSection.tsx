"use client";

import { motion } from "framer-motion";
import { faqs } from "@/content/mockData";
import { FadeIn } from "@/components/shared/FadeIn";

export function FAQSection() {
  return (
    <div id="faq" className="w-full">
      <div className="divide-y-[2px] divide-border">
        {faqs.map((faq, index) => (
          <FadeIn key={faq.question} delay={index * 0.1}>
            <details className="group border-[2px] border-border bg-obsidian mb-2">
              <summary className="faq-summary flex w-full cursor-pointer items-center gap-4 py-4 px-4 font-arcade text-[10px] text-text transition-colors hover:bg-white/[0.05] hover:text-secondary">
                <span className="text-secondary">[{index + 1}]</span>
                {faq.question}
                <svg
                  className="faq-chevron ml-auto h-4 w-4 shrink-0 text-secondary transition-transform group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pb-5 px-4 text-xs text-text/80 font-mono border-t-[2px] border-border/50 bg-black/20 pt-4"
              >
                {faq.answer}
              </motion.div>
            </details>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
