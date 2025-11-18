import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { handleAPIError } from "../lib";

/**
 * @swagger
 * /api/generate-audio:
 *   get:
 *     summary: Check Generate Audio API health
 *     description: Get health status for the audio generation endpoint
 *     tags: [Generation, Audio, Health]
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message
 *                 status:
 *                   type: string
 *                   enum: [healthy]
 *                   description: Service health status
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Available features
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        message: "Generate Audio API endpoint - Ready to process audio files",
        status: "healthy",
        features: ["audio_upload", "temp_storage", "file_processing"],
        supportedFormats: ["audio/wav", "audio/mp3", "audio/webm", "audio/ogg"],
        maxFileSize: "10MB",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/generate-audio GET:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

/**
 * @swagger
 * /api/generate-audio:
 *   post:
 *     summary: Generate response from audio input
 *     description: Upload an audio file and store it temporarily for processing
 *     tags: [Generation, Audio]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file to process
 *               model:
 *                 type: string
 *                 description: The AI model to use for processing
 *                 default: "mistral"
 *                 example: "mistral"
 *               options:
 *                 type: object
 *                 description: Additional processing options
 *                 properties:
 *                   temperature:
 *                     type: number
 *                     description: Controls randomness of the output
 *                     minimum: 0
 *                     maximum: 2
 *                     example: 0.7
 *                   transcribe_only:
 *                     type: boolean
 *                     description: Only transcribe audio without generating response
 *                     default: false
 *     responses:
 *       200:
 *         description: Audio file successfully uploaded and stored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 fileId:
 *                   type: string
 *                   description: Unique identifier for the uploaded file
 *                 filePath:
 *                   type: string
 *                   description: Temporary file path
 *                 fileSize:
 *                   type: number
 *                   description: File size in bytes
 *                 mimeType:
 *                   type: string
 *                   description: MIME type of the uploaded file
 *                 uploadedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Upload timestamp
 *                 status:
 *                   type: string
 *                   enum: [stored, processing]
 *                   description: Current processing status
 *       400:
 *         description: Invalid request or unsupported file format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const model = (formData.get("model") as string) || "mistral";
    const optionsStr = formData.get("options") as string;

    let options = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {
        console.warn("Invalid options JSON, using defaults");
      }
    }

    // Validate audio file
    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 413 }
      );
    }

    // Check file type
    const supportedTypes = [
      "audio/wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/webm",
      "audio/ogg",
      "audio/m4a",
    ];

    if (!supportedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Supported formats: " +
            supportedTypes.join(", "),
        },
        { status: 400 }
      );
    }

    // Generate unique file ID and path
    const fileId = randomUUID();
    const fileExtension = audioFile.name.split(".").pop() || "audio";
    const fileName = `${fileId}.${fileExtension}`;
    const tempDir = join(process.cwd(), "temp");
    const filePath = join(tempDir, fileName);

    // Ensure temp directory exists
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Convert file to buffer and save
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Return success response with file information
    const response = {
      message: "Audio file successfully uploaded and stored",
      fileId,
      filePath: `temp/${fileName}`,
      fileName,
      fileSize: audioFile.size,
      mimeType: audioFile.type,
      model,
      options,
      uploadedAt: new Date().toISOString(),
      status: "stored",
      metadata: {
        originalName: audioFile.name,
        duration: null, // Could be calculated later
        transcriptionReady: false,
        processingReady: true,
      },
    };

    console.log(`Audio file uploaded: ${fileName} (${audioFile.size} bytes)`);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in /api/generate-audio POST:", error);
    const { error: errorMessage, statusCode } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
