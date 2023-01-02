import { ErrorRequestHandler } from "express";

const handler: ErrorRequestHandler = async (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode);
  if (err.status == 499) {
    res.json({
      status: {
        version: process.env.API_VERSION,
        code: statusCode,
        subcode: err.subcode,
        message: err.message,
      },
      results: null,
    });
  } else {
    res.json({
      status: {
        version: process.env.API_VERSION,
        code: statusCode,
        message: err.message,
      },
      results: null,
    });
  }
};

export default handler;
