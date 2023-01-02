import { isNumber } from "lodash";
import { isEmpty } from "../utils/lodashExtend";

export default (res: any, data?: Object, attributes?: any) => {
  let statusCode = 200;

  if (data === null) {
    data = {};
  }

  if (isEmpty(data) && isNumber(data) && data === 0) {
    statusCode = 202;
  }

  res.status(statusCode);
  res.send({
    status: {
      version: process.env.API_VERSION,
      code: statusCode,
      message: "OK",
    },
    results: data,
    attributes: attributes,
  });
};
