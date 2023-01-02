import logger from "../utils/logger";

export default class InternalError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    logger.error(`status : ${status}, message : ${message}`);
  }
}

export class BadRequestError extends InternalError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class UnAuthorizedError extends InternalError {
  constructor(message: string) {
    super(message, 401);
    this.name = "UnAuthorizedError";
  }
}

export class ForbiddenError extends InternalError {
  constructor(message: string) {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class TooManyRequestsError extends InternalError {
  constructor(message: string) {
    super(message, 429);
    this.name = "TooManyRequestsError";
  }
}

export class ServiceUnavailableError extends InternalError {
  constructor(message: string = "Unavailable Service Exception") {
    super(message, 503);
    this.name = "ServiceUnavailableError";
  }
}

export class DBCustomError extends InternalError {
  constructor(message: string) {
    super(message, 505);
    this.name = "DBError";
  }
}
