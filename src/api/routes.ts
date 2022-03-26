import { Router } from "../depts.ts";
import { db } from "../lib/mod.ts";

const APIRouter = new Router();

APIRouter.get("/simple/:id", async (ctx) => {
  const key = decodeURIComponent(ctx.params.id);

  const count = await db.findCount(key);

  if (!count) {
    ctx.response.body = await db.createCount(key);
    return;
  }

  const updatedCount = await db.updateCount({
    _id: count._id,
    key,
    value: count.value + 1,
  });

  ctx.response.body = updatedCount;
});

export { APIRouter };