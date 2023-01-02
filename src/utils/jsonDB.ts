import { Config, JsonDB } from "node-json-db";

const db = new JsonDB(new Config("database", true, false, "/"));
export default async () => {
  return db
};

const database = {
  write: async () => {},
  getList: async (path: string) => {
    return await db.getData(path);
  },
  get: async () => {},
  delete: async () => {},
};

export {  database };