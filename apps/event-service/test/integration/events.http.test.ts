import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";

describe("event-service integration (http + db)", () => {
  const app = createApp();

  it("POST /events -> 201 and returns created event", async () => {
    const res = await request(app).post("/events").send({
      title: "Integration Event",
      startsAt: "2025-12-05T10:00:00.000Z",
      location: "Kyiv",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Integration Event");
  });
});
