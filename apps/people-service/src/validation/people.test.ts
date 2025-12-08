import { describe, expect, it } from "vitest";

import { createPersonSchema, patchPersonSchema } from "./people";

function issueMessages(result: ReturnType<typeof createPersonSchema.safeParse>) {
  if (result.success) return [];
  return result.error.issues.map((i) => i.message);
}

describe("people validation", () => {
  it("create: empty fullName -> has exact message", () => {
    const r = createPersonSchema.safeParse({
      fullName: "",
      email: "a@b.com",
      phone: "+380501234567",
    });
    expect(r.success).toBe(false);
    expect(issueMessages(r)).toContain("fullName is required");
  });

  it("create: invalid email -> has exact message", () => {
    const r = createPersonSchema.safeParse({
      fullName: "John Doe",
      email: "not-an-email",
      phone: "+380501234567",
    });
    expect(r.success).toBe(false);
    expect(issueMessages(r)).toContain("email must be valid");
  });

  it("create: phone must match ^[+0-9]{7,20}$ (no garbage prefix/suffix)", () => {
    const r1 = createPersonSchema.safeParse({
      fullName: "John Doe",
      email: "a@b.com",
      phone: "+380501234567xxx",
    });
    expect(r1.success).toBe(false);
    expect(issueMessages(r1)).toContain("phone must be valid");

    const r2 = createPersonSchema.safeParse({
      fullName: "John Doe",
      email: "a@b.com",
      phone: "xxx+380501234567",
    });
    expect(r2.success).toBe(false);
    expect(issueMessages(r2)).toContain("phone must be valid");
  });

  it("update: must reject empty payload with exact refine message", () => {
    const r = patchPersonSchema.safeParse({});
    expect(r.success).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgs = issueMessages(r as any);
    expect(msgs).toContain("At least one field is required");
  });

  it("update: fullName length 2 should be OK (kills min->max mutant)", () => {
    const r = patchPersonSchema.safeParse({ fullName: "AB" });
    expect(r.success).toBe(true);
  });

  it("update: phone must reject non-digits and wrong charclass mutant", () => {
    const r = patchPersonSchema.safeParse({ phone: "abcdefghi" });
    expect(r.success).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgs = issueMessages(r as any);
    expect(msgs).toContain("phone must be valid");
  });
});
