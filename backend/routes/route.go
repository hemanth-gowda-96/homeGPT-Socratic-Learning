package routes

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	app.Get("/session", func(c *fiber.Ctx) error {
		return c.SendString("Session endpoint")
	})
	app.Get("/question", func(c *fiber.Ctx) error {
		return c.SendString("Question endpoint")
	})
	app.Get("/answer", func(c *fiber.Ctx) error {
		return c.SendString("Answer endpoint")
	})
	// Add more routes as needed
}
