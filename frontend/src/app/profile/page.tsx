"use client";

import { MotionConfig } from "framer-motion";

import { ArcadeButton } from "@/components/shared/ArcadeButton";
import { GoldThread } from "@/components/shared/GoldThread";
import { ScrollWithProgress } from "@/components/shared/ScrollWithProgress";
import { MOCK_FRIENDS, MOCK_USER } from "@/content/mockData";

export default function ProfilePage() {
  const maskedPassword = "••••••••••••";
  const friendCount = MOCK_FRIENDS.filter((f) => !f.isCurrentUser).length;

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-obsidian text-text">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Header */}
            <header className="surface-card--profile-blue p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Profile</p>
                  <h1 className="mt-2 font-arcade text-xl text-secondary sm:text-2xl md:text-3xl">
                    {MOCK_USER.username}&apos;s Profile
                  </h1>
                  <p className="mt-2 font-mono text-xs leading-5 text-text/70 sm:text-sm sm:leading-6">
                    Stats, social standing, and security in one place.
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border-[2px] border-primary bg-obsidian font-arcade text-lg text-primary sm:h-16 sm:w-16 sm:text-xl">
                  {MOCK_USER.avatarInitials}
                </div>
              </div>
            </header>

            {/* Stats row */}
            <article className="surface-card--profile-blue p-4 sm:p-6">
              <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Account Overview</p>
              <h2 className="mt-1.5 font-arcade text-base text-xp sm:text-xl">At a glance</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Balance" value={`${MOCK_USER.balance} DC`} accent="text-up" />
                <StatCard label="Leaderboard" value={`#${MOCK_USER.rank}`} accent="text-xp" />
                <StatCard label="Accuracy" value={`${MOCK_USER.accuracy}%`} accent="text-xp" />
                <StatCard label="Friends" value={`${friendCount}`} accent="text-primary" />
              </div>
            </article>

            {/* Main content — single col mobile, two col lg */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">

              {/* Left column */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <article className="surface-card--profile p-4 sm:p-6">
                  <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Identity</p>
                  <h2 className="mt-1.5 font-arcade text-base text-xp sm:text-xl">Account Details</h2>
                  <div className="mt-4 flex flex-col gap-3">
                    <DetailRow label="Email" value="pilot@uw.edu" />
                    <DetailRow label="Username" value={`@${MOCK_USER.username.toLowerCase()}`} />
                    <DetailRow label="Level" value={`Level ${MOCK_USER.level}`} />
                    <DetailRow label="Streak" value={`${MOCK_USER.streak} days`} />
                  </div>
                </article>

                <article className="surface-card--profile-purple p-4 sm:p-6">
                  <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Social Snapshot</p>
                  <h2 className="mt-1.5 font-arcade text-base text-xp sm:text-xl">Friends</h2>
                  <div className="mt-4 h-[240px] border border-border bg-obsidian/80 sm:h-[280px]">
                    <ScrollWithProgress className="h-full px-3 py-3">
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3 pr-1">
                        {MOCK_FRIENDS.filter((f) => !f.isCurrentUser).map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center gap-3 border border-border bg-obsidian p-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-secondary bg-surface font-arcade text-[9px] text-secondary sm:h-10 sm:w-10">
                              {friend.avatarInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-mono text-sm text-text">{friend.username}</p>
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                #{friend.rank} · {friend.accuracy}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollWithProgress>
                  </div>
                </article>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <article className="surface-card--profile-red p-4 sm:p-6">
                  <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Security</p>
                  <h2 className="mt-1.5 font-arcade text-base text-danger sm:text-xl">Password</h2>
                  <p className="mt-2 font-mono text-xs leading-5 text-text/80 sm:text-sm sm:leading-6">
                    Passwords are never displayed. Use account settings to change it.
                  </p>
                  <div className="mt-4 border border-border bg-obsidian px-3 py-2.5 font-mono text-sm text-text sm:px-4 sm:py-3">
                    <span className="text-muted">Password:</span>{" "}
                    {maskedPassword}
                  </div>
                </article>

                <article className="surface-card--profile-blue p-4 sm:p-6">
                  <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-muted">Placement</p>
                  <h2 className="mt-1.5 font-arcade text-base text-xp sm:text-xl">Leaderboard</h2>
                  <div className="mt-4 border border-border bg-obsidian p-4">
                    <p className="font-arcade text-3xl text-primary">#{MOCK_USER.rank}</p>
                    <p className="mt-2 font-mono text-xs text-text/80 sm:text-sm">
                      Ahead of {friendCount} friends.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
        <GoldThread />
      </main>
    </MotionConfig>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="border border-border bg-obsidian p-3 sm:p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`mt-1.5 font-arcade text-base sm:text-lg ${accent}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border bg-obsidian px-3 py-2.5 sm:px-4 sm:py-3">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted sm:text-sm">{label}</span>
      <span className="font-mono text-xs text-text sm:text-sm">{value}</span>
    </div>
  );
}