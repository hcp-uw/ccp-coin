import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * 3-line AI transparency note with primary neon left-border.
 * Terminal styling.
 */
export function AINoteSection() {
  return (
    <SectionWrapper className="purple-section-glow pb-32">
      <FadeIn className="border-l-4 border-primary/50 bg-primary/5 pl-6 py-4 rounded-r-lg max-w-3xl">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          {content.transparency.title}
        </p>
        <p className="mt-3 text-sm font-mono text-text leading-relaxed">
          {content.transparency.body}
        </p>
        <p className="mt-4 text-xs font-mono text-muted border-t border-primary/20 pt-2 inline-block">
          &gt; {content.transparency.note}
        </p>
      </FadeIn>
    </SectionWrapper>
  );
}
