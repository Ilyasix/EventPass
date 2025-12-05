import { Router } from "express";
import { prisma } from "../prisma";
import { createPersonSchema, patchPersonSchema } from "../validation/people";

export const peopleRouter = Router();

// POST /people
peopleRouter.post("/", async (req, res) => {
  const parsed = createPersonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const person = await prisma.person.create({ data: parsed.data });
  return res.status(201).json(person);
});

// GET /people/:id
peopleRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) return res.status(404).json({ message: "Person not found" });

  return res.json(person);
});

// PATCH /people/:id
peopleRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;

  const exists = await prisma.person.findUnique({ where: { id } });
  if (!exists) return res.status(404).json({ message: "Person not found" });

  const parsed = patchPersonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const updated = await prisma.person.update({
    where: { id },
    data: parsed.data,
  });

  return res.json(updated);
});
