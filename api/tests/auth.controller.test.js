import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/user.model.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compareSync: vi.fn(),
    hashSync: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { signin } from "../controllers/auth.controller.js";

const createResponse = () => {
  const res = {};
  res.cookie = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("auth controller smoke tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("signs in a valid user and returns a cookie", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const res = createResponse();
    const next = vi.fn();

    User.findOne.mockResolvedValue({
      _id: "user-123",
      password: "hashed-password",
      _doc: {
        _id: "user-123",
        email: "test@example.com",
        username: "tester",
        password: "hashed-password",
      },
    });
    bcryptjs.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("signed-token");

    await signin(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcryptjs.compareSync).toHaveBeenCalledWith(
      "password123",
      "hashed-password"
    );
    expect(jwt.sign).toHaveBeenCalledWith({ id: "user-123" }, "test-secret");
    expect(res.cookie).toHaveBeenCalledWith(
      "access_token",
      "signed-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "user-123",
      email: "test@example.com",
      username: "tester",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid credentials", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "bad-password",
      },
    };
    const res = createResponse();
    const next = vi.fn();

    User.findOne.mockResolvedValue({
      _id: "user-123",
      password: "hashed-password",
      _doc: {
        _id: "user-123",
        email: "test@example.com",
        username: "tester",
        password: "hashed-password",
      },
    });
    bcryptjs.compareSync.mockReturnValue(false);

    await signin(req, res, next);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Wrong Credentials",
      })
    );
  });
});
