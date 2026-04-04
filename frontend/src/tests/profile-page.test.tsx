import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ProfilePage from "@/app/profile/page";

describe("ProfilePage", () => {
  it("shows the main profile stats", () => {
    render(<ProfilePage />);

    expect(screen.getByRole("navigation", { name: /dashboard navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/account overview/i)).toBeInTheDocument();
    expect(screen.getByText(/balance/i)).toBeInTheDocument();
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
    expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/friends/i)).toBeInTheDocument();
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
