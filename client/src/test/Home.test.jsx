import { screen } from "@testing-library/react";
import Home from "../pages/Home";
import { renderWithProviders } from "./testUtils";

describe("Home smoke test", () => {
  it("renders the key landing page copy and calls to action", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByText(/Your All in One Digital Recipe Book/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create A Meal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up Now/i })
    ).toBeInTheDocument();
  });
});
