import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProfilePage from "@/app/profile/page";

describe("ProfilePage", () => {
  it("renders without errors", () => {
    render(<ProfilePage />);
    expect(screen.getAllByText(/profile/i)).toHaveLength(2);
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