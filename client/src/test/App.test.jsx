import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../App";
import userReducer from "../redux/user/userSlice";

const apiFetchMock = vi.fn();

vi.mock("../utils/api", () => ({
  apiFetch: (...args) => apiFetchMock(...args),
}));

vi.mock("../pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("../pages/SignIn", () => ({
  default: () => <div>Sign In Page</div>,
}));

vi.mock("../pages/SignUp", () => ({
  default: () => <div>Sign Up Page</div>,
}));

vi.mock("../pages/Planner", () => ({
  default: () => <div>Planner Page</div>,
}));

vi.mock("../pages/CreatePlanner", () => ({
  default: () => <div>Create Planner Page</div>,
}));

vi.mock("../pages/UpdatePlanner", () => ({
  default: () => <div>Update Planner Page</div>,
}));

vi.mock("../pages/Profile", () => ({
  default: () => <div>Profile Page</div>,
}));

vi.mock("../pages/CreateMeal", () => ({
  default: () => <div>Create Meal Page</div>,
}));

vi.mock("../pages/Meal", () => ({
  default: () => <div>Meal Page</div>,
}));

vi.mock("../pages/RecipeBook", () => ({
  default: () => <div>Recipe Book Page</div>,
}));

vi.mock("../pages/UpdateMeal", () => ({
  default: () => <div>Update Meal Page</div>,
}));

vi.mock("../components/Search", () => ({
  default: () => <div>Search Page</div>,
}));

const renderApp = (preloadedState) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
  };
};

describe("App auth bootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("waits to render until auth check completes", async () => {
    let resolveFetch;
    apiFetchMock.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    renderApp({
      user: {
        currentUser: { _id: "user-123", username: "tester" },
        error: null,
        loading: false,
      },
    });

    expect(screen.queryByText("Home Page")).not.toBeInTheDocument();

    resolveFetch({
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });

    await screen.findByText("Home Page");
  });

  it("clears stale persisted auth when the session check fails", async () => {
    apiFetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });

    const { store } = renderApp({
      user: {
        currentUser: { _id: "user-123", username: "tester" },
        error: null,
        loading: false,
      },
    });

    await screen.findByText("Home Page");

    await waitFor(() => {
      expect(store.getState().user.currentUser).toBeNull();
    });
  });

  it("rehydrates the full user from a valid session", async () => {
    apiFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          _id: "user-123",
          username: "tester",
          email: "test@example.com",
          avatar: "avatar.png",
        },
      }),
    });

    const { store } = renderApp({
      user: {
        currentUser: null,
        error: null,
        loading: false,
      },
    });

    await screen.findByText("Home Page");

    await waitFor(() => {
      expect(store.getState().user.currentUser).toEqual({
        _id: "user-123",
        username: "tester",
        email: "test@example.com",
        avatar: "avatar.png",
      });
    });
  });
});
