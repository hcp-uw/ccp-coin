"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArcadeButton } from "@/components/shared/ArcadeButton";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { GoldThread } from "@/components/shared/GoldThread";
import { ScrollWithProgress } from "@/components/shared/ScrollWithProgress";
import { Navbar } from "@/components/landing/nav/Navbar";
import { MOCK_FRIENDS, MOCK_USER } from "@/content/mockData";

export default function ProfilePage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [revealMessage, setRevealMessage] = useState("Enter your password to reveal it.");

  const maskedPassword = "••••••••••••";
  const actualPassword = "hunter2";
  const friendCount = MOCK_FRIENDS.length - 1;

  const handleRevealPassword = () => {
    if (passwordCheck.trim()) {
      setShowPassword(true);
      setRevealMessage("Password revealed for this session.");
      return;
    }

    setRevealMessage("Enter your password first.");
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-obsidian text-text">
        <Navbar
          variant="dashboard"
          username={MOCK_USER.username}
          stats={{
            balance: MOCK_USER.balance,
            streak: MOCK_USER.streak,
            rank: MOCK_USER.rank,
            accuracy: MOCK_USER.accuracy,
          }}
          onLogout={() => router.push("/")}
          onProfile={() => router.push("/profile")}
          onHome={() => router.push("/dashboard")}
        />
        <SectionWrapper showGoldThread={false} className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <header className="surface-card--profile-blue p-6 sm:p-8">
              <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                Profile
              </p>
              <div className="mt-4">
                <h1 className="font-arcade text-2xl text-secondary md:text-3xl">
                  {MOCK_USER.username}&apos;s Profile
                </h1>
                <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-text/80">
                  Track your account stats, social standing, and security details in one place.
                </p>
              </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-6">
                <article className="surface-card--profile-blue p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                        Account Overview
                      </p>
                      <h2 className="mt-2 font-arcade text-xl text-xp">At a glance</h2>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center border-[2px] border-primary bg-obsidian font-arcade text-xl text-primary">
                      {MOCK_USER.avatarInitials}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Balance" value={`${MOCK_USER.balance} DC`} accent="text-up" />
                    <StatCard label="Leaderboard" value={`#${MOCK_USER.rank}`} accent="text-xp" />
                    <StatCard label="Accuracy" value={`${MOCK_USER.accuracy}%`} accent="text-xp" />
                    <StatCard label="Friends" value={`${friendCount}`} accent="text-primary" />
                  </div>
                </article>

                <article className="surface-card--profile-purple p-6">
                  <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                    Social Snapshot
                  </p>
                  <h2 className="mt-2 font-arcade text-xl text-xp">Friends</h2>
                  <div className="mt-6 h-[280px] border border-border bg-obsidian/80">
                    <ScrollWithProgress className="h-full px-3 py-3">
                      <div className="grid gap-3 pr-1 sm:grid-cols-2">
                        {MOCK_FRIENDS.filter((friend) => !friend.isCurrentUser).map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center gap-3 border border-border bg-obsidian p-3"
                          >
                            <div className="flex h-10 w-10 items-center justify-center border border-secondary bg-surface font-arcade text-[10px] text-secondary">
                              {friend.avatarInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-mono text-sm text-text">{friend.username}</p>
                              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                                Rank #{friend.rank} • {friend.accuracy}% accuracy
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollWithProgress>
                  </div>
                </article>
              </div>

              <aside className="grid gap-6">
                <article className="surface-card--profile p-6">
                  <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                    Identity
                  </p>
                  <h2 className="mt-2 font-arcade text-xl text-xp">Account Details</h2>
                  <div className="mt-6 grid gap-4 text-sm">
                    <DetailRow label="Email" value="pilot@uw.edu" />
                    <DetailRow label="Username" value={`@${MOCK_USER.username.toLowerCase()}`} />
                    <DetailRow label="Level" value={`Level ${MOCK_USER.level}`} />
                    <DetailRow label="Streak" value={`${MOCK_USER.streak} days`} />
                  </div>
                </article>

                <article className="surface-card--profile-red p-6">
                  <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                    Security
                  </p>
                  <h2 className="mt-2 font-arcade text-xl text-danger">Password</h2>
                  <p className="mt-3 font-mono text-sm leading-6 text-text/80">
                    The password stays masked until you confirm it again.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="border border-border bg-obsidian px-4 py-3 font-mono text-sm text-text">
                      <span className="text-muted">Password:</span> {showPassword ? actualPassword : maskedPassword}
                    </div>
                    <input
                      type="password"
                      value={passwordCheck}
                      onChange={(event) => setPasswordCheck(event.target.value)}
                      placeholder="Re-enter password"
                      className="w-full border border-border bg-obsidian px-4 py-3 font-mono text-sm text-text outline-none placeholder:text-muted"
                    />
                    <div className="flex flex-wrap gap-3">
                      <ArcadeButton variant="danger" onClick={handleRevealPassword}>
                        REVEAL PASSWORD
                      </ArcadeButton>
                      <ArcadeButton
                        variant="neutral"
                        onClick={() => {
                          setShowPassword(false);
                          setPasswordCheck("");
                          setRevealMessage("Enter your password to reveal it.");
                        }}
                      >
                        CLEAR
                      </ArcadeButton>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {revealMessage}
                    </p>
                  </div>
                </article>

                <article className="surface-card--profile-blue p-6">
                  <p className="font-arcade text-[10px] uppercase tracking-[0.24em] text-muted">
                    Placement
                  </p>
                  <h2 className="mt-2 font-arcade text-xl text-xp">Leaderboard Position</h2>
                  <div className="mt-4 border border-border bg-obsidian p-4">
                    <p className="font-arcade text-3xl text-primary">#{MOCK_USER.rank}</p>
                    <p className="mt-2 font-mono text-sm text-text/80">
                      You&apos;re currently ahead of {friendCount - 1} visible friends.
                    </p>
                  </div>
                </article>
              </aside>
            </section>
          </div>
        </SectionWrapper>
        <GoldThread />
      </main>
    </MotionConfig>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="border border-border bg-obsidian p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`mt-2 font-arcade text-lg ${accent}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-obsidian px-4 py-3">
      <span className="font-mono uppercase tracking-[0.14em] text-muted">{label}</span>
      <span className="font-mono text-text">{value}</span>
    </div>
  );
}
