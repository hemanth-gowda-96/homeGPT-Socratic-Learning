// Export Ollama client and types
export { OllamaClient, ollama } from "./ollama";
export type {
  OllamaConfig,
  OllamaMessage,
  OllamaRequest,
  OllamaResponse,
} from "./ollama";

// Library utilities and helpers can be added here as they grow
export const API_VERSION = "1.0.0";

// Common error classes for the API
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string, field?: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ExternalServiceError extends APIError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 502, "EXTERNAL_SERVICE_ERROR");
    this.name = "ExternalServiceError";
  }
}

// Utility functions
export const handleAPIError = (
  error: unknown
): { error: string; statusCode: number } => {
  if (error instanceof APIError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    statusCode: 500,
  };
};

export const validateRequired = (
  data: Record<string, any>,
  fields: string[]
): void => {
  const missing = fields.filter(
    (field) => !data[field] || data[field].toString().trim() === ""
  );
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(", ")}`);
  }
};
