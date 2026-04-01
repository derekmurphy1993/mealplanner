import { screen } from "@testing-library/react";
import Planner from "../pages/Planner";
import { renderWithProviders } from "./testUtils";

const apiFetchMock = vi.fn();

vi.mock("../components/MealSearchModal", () => ({
  default: () => <div>Meal Search Modal</div>,
}));

vi.mock("../utils/api", () => ({
  apiFetch: (...args) => apiFetchMock(...args),
}));

describe("Planner smoke test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state before planner data resolves", () => {
    apiFetchMock.mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders(<Planner />);

    expect(screen.getByText("Loading planners...")).toBeInTheDocument();
  });

  it("shows an error and empty state when planner loading fails", async () => {
    apiFetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "Problem loading planners.",
      }),
    });

    renderWithProviders(<Planner />);

    expect(await screen.findByText("Problem loading planners.")).toBeInTheDocument();
    expect(screen.getByText("No planners found.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Create planner/i })
    ).toBeInTheDocument();
  });
});
