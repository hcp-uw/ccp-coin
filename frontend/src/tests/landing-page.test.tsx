// src/tests/landing-page.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Page from "@/app/page";

// Mock AudioController to avoid real audio side‑effects
vi.mock("@/components/AudioController", () => ({
    useAudio: () => ({
        playSfx: vi.fn(),
        isMuted: false,
        toggleMute: vi.fn(),
    }),
    AudioToggle: () => <button>Toggle Sound</button>,
}));

// The page uses the useEscapeKey hook internally – no need to mock it for these tests

describe("Landing Page – UI & Interaction Suite", () => {
    const setup = async () => {
        const user = userEvent.setup();
        render(<Page />);
        return { user };
    };

    it("renders core sections (hero, action buttons)", async () => {
        const { user } = await setup();
        // Hero section – check for the primary CTA button text
        expect(screen.getByRole("button", { name: /press start/i })).toBeInTheDocument();
        // Entry points for modals
        expect(screen.getByRole("button", { name: /how to play/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /system faq/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /high scores/i })).toBeInTheDocument();
    });

    it("opens the SIGN IN modal and closes it with ESC", async () => {
        const { user } = await setup();
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        expect(await screen.findByText("SIGN IN")).toBeInTheDocument();
        await user.keyboard("{Escape}");
        await waitFor(() => {
            expect(screen.queryByText("SIGN IN")).not.toBeInTheDocument();
        });
    });

    it("opens the Stake dropdown from the hero CTA and selects a new value", async () => {
        const { user } = await setup();
        // The hero CTA contains the stake chip/button
        const stakeButton = screen.getAllByRole("button", { name: /stake:/i })[0];
        expect(stakeButton).toHaveTextContent(/\d+/);
        await user.click(stakeButton);
        // Choose a different stake value (e.g., 100)
        const option100 = await screen.findByRole("button", { name: /^100$/ });
        await user.click(option100);
        expect(stakeButton).toHaveTextContent("100");
    });
});
