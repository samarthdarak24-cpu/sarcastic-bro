/* ========================================================================
   Custom API Error — Typed HTTP errors with clean stack traces
   ======================================================================== */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: any;

  constructor(statusCode: number, message: string, data?: any, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static badRequest(message = "Bad request", data?: any) {
    return new ApiError(400, message, data);
  }

  static unauthorized(message = "Unauthorized", data?: any) {
    return new ApiError(401, message, data);
  }

  static forbidden(message = "Forbidden", data?: any) {
    return new ApiError(403, message, data);
  }

  static notFound(message = "Resource not found", data?: any) {
    return new ApiError(404, message, data);
  }

  static conflict(message = "Conflict", data?: any) {
    return new ApiError(409, message, data);
  }

  static unprocessable(message = "Unprocessable entity", data?: any) {
    return new ApiError(422, message, data);
  }

  static tooManyRequests(message = "Too many requests", data?: any) {
    return new ApiError(429, message, data);
  }

  static internal(message = "Internal server error", data?: any) {
    return new ApiError(500, message, data, false);
  }

  static badGateway(message = "Bad gateway", data?: any) {
    return new ApiError(502, message, data, false);
  }

  static serviceUnavailable(message = "Service unavailable", data?: any) {
    return new ApiError(503, message, data, false);
  }
}
