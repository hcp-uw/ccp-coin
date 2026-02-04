import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/page";
import { tickers, aiInsights } from "@/content/mockData";

describe("DubQuant landing page", () => {
  const setup = () => {
    const user = userEvent.setup();
    render(<Page />);
    return { user };
  };

  describe("Predictions Console", () => {
    it("toggles prediction direction between Up and Down", async () => {
      const { user } = setup();
      
      // Find the first ticker's toggle group (e.g., AAPL)
      const aaplRow = screen.getByText("AAPL").closest('.relative');
      expect(aaplRow).toBeInTheDocument();
      
      if (!aaplRow) return; // Guard for typescript

      const upButton = within(aaplRow).getByRole("button", { name: /aapl up/i });
      const downButton = within(aaplRow).getByRole("button", { name: /aapl down/i });

      // Check initial state (mock data defaults to "Up" via state init logic if simple, 
      // but component logic initializes `toggles` state)
      expect(upButton).toHaveAttribute("aria-pressed", "true");
      expect(downButton).toHaveAttribute("aria-pressed", "false");

      // Click Down
      await user.click(downButton);
      expect(downButton).toHaveAttribute("aria-pressed", "true");
      expect(upButton).toHaveAttribute("aria-pressed", "false");

      // Click Up again
      await user.click(upButton);
      expect(upButton).toHaveAttribute("aria-pressed", "true");
      expect(downButton).toHaveAttribute("aria-pressed", "false");
    });

    it("displays correct AI insights including confidence scores", async () => {
      const { user } = setup();
      const symbol = "AAPL";
      const insight = aiInsights[symbol];

      // Open AI Panel
      const aiButton = screen.getByRole("button", { name: new RegExp(`open ai insight for ${symbol}`, "i") });
      await user.click(aiButton);

      const panel = await screen.findByTestId("ai-panel");
      
      // Verify Header
      expect(within(panel).getByText(symbol)).toBeInTheDocument();
      expect(within(panel).getByText("AI Insight")).toBeInTheDocument();

      // Verify Data Integrity
      expect(within(panel).getByText(`${insight.confidence}%`)).toBeInTheDocument();
      expect(within(panel).getByText(insight.suggestion)).toBeInTheDocument();
      
      // Verify Rationale
      const rationaleList = within(panel).getByText("Why").nextElementSibling;
      expect(rationaleList).toHaveTextContent(insight.rationale[0]);
    });
  });

  describe("Modals", () => {
    it("opens Sign In modal and displays correct form fields", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /sign in/i }));
      
      const modal = await screen.findByRole("dialog", { name: /sign in to dubquant/i });
      
      // Verify form elements exist
      expect(within(modal).getByLabelText(/uw email/i)).toBeInTheDocument();
      expect(within(modal).getByLabelText(/password/i)).toBeInTheDocument();
      expect(within(modal).getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("opens Sign Up modal from Hero CTA", async () => {
      const { user } = setup();

      // Click the primary "Start learning" CTA in hero
      const heroCta = screen.getByRole("button", { name: /start learning/i });
      await user.click(heroCta);

      const modal = await screen.findByRole("dialog", { name: /sign up for dubquant/i });
      expect(within(modal).getByLabelText(/expected grad year/i)).toBeInTheDocument();
    });

    it("closes modal when clicking the close button", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /sign in/i }));
      const modal = await screen.findByRole("dialog");
      
      const closeButton = within(modal).getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Leaderboard", () => {
    it("renders top students with correct rank styling", () => {
      setup();
      
      const leaderboardSection = screen.getByTestId("leaderboard");
      const topStudent = within(leaderboardSection).getByText("A. Park");
      
      // Verify content is present
      expect(topStudent).toBeInTheDocument();
      
      // Verify ranking logic (visual check via class presence implies logic ran)
      // Rank 1 has specific styling 'bg-gold/10'
      // The text is inside a div, which is inside the row div.
      // The row div has the class 'grid'.
      const row = topStudent.closest('.grid');
      expect(row).toHaveClass("bg-gold/10");
    });
  });
});
