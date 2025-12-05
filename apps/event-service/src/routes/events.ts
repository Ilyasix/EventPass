import { Router } from "express";
import { prisma } from "../prisma";
import { createEventSchema, registerSchema } from "../validation/events";
import { Prisma } from "../../generated/prisma-client";

export const eventsRouter = Router();

function peopleServiceUrl(): string {
  return process.env.PEOPLE_SERVICE_URL ?? "http://localhost:3001";
}

async function personExists(personId: string): Promise<boolean> {
  const resp = await fetch(`${peopleServiceUrl()}/people/${personId}`);
  return resp.ok;
}

// POST /events
eventsRouter.post("/", async (req, res) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { title, startsAt, location } = parsed.data;

  const event = await prisma.event.create({
    data: { title, startsAt: new Date(startsAt), location },
  });

  return res.status(201).json(event);
});

// POST /events/:id/register
eventsRouter.post("/:id/register", async (req, res) => {
  const { id: eventId } = req.params;

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { personId } = parsed.data;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (!(await personExists(personId))) {
    return res.status(400).json({ message: "personId does not exist" });
  }

  try {
    const reg = await prisma.registration.create({ data: { eventId, personId } });
    return res.status(201).json(reg);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ message: "Already registered" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /events/:id/registrations
eventsRouter.get("/:id/registrations", async (req, res) => {
  const { id: eventId } = req.params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ message: "Event not found" });

  const regs = await prisma.registration.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
  });

  return res.json(regs);
});
