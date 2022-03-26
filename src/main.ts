import { Application, oakCors } from "./depts.ts";
import { APIRouter } from "./api/mod.ts";

const app = new Application();

app.use(oakCors());

app.use(APIRouter.routes());
app.use(APIRouter.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? "https" : "http";

  console.log(`Listening on: ${protocol}://${hostname ?? "localhost"}:${port}`);
});

app.listen({ port: 8000 });
