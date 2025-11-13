package routes

import (
	singlechat "homegpt/backend/features/single_chat/routes"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {

	singlechat.RegisterSingleChatRoutes(app)
	// Add more routes as needed
}
