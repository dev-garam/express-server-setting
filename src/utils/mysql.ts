import { each, isArray, isNumber, isString } from "lodash";
import {
  Sequelize,
  Options,
  Op,
  Transaction,
  Model,
  literal,
  BuildOptions,
  DataTypes,
  col,
  fn,
  cast,
  QueryTypes,
} from "sequelize";

import config from "../config";
import { DBCustomError } from "../errors";
import { Search, OptionType, Range as changeRange } from "../types/common";
import logger from "./logger";

const create = (database: string) => {
  const defaultOptions: Options = {
    port: config.MYSQL.PORT,
    username: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
    logging:
      config.LOG_LEVEL === "debug" || config.LOG_LEVEL === "local"
        ? (sql) => logger.info(sql)
        : false,
    pool: {
      max: config.MYSQL.CONNECTION_POOL_MAX,
      min: config.MYSQL.CONNECTION_POOL_MIN,
      acquire: 30000,
      idle: 10000,
    },
  };

  if (isString(database) && database.length > 0) {
    defaultOptions["database"] = database;
  }

  const singleOptions = Object.assign(defaultOptions, {
    host: config.MYSQL.HOST,
  });

  return new Sequelize(singleOptions);
};

let sequelize: Sequelize;

let modelAssociations: Function[] = [];
const modelAssociationHandler = {
  add: (associate: Function) => {
    modelAssociations.push(associate);
  },
  associateModels: () => {
    modelAssociations.forEach((func) => {
      func();
    });
    modelAssociations = [];
  },
};

interface Order {
  [property: string]: "asc" | "desc";
}

interface Where {
  [property: string]: any;
}

interface SearchOptions {
  offset?: number;
  limit?: number;
  search?: Search;
  order?: Order[];
  range?: changeRange;
}

interface deleteOptions extends Where {
  userIdx?: number | string;
  idx: any;
}

interface findReffererOption extends Where {
  userIdx?: number | string;
  requesterIdx: any;
}

interface findOptions extends Where {
  userIdx?: number | string;
  employeeIdx: any;
}

interface deleteScheduleOptions extends Where {
  userIdx?: number | string;
  scheduleIdx: any;
}
interface updateOptions extends Where {
  idx: any;
}

interface Range {
  [property: string]: {
    [Op.gte]?: any;
    [Op.lte]?: any;
  };
}

const arrayToInQuery = (where: any) => {
  each(where, (value, key) => {
    isArray(value) &&
      (where[key] = {
        [Op.in]: value,
      });
  });

  return where;
};

const toSearchOptions = ({ offset, limit, search, order }: SearchOptions) => {
  return (where?: Where) => {
    if (!where) where = {};
    const toLike: Where = {};
    let toOrder: any = [];
    if (search) {
      for (const [key, value] of Object.entries(search)) {
        if (typeof value !== "undefined") {
          if (typeof value === "string" && value.indexOf("%") >= 0) {
            toLike[key] = { [Op.like]: value };
          } else if (isArray(value)) {
            toLike[key] = { [Op.in]: value };
          } else {
            toLike[key] = value;
          }
        }
      }
    }

    if (order) {
      toOrder = order.map((o) => {
        const [[key, value]] = Object.entries(o);
        return [key, value];
      });
    }

    const result: OptionType = {
      where: Object.assign(where, toLike),
      order: toOrder,
    };

    if (isNumber(limit)) result["limit"] = limit;
    if (isNumber(offset)) result["offset"] = offset;

    return result;
  };
};

const toRanges = (range?: changeRange) => {
  const toRange: Range = {};

  if (range) {
    for (const [key, value] of Object.entries(range)) {
      if (value) {
        for (let [nKey, nValue] of Object.entries(value)) {
          if (!toRange[key]) toRange[key] = {};
          if (nKey === "from") {
            toRange[key][Op.gte] = nValue;
          } else if (nKey === "to") {
            toRange[key][Op.lte] = nValue;
          }
        }
      }
    }
  }
  return toRange;
};

export default async () => {
  const database = config.MYSQL.DATABASE;
  try {
    sequelize = create(database);
    await sequelize.authenticate();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === `Unknown database '${database}'`) {
        try {
          sequelize = create(database);
          await sequelize.authenticate();
          await sequelize.query(`CREATE DATABASE ${database};`);
          logger.info(`✅create database ${database} success!`);
        } catch (err) {
          if (err instanceof Error) {
            console.error(err);
            throw new DBCustomError(`❗️Error in Create Database ${database}`);
          }
        }
      } else {
        console.error(err);
        throw new DBCustomError(err.message);
      }
    }
  }
};

export {
  sequelize,
  Op,
  col,
  literal,
  DataTypes,
  modelAssociationHandler,
  toSearchOptions,
  fn,
  cast,
  toRanges,
};

// utill
export { arrayToInQuery };

// type
export {
  SearchOptions,
  BuildOptions,
  deleteOptions,
  updateOptions,
  deleteScheduleOptions,
  findOptions,
  findReffererOption,
  Sequelize,
  Model,
  Transaction,
  QueryTypes,
};
