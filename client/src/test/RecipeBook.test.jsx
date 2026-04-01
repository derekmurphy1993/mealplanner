import { screen } from "@testing-library/react";
import RecipeBook from "../pages/RecipeBook";
import { renderWithProviders } from "./testUtils";

const apiFetchMock = vi.fn();

vi.mock("../components/MealCard", () => ({
  default: ({ meal }) => <div>{meal.name}</div>,
}));

vi.mock("../utils/api", () => ({
  apiFetch: (...args) => apiFetchMock(...args),
}));

describe("RecipeBook smoke test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the empty state when the user has no meals", async () => {
    apiFetchMock.mockResolvedValue({
      json: async () => [],
    });

    renderWithProviders(<RecipeBook />, {
      preloadedState: {
        user: {
          currentUser: { _id: "user-123", username: "tester" },
          error: null,
          loading: false,
        },
      },
    });

    expect(
      await screen.findByText(/No meals found, add some in your recipe book/i)
    ).toBeInTheDocument();
  });

  it("renders fetched meals for the signed-in user", async () => {
    apiFetchMock.mockResolvedValue({
      json: async () => [
        { _id: "meal-1", name: "Turkey Chili" },
        { _id: "meal-2", name: "Protein Oats" },
      ],
    });

    renderWithProviders(<RecipeBook />, {
      preloadedState: {
        user: {
          currentUser: { _id: "user-123", username: "tester" },
          error: null,
          loading: false,
        },
      },
    });

    expect(await screen.findByText("Turkey Chili")).toBeInTheDocument();
    expect(screen.getByText("Protein Oats")).toBeInTheDocument();
  });
});
