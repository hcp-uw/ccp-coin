import { render, screen, within, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Page from "@/app/page";
import { aiInsights } from "@/content/mockData";

vi.mock("@/components/AudioController", () => ({
  useAudio: () => ({
    playSfx: vi.fn(),
    isMuted: false,
    toggleMute: vi.fn(),
  }),
  AudioToggle: () => <button>Toggle Sound</button>,
}));

describe("DubQuant Arcade Landing Page", () => {
  const setup = () => {
    const user = userEvent.setup();
    render(<Page />);
    return { user };
  };

  describe("Predictions Console", () => {
    it("toggles prediction direction between Up and Down", async () => {
      const { user } = setup();

      // Find the first ticker's toggle group (e.g., AAPL)
      const aaplRow = screen.getByText("AAPL").closest(".relative");
      expect(aaplRow).toBeInTheDocument();

      if (!aaplRow) return;

      const upButton = within(aaplRow).getByRole("button", { name: /up/i });
      const downButton = within(aaplRow).getByRole("button", { name: /dwn/i });

      // Click UP
      await user.click(upButton);
      expect(upButton).toHaveClass("bg-up");
      expect(downButton).not.toHaveClass("bg-down");

      // Click DWN
      await user.click(downButton);
      expect(downButton).toHaveClass("bg-down");
      expect(upButton).not.toHaveClass("bg-up");
    });

    it("displays correct AI insights including confidence scores", async () => {
      const { user } = setup();
      const symbol = "AAPL";
      const insight = aiInsights[symbol];

      // Open AI Panel
      const aiButton = screen.getAllByRole("button", { name: /toggle ai insight/i })[0];
      await user.click(aiButton);

      // Verify Header
      expect(screen.getByText("AI SYSTEM")).toBeInTheDocument();

      // Verify Data Integrity
      expect(screen.getByText(`${insight.confidence}%`)).toBeInTheDocument();

      // Verify Rationale
      expect(screen.getByText(new RegExp(insight.rationale[0], "i"))).toBeInTheDocument();
    });

    it("opens the retro stake dropdown and selects a new value", async () => {
      const { user } = setup();

      // Find the first default stake button
      const stakeButton = screen.getAllByRole("button", { name: /stake:/i })[0];
      expect(stakeButton).toHaveTextContent("50");

      // Open dropdown
      await user.click(stakeButton);

      // Select 100
      const option100 = await screen.findByRole("button", { name: /^100$/ });
      await user.click(option100);

      // Verify the chip updated
      expect(stakeButton).toHaveTextContent("100");
    });
  });

  describe("Retro Modals", () => {
    it("opens LOGIN modal and displays correct form fields", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      const title = await screen.findByText("SIGN IN");
      expect(title).toBeInTheDocument();

      // Verify form elements exist
      expect(screen.getByPlaceholderText(/name@uw\.edu/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("opens JOIN THE ARENA modal from Hero CTA", async () => {
      const { user } = setup();

      // Click the primary CTA
      const heroCta = screen.getByRole("button", { name: /press start/i });
      await user.click(heroCta);

      // New title for Sign Up
      const title = await screen.findByText("NEW CHALLENGER (SIGN UP)");
      expect(title).toBeInTheDocument();

      expect(screen.getByPlaceholderText(/2027/i)).toBeInTheDocument();
    });
  });

  describe("Keyboard Interactions", () => {
    it("closes modal when pressing the ESC key", async () => {
      const { user } = setup();

      // Open a modal
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Verify it's open
      expect(await screen.findByText("SIGN IN")).toBeInTheDocument();

      // Press ESC
      await user.keyboard("{Escape}");

      // Verify it's closed
      await waitFor(() => {
        expect(screen.queryByText("SIGN IN")).not.toBeInTheDocument();
      });
    });

    it("closes AI Popover when pressing the ESC key", async () => {
      const { user } = setup();

      // Open AI Popover
      const aiButton = screen.getAllByRole("button", { name: /toggle ai insight/i })[0];
      await user.click(aiButton);

      expect(screen.getByText("AI SYSTEM")).toBeInTheDocument();

      // Press ESC
      await user.keyboard("{Escape}");

      // Verify it's closed
      await waitFor(() => {
        expect(screen.queryByText("AI SYSTEM")).not.toBeInTheDocument();
      });
    });
  });
});
