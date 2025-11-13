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

func SendPostRequest(url string, payload any) {

	client := resty.New()
	defer client.Close()

	res, err := client.R().
		SetBody(payload). // default request content type is JSON
		Post(url)

	fmt.Println(err, res)

}
