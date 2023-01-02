import config from "../config";
import mongoose from "mongoose";
import { DBCustomError } from "../errors";

const { HOST, PORT, DATABASE, USER_NAME, PASSWORD } = config.MONGO;
const connectionString = `mongodb://${USER_NAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

let connection: any = null;

export default async () => {
  try {
    await mongoose.connect(connectionString, {});
    connection = await mongoose.createConnection(connectionString).asPromise();
  } catch (err) {
    if (err instanceof Error) {
      throw new DBCustomError(err.message);
    }
  }
};

export { connection };

export const Schema = mongoose.Schema;
export const Types = mongoose.Types;
export const model = mongoose.model;

export const startSession = async () => await mongoose.startSession();

interface Search {
  [property: string]: string | number | boolean | Object | null;
}

interface Order {
  [property: string]: "asc" | "desc";
}

interface Range {
  [property: string]: {
    $gte?: any;
    $lte?: any;
  };
}

interface Where {
  [property: string]: any;
}

export interface SearchOptions {
  offset?: number;
  limit?: number;
  search?: Search;
  order?: Order[] | null;
  range?: Range;
}

export const toSearchOptions = ({
  offset,
  limit,
  search,
  order,
  range,
}: SearchOptions) => {
  return (where?: Where) => {
    const query = Object.assign({}, where);
    const options: { [key: string]: any } = {};
    const sort: { [key: string]: any } = {};

    const toRange: Range = {};

    if (search) {
      for (const [key, value] of Object.entries(search)) {
        if (typeof value === "string" && value.indexOf("%") >= 0) {
          query[key] = { $regex: value.replace(/%/g, ".*") };
        } else {
          query[key] = value;
        }
      }
    }

    if (range) {
      for (const [key, value] of Object.entries(range)) {
        if (value) {
          for (let [nKey, nValue] of Object.entries(value)) {
            if (!toRange[key]) toRange[key] = {};
            if (nKey === "from") {
              toRange[key].$gte = nValue;
            } else if (nKey === "to") {
              toRange[key].$lte = nValue;
            }
          }
        }
      }
    }

    if (offset) options.skip = offset;
    if (limit) options.limit = limit;

    if (order && Array.isArray(order) && order.length > 0) {
      for (const field of order) {
        for (const [key, value] of Object.entries(field)) {
          if (value === "asc") sort[key] = 1;
          else if (value === "desc") sort[key] = -1;
        }
      }
    }

    return {
      meta: {
        offset: offset || 0,
        limit: limit,
        search: search || null,
        order: order || null,
        range: range || null,
      },
      query: Object.assign(query, toRange),
      options,
      sort,
    };
  };
};

export { Search };
