import { NextRequest, NextResponse } from "next/server";
import {
  ollama,
  handleAPIError,
  validateRequired,
  type OllamaMessage,
} from "../lib";

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
