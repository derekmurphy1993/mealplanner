import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MealSearchModal from "../components/MealSearchModal";

describe("MealSearchModal", () => {
  it("shows a loading state instead of an empty state while meals are loading", () => {
    render(
      <MemoryRouter>
        <MealSearchModal
          day="Monday"
          meals={[]}
          loading={true}
          onClose={() => {}}
          onAddMeal={() => {}}
          addingMealId=""
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading meals...")).toBeInTheDocument();
    expect(screen.queryByText("No meals found.")).not.toBeInTheDocument();
  });
});
