"use client";

import { Navbar } from "@/components/landing/nav/Navbar";
import { useRouter } from "next/navigation";
import { MOCK_USER } from "@/content/mockData";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        variant="dashboard"
        username="ISAIAH"
        stats={{ balance: MOCK_USER.balance, streak: MOCK_USER.streak, rank: MOCK_USER.rank, accuracy: MOCK_USER.accuracy }}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
