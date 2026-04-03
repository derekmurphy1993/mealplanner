import { fireEvent, screen, waitFor } from "@testing-library/react";
import SignIn from "../pages/SignIn";
import { renderWithProviders } from "./testUtils";

const navigateMock = vi.fn();
const apiFetchMock = vi.fn();

vi.mock("../components/OAuth", () => ({
  default: () => <div>OAuth Mock</div>,
}));

vi.mock("../utils/api", () => ({
  apiFetch: (...args) => apiFetchMock(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("SignIn smoke test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials, updates state, and navigates home on success", async () => {
    apiFetchMock.mockResolvedValue({
      json: async () => ({
        _id: "user-123",
        email: "test@example.com",
        username: "tester",
      }),
    });

    const { store } = renderWithProviders(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
    });

    await waitFor(() => {
      expect(store.getState().user.currentUser).toEqual({
        _id: "user-123",
        email: "test@example.com",
        username: "tester",
      });
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows an API error message when sign-in fails", async () => {
    apiFetchMock.mockResolvedValue({
      json: async () => ({
        success: false,
        message: "Wrong Credentials",
      }),
    });

    renderWithProviders(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "bad-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Wrong Credentials")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

});
