import { PRODUCTION } from "../config.ts";
import { type Count, type Counts, type IDCount } from "../types.ts";

export class FaunaDBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FaunaDBError";
  }
}

export class DataBase {
  private static _instance: DataBase;

  private constructor(private token: string) {}

  public async findCount(key: string) {
    const query = `
      query($key: String!){
        findCountByKey(key: $key) {
          _id
          key
          value
        }
      }
    `;

    const data = await this.fauna<{ findCountByKey?: Count }>(query, { key });

    return data.findCountByKey;
  }

  public async allCounts() {
    const query = `
      query {
        allCounts {
          data {
            key
            value
          }
        }
      }
    `;

    const { allCounts } = await this.fauna<{ allCounts: { data: Counts } }>(
      query,
    );

    return allCounts.data;
  }

  public async updateCount(count: Count) {
    const query = `
      mutation($_id: ID!, $key: String!, $value: Int!) {
        updateCount(id: $_id, data: { key: $key, value: $value }) {
          key
          value
        }
      }
    `;

    const data = await this.fauna<{ updateCount: Count }>(query, count);

    return data.updateCount;
  }

  public async createCount(key: string) {
    const query = `
      mutation($key: String!) {
        createCount(data: { key: $key,value: 0 }) {
          _id
          key
          value
        }
      }
    `;

    const response = await this.fauna<{ createCount: IDCount }>(query, { key });

    return response.createCount;
  }

  public static async getInstance() {
    if (!DataBase._instance) {
      if (!PRODUCTION) {
        await import("https://deno.land/std@0.218.0/dotenv/load.ts");
      }

      const token = Deno.env.get("FAUNA_TOKEN");

      if (!token) {
        throw new Error("FAUNA_TOKEN is not defined");
      }

      DataBase._instance = new DataBase(token);
    }

    return DataBase._instance;
  }

  private async fauna<T>(
    query: string,
    variables: { [key: string]: unknown } = {},
  ) {
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      throw new FaunaDBError(errors.map((x: Error) => x.message).join("\n"));
    }

    return data as T;
  }
}

export const db = await DataBase.getInstance();
