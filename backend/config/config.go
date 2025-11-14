package config

import (
	"os"

	"github.com/joho/godotenv"
)

// ConfigStruct holds application configuration
// Example values:
// OLLAMA_URL: "http://localhost:11434/api"
// ModelName: "mistral"
// ServerPort: "3000"
// SessionStoragePath: "./sessions"
type ConfigStruct struct {
	OLLAMA_URL         string `json:"ollama_url"`
	ModelName          string `json:"model_name"`
	ServerPort         string `json:"server_port"`
	SessionStoragePath string `json:"session_storage_path"`
}

// Config is the global configuration instance
var Config *ConfigStruct

// LoadConfigFromEnv loads config from environment variables and .env file
func LoadConfigFromEnv(envPath string) (*ConfigStruct, error) {
	_ = godotenv.Load(envPath) // Loads .env file if present
	cfg := &ConfigStruct{
		OLLAMA_URL:         os.Getenv("OLLAMA_URL"),
		ModelName:          os.Getenv("MODEL_NAME"),
		ServerPort:         os.Getenv("SERVER_PORT"),
		SessionStoragePath: os.Getenv("SESSION_STORAGE_PATH"),
	}
	Config = cfg // Set the global instance
	return cfg, nil
}

// example usage:
// cfg, err := LoadConfigFromEnv(".env")
// if err != nil {
//     log.Fatalf("Error loading config: %v", err)
// }
// fmt.Printf("Loaded config: %+v\n", cfg)
