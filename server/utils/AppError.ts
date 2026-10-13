export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    details?: unknown,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.details = details;

    // Restore prototype chain and maintain clean stack trace
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details?: unknown): AppError {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized', details?: unknown): AppError {
    return new AppError(message, 401, details);
  }

  static forbidden(message = 'Forbidden', details?: unknown): AppError {
    return new AppError(message, 403, details);
  }

  static notFound(message = 'Resource not found', details?: unknown): AppError {
    return new AppError(message, 404, details);
  }

  static conflict(message = 'Conflict', details?: unknown): AppError {
    return new AppError(message, 409, details);
  }

  static unprocessableEntity(
    message = 'Unprocessable Entity',
    details?: unknown
  ): AppError {
    return new AppError(message, 422, details);
  }

  static internal(
    message = 'Internal server error',
    details?: unknown
  ): AppError {
    return new AppError(message, 500, details, false);
  }
}
