type ApiErrorLike = {
  status?: number;
  message?: unknown;
  error?: unknown;
  response?: {
    status?: number;
    data?: {
      message?: unknown;
      error?: unknown;
      data?: {
        message?: unknown;
        error?: unknown;
      };
    };
  };
};

function normalizeErrorValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeErrorValue(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .flatMap((item) => normalizeErrorValue(item))
      .filter(Boolean);
  }

  return [];
}

function getStatus(error: ApiErrorLike): number | undefined {
  return error.status ?? error.response?.status;
}

function getFriendlyStatusMessage(status?: number): string | null {
  switch (status) {
    case 400:
      return "Some product details are invalid. Please review the form and try again.";
    case 401:
      return "Your session expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return "A product with the same details already exists.";
    case 413:
      return "One or more images are too large. Please upload smaller images and try again.";
    case 422:
      return null;
    case 500:
    case 502:
    case 503:
    case 504:
      return "The server could not complete the request. Please try again shortly.";
    default:
      return null;
  }
}

export function extractApiErrorMessages(
  error: unknown,
  fallback = "Something went wrong"
): string[] {
  const err = (error ?? {}) as ApiErrorLike;
  const status = getStatus(err);
  const friendlyStatusMessage = getFriendlyStatusMessage(status);

  const messages = [
    err.response?.data?.error,
    err.response?.data?.message,
    err.response?.data?.data?.error,
    err.response?.data?.data?.message,
    err.error,
    err.message,
  ]
    .flatMap((value) => normalizeErrorValue(value))
    .filter((message) => !/^Request failed with status code \d+$/i.test(message))
    .filter(Boolean);

  if (friendlyStatusMessage && status !== 422) {
    return [friendlyStatusMessage];
  }

  if (messages.length > 0) {
    return [...new Set(messages)];
  }

  return [friendlyStatusMessage ?? fallback];
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  return extractApiErrorMessages(error, fallback)[0];
}
