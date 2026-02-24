"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { ArcadeButton } from "../../shared/ArcadeButton";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea",
  "input",
  "select",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  onSignIn: () => void;
  onSignUp: () => void;
  signInLabel: string;
  signUpLabel: string;
};

export function MobileMenu({
  isOpen,
  onClose,
  links,
  onSignIn,
  onSignUp,
  signInLabel,
  signUpLabel,
}: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEscapeKey(onClose, isOpen);
  useOutsideClick(panelRef, onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    // Focus the first focusable element inside the panel
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(focusableSelector);
    focusables?.[0]?.focus();

    // Focus trap
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      lastActiveRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-sm md:hidden"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 h-full w-72 border-l border-border bg-obsidian p-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { x: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
          >
            <div className="mb-8 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:text-text"
              >
                <FiX size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-lg text-muted transition hover:text-text"
                >
                  {link.label}
                </a>
              ))}

              <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <ArcadeButton
                variant="success"
                onClick={() => {
                  onClose();
                  onSignIn();
                }}
              >
                {signInLabel}
              </ArcadeButton>
              <ArcadeButton
                variant="warning"
                onClick={() => {
                  onClose();
                  onSignUp();
                }}
              >
                {signUpLabel}
              </ArcadeButton>
            </nav>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
