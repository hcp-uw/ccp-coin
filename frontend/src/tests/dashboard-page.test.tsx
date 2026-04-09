import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import DashboardPage from "@/app/dashboard/page";

function setup() {
  const user = userEvent.setup();
  render(<DashboardPage />);
  return { user };
}

function getTileByIndex(index: number) {
  const moreButtons = screen.getAllByRole("button", { name: /^more$/i });
  const tile = moreButtons[index]?.closest(".p-4");
  expect(tile).toBeInTheDocument();
  return tile as HTMLElement;
}

describe("DashboardPage", () => {
  it("switches mobile sections via bottom nav", async () => {
    const { user } = setup();

    expect(screen.getByText(/daily mission/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /watchlist/i }));
    expect(screen.getAllByText("+ ADD").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /social/i }));
    expect(screen.getAllByRole("tab", { name: /friends/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/head to head/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /picks/i }));
    expect(screen.getByText(/daily mission/i)).toBeInTheDocument();
  });

  it("adds and removes a pick from the slip drawer", async () => {
    const { user } = setup();

    expect(screen.getByText(/your slip.*empty/i)).toBeInTheDocument();

    const aaplTile = getTileByIndex(0);
    await user.click(within(aaplTile).getByRole("button", { name: /^more$/i }));

    expect(screen.getByRole("button", { name: /aapl more 100 dc/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /aapl more 100 dc/i }));
    expect(screen.getByText(/your slip.*empty/i)).toBeInTheDocument();
  });

  it("shows payout when 3 picks are selected", async () => {
    const { user } = setup();

    for (const index of [0, 1, 2]) {
      const tile = getTileByIndex(index);
      await user.click(within(tile).getByRole("button", { name: /^more$/i }));
    }

    expect(screen.getByText(/payout:/i)).toBeInTheDocument();
    expect(screen.getByText(/x\s*→/i)).toBeInTheDocument();
  });

  it("clears all picks from the slip drawer", async () => {
    const { user } = setup();

    for (const index of [0, 1]) {
      const tile = getTileByIndex(index);
      await user.click(within(tile).getByRole("button", { name: /^less$/i }));
    }

    expect(screen.getByRole("button", { name: /aapl less 100 dc/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tsla less 100 dc/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^clear$/i }));
    expect(screen.getByText(/your slip.*empty/i)).toBeInTheDocument();
  });
});
