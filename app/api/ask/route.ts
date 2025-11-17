import { NextRequest, NextResponse } from "next/server";
import { ollama, handleAPIError, validateRequired } from "../lib";

export async function GET(request: NextRequest) {
  try {
    // Check if Ollama service is healthy
    const isHealthy = await ollama.isHealthy();
    const models = await ollama.listModels();

    return NextResponse.json(
      {
        message: "Ask API endpoint - Ready to answer questions",
        status: isHealthy ? "healthy" : "unavailable",
        availableModels: models,
        config: ollama.getConfig(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/ask GET:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    validateRequired(body, ["question"]);

    const { question, context } = body;

    // Use Ollama to generate response
    const response = await ollama.ask(question, context);

    return NextResponse.json(
      {
        message: response,
        question,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/ask POST:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
