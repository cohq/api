import { Application } from "./depts.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World";
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? "https" : "http";

  console.log(`Listening on: ${protocol}://${hostname ?? "localhost"}:${port}`);
});

app.listen({ port: 8000 });
