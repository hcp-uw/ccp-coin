import { content } from "@/content/content";

export function FooterSection() {
  return (
    <footer className="border-t-2 border-primary/20 bg-obsidian relative overflow-hidden">
      {/* Decorative Arcade Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] relative z-10">
        <div>
          <p className="font-display text-2xl text-text font-bold tracking-wider">DubQuant<span className="text-primary animate-pulse">_</span></p>
          <p className="mt-4 text-xs font-mono text-muted">{content.disclaimers.primary}</p>
          <p className="mt-2 text-[10px] font-mono text-muted/60 uppercase tracking-widest">{content.disclaimers.secondary}</p>
        </div>
        {content.footer.columns.map((column) => (
          <div key={column.title} className="space-y-4 text-sm font-mono text-muted">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">{column.title}</p>
            {column.links.map((link) => (
              <p key={link}>
                <a href="#" className="transition-colors hover:text-secondary inline-block hover:translate-x-1 transform duration-200">
                  <span className="text-primary/40 mr-2">&gt;</span>{link}
                </a>
              </p>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
