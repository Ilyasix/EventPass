import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";

describe("people-service integration (http + db)", () => {
  const app = createApp();

  it("POST /people -> 201 and returns created person", async () => {
    const res = await request(app)
      .post("/people")
      .send({ fullName: "Int User", email: "int@example.com", phone: "+380501111111" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.fullName).toBe("Int User");
  });

  it("GET /people/:id -> 404 for missing", async () => {
    const res = await request(app).get("/people/550e8400-e29b-41d4-a716-446655440000");
    expect(res.status).toBe(404);
  });
});
