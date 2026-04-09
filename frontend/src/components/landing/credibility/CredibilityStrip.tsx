import { content } from "@/content/content";

/**
 * Horizontal credibility strip with gold top/bottom borders.
 * No card wrapper — items separated by gold middot characters.
 */
export function CredibilityStrip() {
  return (
    <div className="border-y border-gold/20 px-6 py-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.3em] text-muted">
        <span className="font-semibold text-gold/70">{content.socialProof.label}</span>
        {content.socialProof.items.map((item, index) => (
          <span key={item} className="flex items-center gap-3">
            {index > 0 && <span className="text-gold/40" aria-hidden="true">&middot;</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
