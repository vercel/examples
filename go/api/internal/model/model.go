package model

type DataItem struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

type DataResponse struct {
	Data      []DataItem `json:"data"`
	Total     int        `json:"total"`
	Timestamp string     `json:"timestamp"`
}

type ItemResponse struct {
	Item      DataItem `json:"item"`
	Timestamp string   `json:"timestamp"`
}
