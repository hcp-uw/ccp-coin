"use client";

import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { ArcadeButton } from "@/components/shared/ArcadeButton";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-screen items-center justify-center bg-obsidian px-6">
        <section className="w-full max-w-2xl border-[2px] border-border bg-surface/70 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,240,255,0.18)]">
          <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
            Profile
          </p>
          <h1 className="mt-4 font-arcade text-2xl text-primary md:text-3xl">
            Pilot Profile Coming Soon
          </h1>
          <p className="mt-6 font-mono text-sm leading-6 text-text/80">
            This route is live so the dashboard navigation has a valid destination.
            Profile systems will be filled in during a later frontend pass.
          </p>
          <div className="mt-8 flex justify-center">
            <ArcadeButton
              variant="success"
              onClick={() => router.push("/dashboard")}
            >
              RETURN TO DASHBOARD
            </ArcadeButton>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
