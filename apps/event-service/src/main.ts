import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "event-service" });
});

const port = Number(process.env.PORT ?? 3002);

app.listen(port, () => {
  console.log(`event-service listening on :${port}`);
});
