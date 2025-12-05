import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "people-service" });
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`people-service listening on :${port}`);
});
