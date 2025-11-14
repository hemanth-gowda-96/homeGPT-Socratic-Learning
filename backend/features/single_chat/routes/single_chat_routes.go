package single_chat

import (
	"encoding/json"
	"homegpt/backend/config"
	ollama_types "homegpt/backend/plugins/lm_studio/types"
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

	payload := ollama_types.Completions{
		Model:  "mistral",
		Prompt: string(message),
		Stream: false}

	data, err := rest_utils.SendPostRequest(config.Config.OLLAMA_URL+"/generate", payload)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error sending request")
	}

	// convet data to type ollama_types.CompletionsResponse

	var response ollama_types.CompletionsResponse
	err = json.Unmarshal(data, &response)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error parsing response")
	}
	return c.Send([]byte(response.Response))
}

func RegisterSingleChatRoutes(app *fiber.App) {

	app.Get("/single-chat", GetSingleChat)
	app.Post("/single-chat", PostSingleChat)
}
