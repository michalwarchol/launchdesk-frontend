interface ApiErrorBody {
  statusCode?: number;
  code?: string;
  message?: string | string[];
}

export class ApiError extends Error {
  readonly status: number;

  readonly code: string;

  readonly messages: string[];

  constructor(status: number, code: string, messages: string[]) {
    super(code);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.messages = messages;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function parseApiError(status: number, body: unknown): ApiError {
  const payload = (body ?? {}) as ApiErrorBody;
  const code = payload.code ?? "httpError";
  const rawMessage = payload.message ?? "Request failed";
  const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage];

  return new ApiError(status, code, messages);
}
