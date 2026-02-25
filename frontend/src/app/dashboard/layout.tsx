"use client";

import { Navbar } from "@/components/landing/nav/Navbar";
import { useRouter } from "next/navigation";

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
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
