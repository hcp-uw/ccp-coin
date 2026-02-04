import { content } from "@/content/content";

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-text">DubQuant</p>
          <p className="mt-3 text-sm text-muted">{content.disclaimers.primary}</p>
          <p className="mt-2 text-xs text-muted">{content.disclaimers.secondary}</p>
        </div>
        {content.footer.columns.map((column) => (
          <div key={column.title} className="space-y-3 text-sm text-muted">
            <p className="text-xs uppercase tracking-[0.2em] text-text">{column.title}</p>
            {column.links.map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
