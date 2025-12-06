import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, execSync, type ChildProcess } from "node:child_process";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../../../"); // repo root

const PEOPLE_PORT = 3101;
const EVENT_PORT = 3102;

let peopleProc: ChildProcess | null = null;
let eventProc: ChildProcess | null = null;

async function waitForHealthy(url: string, timeoutMs = 20_000) {
  const started = Date.now();
  while (true) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    if (Date.now() - started > timeoutMs) {
      throw new Error(`Timeout waiting for ${url}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

function run(cmd: string) {
  execSync(cmd, { cwd: rootDir, stdio: "inherit" });
}

describe("E2E: create person -> create event -> register -> list", () => {
  beforeAll(async () => {
    run("docker compose up -d");

    run("pnpm --filter people-service db:deploy");
    run("pnpm --filter event-service db:deploy");
    run("pnpm -r build");

    peopleProc = spawn("pnpm", ["--filter", "people-service", "start:test"], {
      cwd: rootDir,
      env: { ...process.env, PORT: String(PEOPLE_PORT) },
      stdio: "inherit",
    });

    eventProc = spawn("pnpm", ["--filter", "event-service", "start:test"], {
      cwd: rootDir,
      env: {
        ...process.env,
        PORT: String(EVENT_PORT),
        PEOPLE_SERVICE_URL: `http://localhost:${PEOPLE_PORT}`,
      },
      stdio: "inherit",
    });

    await waitForHealthy(`http://localhost:${PEOPLE_PORT}/health`, 25_000);
    await waitForHealthy(`http://localhost:${EVENT_PORT}/health`, 25_000);
  }, 30_000);

  afterAll(async () => {
    if (eventProc && !eventProc.killed) eventProc.kill("SIGTERM");
    if (peopleProc && !peopleProc.killed) peopleProc.kill("SIGTERM");
  }, 30_000);

  it("full flow works", async () => {
    const uniq = Date.now();

    const personResp = await fetch(`http://localhost:${PEOPLE_PORT}/people`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: `test${uniq}@example.com`,
        phone: "+380501234567",
      }),
    });
    expect(personResp.ok).toBe(true);
    const person = await personResp.json();

    const eventResp = await fetch(`http://localhost:${EVENT_PORT}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Event",
        startsAt: new Date(Date.now() + 3600_000).toISOString(),
        location: "Kyiv",
      }),
    });
    expect(eventResp.ok).toBe(true);
    const event = await eventResp.json();

    const regResp = await fetch(`http://localhost:${EVENT_PORT}/events/${event.id}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: person.id }),
    });
    expect(regResp.ok).toBe(true);

    const listResp = await fetch(`http://localhost:${EVENT_PORT}/events/${event.id}/registrations`);
    expect(listResp.ok).toBe(true);
    const regs = await listResp.json();

    expect(Array.isArray(regs)).toBe(true);
    expect(regs.length).toBeGreaterThan(0);
  }, 30_000);
});
