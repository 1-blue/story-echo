import { toUserFacingMessage } from "./error-messages";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly userMessage: string;

  constructor(status: number, body?: { code?: string; message?: string }) {
    const userMessage = toUserFacingMessage(body, status);
    super(userMessage);
    this.name = "ApiClientError";
    this.status = status;
    this.code = body?.code;
    this.userMessage = userMessage;
  }

  get isNotFound(): boolean {
    return this.status === 404 || this.code === "NOT_FOUND";
  }
}
