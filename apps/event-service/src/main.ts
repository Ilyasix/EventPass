import "dotenv/config";
import { createApp } from "./app";

const app = createApp();

const port = Number(process.env.PORT ?? 3002);
app.listen(port, () => {
  console.log(`event-service listening on :${port}`);
});
