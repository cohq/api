import { app } from "./app.ts";

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? "https" : "http";

  console.log(`Listening on: ${protocol}://${hostname ?? "localhost"}:${port}`);
});

app.listen({ port: 8000 });
