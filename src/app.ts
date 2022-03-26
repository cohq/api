import { oak, oakCors } from "./depts.ts";

import { DataBase } from "./lib/mod.ts";

const app = new oak.Application();
const api = new oak.Router();

const repository = await DataBase.getInstance();

api.get("/api/simple/:id", async (ctx) => {
  const key = decodeURIComponent(ctx.params.id);

  const count = await repository.findCount(key);

  if (!count) {
    ctx.response.body = await repository.createCount(key);
    return;
  }

  console.log(`Updating count for ${key}`);

  const updatedCount = await repository.updateCount({
    _id: count._id,
    key,
    value: count.value + 1,
  });

  ctx.response.body = updatedCount;
});

app.use(oakCors());
app.use(api.routes());
app.use(api.allowedMethods());

export { app };
