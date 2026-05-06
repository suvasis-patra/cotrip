class ApiError<T = unknown> extends Error {
  public readonly statusCode: number;
  public readonly success: false;
  public readonly errors: T[];
  public readonly data: null;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: T[] = [],
    stack?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = null;

    // Maintain proper prototype chain (important in TS)
    Object.setPrototypeOf(this, new.target.prototype);

    // Optional custom stack
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
