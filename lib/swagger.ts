import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "homeGPT Socratic Learning API",
        version: "1.0.0",
        description:
          "API documentation for homeGPT Socratic Learning platform with Ollama integration",
        contact: {
          name: "API Support",
          email: "support@homegpt.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
        {
          url: "https://your-domain.com",
          description: "Production server",
        },
      ],
      components: {
        schemas: {
          GenerateRequest: {
            type: "object",
            required: ["model", "prompt"],
            properties: {
              model: {
                type: "string",
                description: "The Ollama model to use for generation",
                example: "mistral",
              },
              prompt: {
                type: "string",
                description: "The prompt to generate a response for",
                example: "Why is the sky blue?",
              },
              stream: {
                type: "boolean",
                description: "Whether to stream the response",
                default: false,
              },
              options: {
                type: "object",
                properties: {
                  temperature: {
                    type: "number",
                    description: "Controls randomness of the output",
                    minimum: 0,
                    maximum: 2,
                    example: 0.7,
                  },
                  top_p: {
                    type: "number",
                    description: "Controls diversity of the output",
                    minimum: 0,
                    maximum: 1,
                    example: 0.9,
                  },
                  max_tokens: {
                    type: "integer",
                    description: "Maximum number of tokens to generate",
                    example: 150,
                  },
                },
              },
            },
          },
          GenerateResponse: {
            type: "object",
            properties: {
              model: {
                type: "string",
                description: "The model used for generation",
              },
              created_at: {
                type: "string",
                format: "date-time",
                description: "When the response was created",
              },
              response: {
                type: "string",
                description: "The generated response",
              },
              done: {
                type: "boolean",
                description: "Whether the generation is complete",
              },
              context: {
                type: "array",
                items: {
                  type: "integer",
                },
                description: "Context tokens for conversation continuity",
              },
              total_duration: {
                type: "integer",
                description: "Total duration in nanoseconds",
                nullable: true,
              },
              load_duration: {
                type: "integer",
                description: "Model load duration in nanoseconds",
                nullable: true,
              },
              prompt_eval_count: {
                type: "integer",
                description: "Number of tokens in the prompt",
                nullable: true,
              },
              eval_count: {
                type: "integer",
                description: "Number of tokens in the response",
                nullable: true,
              },
            },
          },
          ChatRequest: {
            type: "object",
            required: ["message"],
            properties: {
              message: {
                type: "string",
                description: "The message to send to the chat",
                example: "Hello, how are you?",
              },
              messages: {
                type: "array",
                description: "Previous conversation messages for context",
                items: {
                  $ref: "#/components/schemas/ChatMessage",
                },
              },
              systemPrompt: {
                type: "string",
                description: "System prompt to guide the conversation",
                example: "You are a helpful assistant focused on education.",
              },
            },
          },
          ChatMessage: {
            type: "object",
            required: ["role", "content"],
            properties: {
              role: {
                type: "string",
                enum: ["system", "user", "assistant"],
                description: "The role of the message sender",
              },
              content: {
                type: "string",
                description: "The content of the message",
              },
            },
          },
          ChatResponse: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The assistant's response",
              },
              userMessage: {
                type: "string",
                description: "The original user message",
              },
              timestamp: {
                type: "string",
                format: "date-time",
                description: "When the response was generated",
              },
              conversationLength: {
                type: "integer",
                description: "Total number of messages in the conversation",
              },
            },
          },
          HealthResponse: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Status message",
              },
              status: {
                type: "string",
                enum: ["healthy", "unavailable"],
                description: "Service health status",
              },
              availableModels: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of available Ollama models",
              },
              config: {
                type: "object",
                description: "Current Ollama configuration",
              },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              error: {
                type: "string",
                description: "Error message",
              },
            },
          },
        },
      },
      tags: [
        {
          name: "Generation",
          description: "Text generation endpoints using Ollama models",
        },
        {
          name: "Chat",
          description: "Conversational chat endpoints",
        },
        {
          name: "Health",
          description: "Health check and status endpoints",
        },
      ],
    },
  });
  return spec;
};
