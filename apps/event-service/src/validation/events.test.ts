import { describe, expect, it } from "vitest";
import { createEventSchema, registerSchema } from "./events";

describe("events validation", () => {
  it("createEventSchema: accepts valid payload", () => {
    const res = createEventSchema.safeParse({
      title: "Demo",
      startsAt: "2025-12-05T10:00:00.000Z",
      location: "Kyiv",
    });
    expect(res.success).toBe(true);
  });

  it("createEventSchema: rejects invalid date", () => {
    const res = createEventSchema.safeParse({
      title: "Demo",
      startsAt: "not-a-date",
      location: "Kyiv",
    });
    expect(res.success).toBe(false);
  });

  it("registerSchema: accepts UUID", () => {
    const res = registerSchema.safeParse({
      personId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(res.success).toBe(true);
  });

  it("registerSchema: rejects not UUID", () => {
    const res = registerSchema.safeParse({ personId: "123" });
    expect(res.success).toBe(false);
  });
});
