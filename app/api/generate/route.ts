import { NextRequest, NextResponse } from "next/server";
import { ollama, handleAPIError, validateRequired } from "../lib";

/**
 * @swagger
 * /api/generate:
 *   get:
 *     summary: Check Generate API health
 *     description: Get health status and available models for the generate endpoint
 *     tags: [Generation, Health]
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

/**
 * @swagger
 * /api/generate:
 *   post:
 *     summary: Generate response using Ollama
 *     description: Generate a text response using the specified Ollama model and prompt
 *     tags: [Generation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateRequest'
 *           examples:
 *             basic:
 *               summary: Basic generation request
 *               value:
 *                 model: "mistral"
 *                 prompt: "Why is the sky blue?"
 *                 stream: false
 *             with_options:
 *               summary: Generation with custom options
 *               value:
 *                 model: "llama2"
 *                 prompt: "Explain quantum physics"
 *                 stream: false
 *                 options:
 *                   temperature: 0.7
 *                   max_tokens: 200
 *     responses:
 *       200:
 *         description: Successfully generated response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateResponse'
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
