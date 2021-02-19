export type ErrorHandler = (errorText: string) => void;

const errorHandlers = new Array<ErrorHandler>();

export function registerErrorHandler(errorHandler: ErrorHandler) {
  if (errorHandlers.indexOf(errorHandler) < 0) {
    errorHandlers.push(errorHandler);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function emitError(reason: any, errorText: string) {
  console.error("Error was emitted: " + reason);
  errorHandlers.forEach(errorHandler => errorHandler(errorText));
}
