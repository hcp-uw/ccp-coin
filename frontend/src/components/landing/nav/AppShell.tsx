"use client";

import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { MOCK_USER } from "@/content/mockData";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Landing page handles its own public navbar
  if (pathname === "/") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-obsidian">
      <Navbar
        variant="dashboard"
        username={MOCK_USER.username}
        stats={{
          balance: MOCK_USER.balance,
          streak: MOCK_USER.streak,
          rank: MOCK_USER.rank,
          accuracy: MOCK_USER.accuracy,
        }}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
