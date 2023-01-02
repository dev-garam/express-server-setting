import {Express} from "express"
import config from "../config";
import { success } from "../handlers";
export default (app: Express) => {
  app.get("/", async (req, res) => {
    success(res, {
      env: config.NODE_ENV,
      pid: process.pid,
      uptime: process.uptime(),
    });
  });

  // add domain
}
