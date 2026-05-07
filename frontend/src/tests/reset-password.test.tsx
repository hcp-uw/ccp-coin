import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect, vi } from "vitest";
import ResetPasswordPage from "@/app/auth/reset-password/page";
import { supabase } from "@/lib/supabase";

let currentSearchParams: URLSearchParams = new URLSearchParams();
let currentHash = "";

const unsubscribe = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      verifyOtp: vi.fn().mockResolvedValue({ data: null, error: { message: "token expired" } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
      updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(),
    back: vi.fn(), forward: vi.fn(), refresh: vi.fn(),
  }),
  usePathname: () => "/auth/reset-password",
  useSearchParams: () => currentSearchParams,
}));

describe("Reset Password Page", () => {
  beforeEach(() => {
    currentSearchParams = new URLSearchParams();
    currentHash = "";
    unsubscribe.mockClear();
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: null,
      error: { message: "token expired" },
    });
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: {},
      error: null,
    });
    Object.defineProperty(window, "location", {
      value: { ...window.location, hash: currentHash },
      writable: true,
    });
  });

  it("shows LINK EXPIRED when no params present", async () => {
    render(<ResetPasswordPage />);
    expect(await screen.findByText("LINK EXPIRED")).toBeInTheDocument();
  });

  it("shows LINK EXPIRED when type is not recovery", async () => {
    currentSearchParams = new URLSearchParams({ token_hash: "abc", type: "signup" });
    render(<ResetPasswordPage />);
    expect(await screen.findByText("LINK EXPIRED")).toBeInTheDocument();
    expect(screen.getByText(/invalid or expired password reset link/i)).toBeInTheDocument();
  });

  it("shows LINK EXPIRED when token_hash missing", async () => {
    currentSearchParams = new URLSearchParams({ type: "recovery" });
    render(<ResetPasswordPage />);
    expect(await screen.findByText("LINK EXPIRED")).toBeInTheDocument();
  });

  it("back to home button exists on error", async () => {
    currentSearchParams = new URLSearchParams({ token_hash: "x", type: "signup" });
    render(<ResetPasswordPage />);
    expect(await screen.findByRole("button", { name: /back to home/i })).toBeInTheDocument();
  });

  it("verifies token_hash recovery links and shows the password form", async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({ data: null, error: null });
    currentSearchParams = new URLSearchParams({ token_hash: "abc", type: "recovery" });

    render(<ResetPasswordPage />);

    expect(await screen.findByText("SET NEW PASSWORD")).toBeInTheDocument();
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "abc",
      type: "recovery",
    });
  });

  it("accepts Supabase hash recovery sessions", async () => {
    Object.defineProperty(window, "location", {
      value: { ...window.location, hash: "#type=recovery&access_token=token" },
      writable: true,
    });
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    render(<ResetPasswordPage />);

    expect(await screen.findByText("SET NEW PASSWORD")).toBeInTheDocument();
  });

  it("updates the user password after a verified recovery link", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({ data: null, error: null });
    currentSearchParams = new URLSearchParams({ token_hash: "abc", type: "recovery" });

    render(<ResetPasswordPage />);

    await user.type(await screen.findByLabelText(/new password/i), "securepass123");
    await user.type(screen.getByLabelText(/confirm password/i), "securepass123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "securepass123",
      });
    });
    expect(await screen.findByText("PASSWORD UPDATED")).toBeInTheDocument();
  });
});
