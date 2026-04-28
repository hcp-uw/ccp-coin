import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfilePage from "@/app/profile/page";

vi.mock("@/components/AudioController", () => ({
  useAudio: () => ({
    playSfx: vi.fn(),
    isMuted: false,
    toggleMute: vi.fn(),
  }),
  AudioToggle: () => <button>Toggle Sound</button>,
}));

describe("ProfilePage", () => {
  it("renders without errors", () => {
    render(<ProfilePage />);

    expect(screen.getByRole("navigation", { name: /dashboard navigation/i })).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getAllByText(/account overview/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/balance/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/leaderboard position/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/accuracy/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/friends/i).length).toBeGreaterThan(0);
  });

  it("shows security section", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/passwords are never displayed/i)).toBeInTheDocument();
  });

  it("displays user data from mock", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/pilot/i)).toBeInTheDocument();
  });
});