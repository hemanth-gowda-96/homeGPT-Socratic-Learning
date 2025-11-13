package rest_utils

import (
	"fmt"

	"resty.dev/v3"
)

// This file can contain utility functions for REST API handling
// For example, commmon Get/Post handlers, error handling, etc.

func SendGetRequest() {
	// Placeholder for sending GET requests
}

func SendPostRequest(url string, payload any) error {

	client := resty.New()
	defer client.Close()

	res, err := client.R().
		SetBody(payload). // default request content type is JSON
		Post(url)

	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return err
	}

	responseBody := res.String()

	fmt.Println("Response Body:", responseBody)

	return nil
}
