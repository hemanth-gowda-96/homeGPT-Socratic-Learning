package main

import (
	"homegpt/backend/config"
	"homegpt/backend/routes"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Load configuration from .env file
	_, err := config.LoadConfigFromEnv(".env")
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	app := fiber.New()

	routes.RegisterRoutes(app)

	port := ":" + config.Config.ServerPort
	if config.Config.ServerPort == "" {
		port = ":3000" // default port
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(port))
}
