import express from "express";
import { peopleRouter } from "./routes/people";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "people-service" });
  });

  app.use("/people", peopleRouter);

  return app;
}
