import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/page";

describe("DubQuant landing page", () => {
  it("opens, switches, and closes the AI Insight panel", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const aaplButton = screen.getByRole("button", { name: /open ai insight for aapl/i });
    await user.click(aaplButton);

    let panel = screen.getByTestId("ai-panel");
    expect(within(panel).getByText("AAPL")).toBeInTheDocument();

    const tslaButton = screen.getByRole("button", { name: /open ai insight for tsla/i });
    await user.click(tslaButton);

    panel = screen.getByTestId("ai-panel");
    expect(within(panel).getByText("TSLA")).toBeInTheDocument();

    const closeButton = within(panel).getByRole("button", { name: /close ai insight/i });
    await user.click(closeButton);
    expect(screen.queryByTestId("ai-panel")).not.toBeInTheDocument();
  });

  it("opens and closes the sign in modal with Escape", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("dialog", { name: /sign in to dubquant/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /sign in to dubquant/i })).not.toBeInTheDocument();
  });

  it("renders leaderboard rows from mocked data", () => {
    render(<Page />);
    expect(screen.getByText("T. Nguyen")).toBeInTheDocument();
    expect(screen.getByText("S. Kim")).toBeInTheDocument();
  });
});
