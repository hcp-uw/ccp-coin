import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/landing/nav/MobileMenu";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  links: [
    { label: "How it works", href: "#how" },
    { label: "Features", href: "#features" },
  ],
  onSignIn: vi.fn(),
  onSignUp: vi.fn(),
  signInLabel: "Sign in",
  signUpLabel: "Sign up",
};

describe("MobileMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open with all links", () => {
    render(<MobileMenu {...defaultProps} />);
    expect(screen.getByRole("dialog", { name: /mobile navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<MobileMenu {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", async () => {
    render(<MobileMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.keyboard("{Escape}");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onClose when a link is clicked", async () => {
    render(<MobileMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: /how it works/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onClose then onSignIn when Sign In is clicked", async () => {
    render(<MobileMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(defaultProps.onSignIn).toHaveBeenCalled();
  });

  it("calls onClose then onSignUp when Sign Up is clicked", async () => {
    render(<MobileMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(defaultProps.onSignUp).toHaveBeenCalled();
  });

  it("has a close button that calls onClose", async () => {
    render(<MobileMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
