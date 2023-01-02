import express from "express";
import config from "./config";
import { setSchedule } from "./utils/schedule";
import bindDomain from "./domains"
import cors from "cors"
import bodyParser from "body-parser";
import logger, { stream } from "./utils/logger";
import morgan from "morgan";
import helmet from "helmet";
import {
  errHandler,
} from "./handlers";
import swagger from "./swagger";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(config.morganFormat, { stream }));
bindDomain(app);
swagger(app);

app.use(helmet());

app.use(errHandler);

app.listen(config.PORT, async () => {
  logger.info(`server running... PORT : ${config.PORT}`);
  await setSchedule();
}); 