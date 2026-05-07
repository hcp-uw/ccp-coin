import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Page from "@/app/page";

vi.mock("@/lib/supabase", () => ({
  supabase: { auth: {} },
}));

vi.mock("@/components/AudioController", () => ({
  useAudio: () => ({
    playSfx: vi.fn(),
    isMuted: false,
    toggleMute: vi.fn(),
  }),
  AudioToggle: () => <button>Toggle Sound</button>,
}));

describe("Forgot Password UI", () => {
  it('opens RECOVER ACCOUNT modal from sign-in', async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("SIGN IN")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /forgot password/i }));
    expect(screen.getByText("RECOVER ACCOUNT")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@uw\.edu/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("back arrow returns to sign-in modal", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await user.click(await screen.findByRole("button", { name: /forgot password/i }));
    expect(screen.getByText("RECOVER ACCOUNT")).toBeInTheDocument();

    await user.click(screen.getByText(/← BACK TO SIGN IN/));
    expect(screen.getByText("SIGN IN")).toBeInTheDocument();
    expect(screen.queryByText("RECOVER ACCOUNT")).not.toBeInTheDocument();
  });

  it("shows email validation error for empty submit", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await user.click(await screen.findByRole("button", { name: /forgot password/i }));
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it("EMAIL input has autofocus in forgot password modal", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await user.click(await screen.findByRole("button", { name: /forgot password/i }));

    const emailInput = screen.getByPlaceholderText(/name@uw\.edu/i);
    expect(emailInput).toHaveFocus();
  });
});
