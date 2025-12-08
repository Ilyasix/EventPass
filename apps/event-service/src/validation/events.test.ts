import { describe, expect, it } from "vitest";
import { createEventSchema, registerSchema } from "./events";

function issueMessages(result: ReturnType<typeof createEventSchema.safeParse>) {
  if (result.success) return [];
  return result.error.issues.map((i) => i.message);
}

describe("event validation", () => {
  it("create: empty title -> exact message", () => {
    const r = createEventSchema.safeParse({
      title: "",
      startsAt: new Date().toISOString(),
      location: "Kyiv",
    });
    expect(r.success).toBe(false);
    expect(issueMessages(r)).toContain("title is required");
  });

  it("create: empty location -> exact message", () => {
    const r = createEventSchema.safeParse({
      title: "Conf",
      startsAt: new Date().toISOString(),
      location: "",
    });
    expect(r.success).toBe(false);
    expect(issueMessages(r)).toContain("location is required");
  });

  it("create: startsAt must be ISO date string -> exact message", () => {
    const r = createEventSchema.safeParse({
      title: "Conf",
      startsAt: "not-a-date",
      location: "Kyiv",
    });
    expect(r.success).toBe(false);
    expect(issueMessages(r)).toContain("startsAt must be ISO date string");
  });

  it("register: personId must be UUID -> exact message", () => {
    const r = registerSchema.safeParse({ personId: "123" });
    expect(r.success).toBe(false);
    const msgs = r.success ? [] : r.error.issues.map((i) => i.message);
    expect(msgs).toContain("personId must be UUID");
  });
});
