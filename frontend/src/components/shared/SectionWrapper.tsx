import { GoldThread } from "./GoldThread";

type SectionWrapperProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  showGoldThread?: boolean;
};

/**
 * Consistent section wrapper providing standard vertical spacing
 * and an optional gold thread divider above the section.
 */
export function SectionWrapper({
  children,
  id,
  className = "",
  showGoldThread = true,
}: SectionWrapperProps) {
  return (
    <>
      {showGoldThread && <GoldThread />}
      <section id={id} className={`py-20 lg:py-28 ${className}`}>
        {children}
      </section>
    </>
  );
}
