import { Router } from "../depts.ts";
import { db } from "../lib/mod.ts";

import { PRODUCTION } from "../config.ts";

const APIRouter = new Router();

APIRouter.get("/", (ctx) => {
  ctx.response.body = {
    documentation: "https://cohq.vercel.app",
    repository: "https://github.com/cohq/api",
  };
});

APIRouter.get("/stats", async (ctx) => {
  if (PRODUCTION) {
    ctx.response.body = { error: "Not available in production" };
  } else {
    ctx.response.body = await db.allCounts();
  }
});

APIRouter.get("/:id", async (ctx) => {
  const key = decodeURIComponent(ctx.params.id);

  const count = await db.findCount(key);

  if (!count) {
    ctx.response.body = await db.createCount(key);
  } else {
    const { _id, ...data } = await db.updateCount({
      _id: count._id,
      key,
      value: count.value + 1,
    });

    ctx.response.body = data;
  }
});

export { APIRouter };
