interface OllamaConfig {
  baseUrl: string;
  model: string;
  timeout?: number;
}

interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export class OllamaClient {
  private config: OllamaConfig;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      baseUrl:
        config.baseUrl ||
        process.env.OLLAMA_BASE_URL ||
        "http://localhost:11434",
      model: config.model || process.env.OLLAMA_MODEL || "llama2",
      timeout: config.timeout || 30000,
    };
  }

  async chat(
    messages: OllamaMessage[],
    options?: OllamaRequest["options"]
  ): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: this.config.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          ...options,
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      );

      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Ollama API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "Request timeout: Ollama server took too long to respond"
          );
        }
        throw new Error(`Ollama request failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred while communicating with Ollama");
    }
  }

  async generate(
    prompt: string,
    options?: OllamaRequest["options"]
  ): Promise<string> {
    const messages: OllamaMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.chat(messages, options);
  }

  async generateDirect(
    model: string,
    prompt: string,
    stream: boolean = false,
    options?: any
  ): Promise<any> {
    try {
      const request = {
        model,
        prompt,
        stream,
        options,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      );

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Ollama API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "Request timeout: Ollama server took too long to respond"
          );
        }
        throw new Error(`Ollama request failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred while communicating with Ollama");
    }
  }

  async ask(question: string, context?: string): Promise<string> {
    const messages: OllamaMessage[] = [];

    if (context) {
      messages.push({
        role: "system",
        content: `Context: ${context}`,
      });
    }

    messages.push({
      role: "user",
      content: question,
    });

    return this.chat(messages);
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error("Error fetching Ollama models:", error);
      return [];
    }
  }

  setModel(model: string): void {
    this.config.model = model;
  }

  getConfig(): OllamaConfig {
    return { ...this.config };
  }
}

// Export a default instance
export const ollama = new OllamaClient();

// Export types for use in other files
export type { OllamaConfig, OllamaMessage, OllamaRequest, OllamaResponse };
