import "dotenv/config";
import express from "express";
import { eventsRouter } from "./routes/events";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "event-service" });
});

app.use("/events", eventsRouter);

const port = Number(process.env.PORT ?? 3002);
app.listen(port, () => {
  console.log(`event-service listening on :${port}`);
});
