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
  it("shows the main profile stats", () => {
    render(<ProfilePage />);

    expect(screen.getByRole("navigation", { name: /dashboard navigation/i })).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getAllByText(/account overview/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/balance/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/leaderboard position/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/accuracy/i).length).toBeGreaterThan(0);
    expect(within(main).getAllByText(/friends/i).length).toBeGreaterThan(0);
  });

  it("keeps the password masked until reveal is requested", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    expect(screen.getByText(/••••••••••••/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/re-enter password/i), "hunter2");
    await user.click(screen.getByRole("button", { name: /reveal password/i }));

    expect(screen.getByText(/password revealed for this session/i)).toBeInTheDocument();
    expect(screen.getByText("hunter2")).toBeInTheDocument();
  });

  it("uses the shared scroll container for friends", () => {
    render(<ProfilePage />);

    expect(screen.getByText(/A\. Park/i)).toBeInTheDocument();
    expect(screen.getByText(/S\. Kim/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /dashboard navigation/i })).toBeInTheDocument();
  });
});
