import { describe, expect, it } from "vitest";
import { createPersonSchema, patchPersonSchema } from "./people";

describe("people validation", () => {
  it("createPersonSchema: accepts valid payload", () => {
    const res = createPersonSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      phone: "+380501234567",
    });
    expect(res.success).toBe(true);
  });

  it("createPersonSchema: rejects empty name", () => {
    const res = createPersonSchema.safeParse({
      fullName: "",
      email: "test@example.com",
      phone: "+380501234567",
    });
    expect(res.success).toBe(false);
  });

  it("createPersonSchema: rejects invalid email", () => {
    const res = createPersonSchema.safeParse({
      fullName: "Test User",
      email: "nope",
      phone: "+380501234567",
    });
    expect(res.success).toBe(false);
  });

  it("createPersonSchema: rejects invalid phone", () => {
    const res = createPersonSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      phone: "abc",
    });
    expect(res.success).toBe(false);
  });

  it("patchPersonSchema: accepts at least one field", () => {
    const res = patchPersonSchema.safeParse({ email: "ok@mail.com" });
    expect(res.success).toBe(true);
  });

  it("patchPersonSchema: rejects empty object", () => {
    const res = patchPersonSchema.safeParse({});
    expect(res.success).toBe(false);
  });

  it("patchPersonSchema: rejects invalid email if provided", () => {
    const res = patchPersonSchema.safeParse({ email: "bad" });
    expect(res.success).toBe(false);
  });
});
