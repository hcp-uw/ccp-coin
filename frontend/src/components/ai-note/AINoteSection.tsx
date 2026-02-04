import { content } from "@/content/content";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * 3-line AI transparency note with gold left-border.
 * No card, no icon — clean editorial style.
 */
export function AINoteSection() {
  return (
    <SectionWrapper className="purple-section-glow">
      <FadeIn className="border-l-2 border-gold/50 pl-6">
        <p className="eyebrow">{content.transparency.title}</p>
        <p className="mt-3 text-sm text-text">{content.transparency.body}</p>
        <p className="mt-2 text-xs text-muted">{content.transparency.note}</p>
      </FadeIn>
    </SectionWrapper>
  );
}
