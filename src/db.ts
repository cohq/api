import type { Count } from "./types.ts";

const PRODUCTION = Deno.env.get("DENO_REGION");

if (!PRODUCTION) {
  await import("https://deno.land/std@0.132.0/dotenv/load.ts");
}

const token = Deno.env.get("FAUNA_TOKEN");

export async function updateCount({ _id, key, value }: Count) {
  const query = `
      mutation($_id: ID!, $key: String!, $value: Int!) {
        updateCount(id: $_id, data: { key: $key, value: $value }) {
          _id
          key
          value
        }
      }
    `;

  const data = await queryFauna<{ updateCount: Count }>(query, {
    _id,
    key,
    value,
  });

  return data.updateCount;
}

export async function findCount(key: string) {
  const query = `
      query($key: String!){
        findCountByKey(key: $key) {
          key
          _id
          value
        }
      }
    `;

  const data = await queryFauna<{ findCountByKey?: Count }>(query, { key });

  return data.findCountByKey;
}

export async function createCount(key: string) {
  const query = `
      mutation($key: String!) {
        createCount(data: { key: $key, value:0 }) {
          _id
          key
          value
        }
      }
    `;

  const data = await queryFauna<{ createCount: Count }>(query, { key });

  return data.createCount;
}

async function queryFauna<T>(
  query: string,
  variables: { [key: string]: unknown }
): Promise<T> {
  const res = await fetch("https://graphql.fauna.com/graphql", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const { data } = await res.json();

  return data as T;
}
