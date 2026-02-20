"use client";

import { faqs } from "@/content/mockData";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export function FAQSection() {
  return (
    <SectionWrapper id="faq" className="purple-section-glow">
      <FadeIn>
        <p className="eyebrow">Support</p>
        <h2 className="mt-2 font-display text-4xl text-text lg:text-5xl">FAQ</h2>
        <p className="mt-2 text-muted">Answers for the most common questions.</p>
      </FadeIn>

      <div className="mt-8 divide-y divide-gold/10">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="faq-summary flex cursor-pointer items-center gap-4 text-sm font-semibold text-text">
              {faq.question}
              <svg
                className="faq-chevron ml-auto h-4 w-4 shrink-0 text-purple/50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionWrapper>
  );
}
