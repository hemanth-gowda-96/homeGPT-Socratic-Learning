package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds application configuration
// Example values:
// LMStudioURL: "http://localhost:1234/v1/chat/completions"
// ModelName: "mistral-7b"
// ServerPort: "8080"
// SessionStoragePath: "./sessions"
type Config struct {
	LMStudioURL        string `json:"lm_studio_url"`
	ModelName          string `json:"model_name"`
	ServerPort         string `json:"server_port"`
	SessionStoragePath string `json:"session_storage_path"`
}

// LoadConfigFromEnv loads config from environment variables and .env file
func LoadConfigFromEnv(envPath string) (*Config, error) {
	_ = godotenv.Load(envPath) // Loads .env file if present
	cfg := &Config{
		LMStudioURL:        os.Getenv("LM_STUDIO_URL"),
		ModelName:          os.Getenv("MODEL_NAME"),
		ServerPort:         os.Getenv("SERVER_PORT"),
		SessionStoragePath: os.Getenv("SESSION_STORAGE_PATH"),
	}
	return cfg, nil
}
