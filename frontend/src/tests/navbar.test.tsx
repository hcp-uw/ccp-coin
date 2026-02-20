import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/nav/Navbar";

describe("Navbar", () => {
  const setup = () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn();
    const onSignUp = vi.fn();
    render(<Navbar onSignIn={onSignIn} onSignUp={onSignUp} />);
    return { user, onSignIn, onSignUp };
  };

  it("renders desktop navigation links", () => {
    setup();
    expect(screen.getByRole("link", { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /faq/i })).toBeInTheDocument();
  });

  it("renders hamburger button for mobile", () => {
    setup();
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("calls onSignIn when Sign In button is clicked", async () => {
    const { user, onSignIn } = setup();
    // Desktop sign in buttons (hidden on mobile but present in DOM)
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    await user.click(signInButtons[0]);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("calls onSignUp when Sign Up button is clicked", async () => {
    const { user, onSignUp } = setup();
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    await user.click(signUpButtons[0]);
    expect(onSignUp).toHaveBeenCalledTimes(1);
  });

  it("opens mobile menu when hamburger is clicked", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("dialog", { name: /mobile navigation/i })).toBeInTheDocument();
  });
});
