import { Application, Router } from "./depts.ts";

import { createCount, findCount, updateCount } from "./db.ts";

const app = new Application();

const api = new Router();

api.get("/api/simple/:id", async (ctx) => {
  const key = decodeURIComponent(ctx.params.id);

  const count = await findCount(key);

  if (!count) {
    ctx.response.body = await createCount(key);
    return;
  }

  console.log(`Updating count for ${key}`);

  const updatedCount = await updateCount({
    _id: count._id,
    key,
    value: count.value + 1,
  });

  ctx.response.body = updatedCount;
});

app.use(api.routes());
app.use(api.allowedMethods());

export { app };
