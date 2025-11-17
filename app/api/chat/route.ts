import { NextRequest, NextResponse } from "next/server";
import {
  ollama,
  handleAPIError,
  validateRequired,
  type OllamaMessage,
} from "../lib";

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Check Chat API health
 *     description: Get health status and available models for the chat endpoint
 *     tags: [Chat, Health]
 *     responses:
 *       200:
 *         description: Health status and available models
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Ollama service is healthy
    const isHealthy = await ollama.isHealthy();
    const models = await ollama.listModels();

    return NextResponse.json(
      {
        message: "Chat API endpoint - Ready for conversation",
        status: isHealthy ? "healthy" : "unavailable",
        availableModels: models,
        config: ollama.getConfig(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/chat GET:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a chat message
 *     description: Send a message to the AI assistant and receive a conversational response with context support
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *           examples:
 *             simple_message:
 *               summary: Simple chat message
 *               value:
 *                 message: "Hello, how are you?"
 *             with_context:
 *               summary: Message with conversation history
 *               value:
 *                 message: "What did I just ask you?"
 *                 messages:
 *                   - role: "user"
 *                     content: "Hello, how are you?"
 *                   - role: "assistant"
 *                     content: "I'm doing well, thank you for asking!"
 *             with_system_prompt:
 *               summary: Message with system prompt
 *               value:
 *                 message: "Explain photosynthesis"
 *                 systemPrompt: "You are a biology teacher. Explain concepts clearly and simply."
 *     responses:
 *       200:
 *         description: Successfully generated chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Invalid request body or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error or Ollama service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    validateRequired(body, ["message"]);

    const { message, messages, systemPrompt } = body;

    // Prepare conversation messages
    let conversationMessages: OllamaMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      conversationMessages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    // Add previous messages if provided (for conversation history)
    if (messages && Array.isArray(messages)) {
      conversationMessages.push(...messages);
    }

    // Add current user message
    conversationMessages.push({
      role: "user",
      content: message,
    });

    // Use Ollama to generate response
    const response = await ollama.chat(conversationMessages);

    return NextResponse.json(
      {
        message: response,
        userMessage: message,
        timestamp: new Date().toISOString(),
        conversationLength: conversationMessages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/chat POST:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
