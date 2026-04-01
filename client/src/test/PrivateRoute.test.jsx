import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { renderWithProviders } from "./testUtils";

describe("PrivateRoute smoke test", () => {
  it("redirects logged-out users to sign-in", () => {
    renderWithProviders(
      <Routes>
        <Route path="/sign-in" element={<div>Sign In Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/protected" element={<div>Protected Page</div>} />
        </Route>
      </Routes>,
      {
        route: "/protected",
      }
    );

    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Page")).not.toBeInTheDocument();
  });

  it("renders protected content for signed-in users", () => {
    renderWithProviders(
      <Routes>
        <Route path="/sign-in" element={<div>Sign In Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/protected" element={<div>Protected Page</div>} />
        </Route>
      </Routes>,
      {
        route: "/protected",
        preloadedState: {
          user: {
            currentUser: { _id: "user-123", username: "tester" },
            error: null,
            loading: false,
          },
        },
      }
    );

    expect(screen.getByText("Protected Page")).toBeInTheDocument();
    expect(screen.queryByText("Sign In Page")).not.toBeInTheDocument();
  });
});
