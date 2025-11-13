package single_chat

import (
	"homegpt/backend/shared/utils/rest_utils"

	"github.com/gofiber/fiber/v2"
)

func RegisterSingleChatRoutes(app *fiber.App) {

	app.Get("/single-chat", func(c *fiber.Ctx) error {

		payload := map[string]string{
			"model":  "mistralai/mistral-7b-instruct-v0.3",
			"prompt": "Hello, world!",
		}

		rest_utils.SendPostRequest("http://localhost:1234/v1/completions", payload)

		return c.SendString("GET single chat endpoint")
	})

	app.Post("/single-chat", func(c *fiber.Ctx) error {

		var req struct {
			Message string `json:"message"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
		}
		return c.JSON(fiber.Map{"reply": "You said: " + req.Message})
	})
}
