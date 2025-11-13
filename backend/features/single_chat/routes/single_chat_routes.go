package single_chat

import (
	lm_studio_types "homegpt/backend/plugins/lm_studio/types"
	"homegpt/backend/shared/utils/rest_utils"

	"github.com/gofiber/fiber/v2"
)

// GetSingleChat godoc
// @Summary      Get single chat
// @Description  Returns a single chat response
// @Tags         single-chat
// @Accept       json
// @Produce      json
// @Success      200  {string}  string  "ok"
// @Router       /single-chat [get]
func GetSingleChat(c *fiber.Ctx) error {

	return c.SendString("GET single chat endpoint")
}

// PostSingleChat godoc
// @Summary      Post single chat
// @Description  Handles single chat message
// @Tags         single-chat
// @Accept       text/plain
// @Produce      text/plain
// @Param        message  body      string  true  "User message"
// @Success      200      {object}  map[string]string
// @Router       /single-chat [post]
func PostSingleChat(c *fiber.Ctx) error {

	// access the raw body as a string
	message := c.Body()

	payload := lm_studio_types.Completions{
		Model:       "mistral-7b-instruct-v0.3",
		Prompt:      string(message),
		Temperature: 0.9,
		Stream:      false,
		Stop:        []string{"back to you"},
	}
	rest_utils.SendPostRequest("http://localhost:1234/v1/completions", payload)

	return c.SendString("POST single chat endpoint: " + string(message))
}

func RegisterSingleChatRoutes(app *fiber.App) {
	app.Get("/single-chat", GetSingleChat)
	app.Post("/single-chat", PostSingleChat)
}
