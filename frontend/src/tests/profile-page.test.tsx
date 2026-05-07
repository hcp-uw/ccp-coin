import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfilePage from "@/app/profile/page";
import { AppShell } from "@/components/landing/nav/AppShell";

vi.mock("@/components/AudioController", () => ({
  useAudio: () => ({
    playSfx: vi.fn(),
    isMuted: false,
    toggleMute: vi.fn(),
  }),
  AudioToggle: () => <button>Toggle Sound</button>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/profile",
  useSearchParams: () => new URLSearchParams(),
}));

function renderProfilePage() {
  return render(
    <AppShell>
      <ProfilePage />
    </AppShell>
  );
}

describe("ProfilePage", () => {
  it("renders without errors", () => {
    renderProfilePage();

    expect(screen.getByRole("navigation", { name: /dashboard navigation/i })).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getAllByText(/account overview/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/balance/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/leaderboard/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/accuracy/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/friends/i).length).toBeGreaterThan(0);
  });

  it("shows security section", () => {
    renderProfilePage();
    expect(screen.getByText(/passwords are never displayed/i)).toBeInTheDocument();
  });

  it("displays user data from mock", () => {
    renderProfilePage();
    expect(screen.getByText(/pilot/i)).toBeInTheDocument();
  });
});
