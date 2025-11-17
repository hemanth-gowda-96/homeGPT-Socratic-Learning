import { NextRequest, NextResponse } from "next/server";
import { ollama, handleAPIError, validateRequired } from "../lib";

export async function GET(request: NextRequest) {
  try {
    // Check if Ollama service is healthy
    const isHealthy = await ollama.isHealthy();
    const models = await ollama.listModels();

    return NextResponse.json(
      {
        message: "Generate API endpoint - Ready to generate responses",
        status: isHealthy ? "healthy" : "unavailable",
        availableModels: models,
        config: ollama.getConfig(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/generate GET:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields for Ollama generate API format
    validateRequired(body, ["model", "prompt"]);

    const { model, prompt, stream = false, options } = body;

    // Use Ollama generateDirect method to match the exact API format
    const response = await ollama.generateDirect(
      model,
      prompt,
      stream,
      options
    );

    // Return the response directly from Ollama
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in /api/generate POST:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
