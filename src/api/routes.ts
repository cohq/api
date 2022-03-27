import { Router } from "../depts.ts";
import { db } from "../lib/mod.ts";

import { PRODUCTION, VERSION } from "../config.ts";

const APIRouter = new Router();

APIRouter.get("/", (ctx) => {
  ctx.response.body = {
    documentation: "https://cohq.vercel.app",
    repository: "https://github.com/cohq/api",
  };
});

APIRouter.get("/stats", async (ctx) => {
  const data = await db.allCounts();

  const totalRequests = data.reduce((acc, curr) => acc + curr.value, 0);

  ctx.response.body = {
    keysCreadted: data.length,
    totalRequests,
    version: VERSION,
    data: PRODUCTION ? undefined : data,
  };
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
