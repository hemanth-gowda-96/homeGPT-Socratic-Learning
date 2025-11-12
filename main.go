package main

import (
	"homegpt/backend/routes"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	routes.RegisterRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
