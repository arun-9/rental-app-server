import { beforeAll, describe, expect, it } from "vitest";
import axios from "axios";

beforeAll(() => {
  expect(LOCAL_PORT).toBeDefined();
});

const SERVER_ENDPOINT = `http://localhost:${LOCAL_PORT}`;

const server = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

const newUser = {
  name: "John",
  age: 21,
};

describe("Test Users CRUD Operations", () => {
  let userId: number | undefined;
  it("must insert a new user to the table", async () => {
    const res = await server.post("/users", newUser);

    expect(typeof res.data.id).toBe("number");
    userId = res.data.id;
  });

  it("must return user info", async () => {
    const res = await server.get(`/users/${userId}`);
    expect(res.data.name).toBe(newUser.name);
    expect(res.data.age).toBe(newUser.age);
  });
});
