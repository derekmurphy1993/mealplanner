import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import userReducer from "../redux/user/userSlice";

export const renderWithProviders = (
  ui,
  {
    route = "/",
    preloadedState = {
      user: {
        currentUser: null,
        error: null,
        loading: false,
      },
    },
  } = {}
) => {
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
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
};
