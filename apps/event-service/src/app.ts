import express from "express";
import { eventsRouter } from "./routes/events";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "event-service" });
  });

  app.use("/events", eventsRouter);

  return app;
}
