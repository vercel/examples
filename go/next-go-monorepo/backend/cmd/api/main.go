package main

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	registerRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	_ = router.Run(":" + port)
}

func registerRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":   "backend",
			"framework": "go-gin",
			"message":   "Hello from Go backend service",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	router.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":   "backend",
			"framework": "go-gin",
			"status":    "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	router.GET("/items", func(c *gin.Context) {
		items := []Item{
			{ID: 1, Name: "Sample Item 1", Value: 100},
			{ID: 2, Name: "Sample Item 2", Value: 200},
			{ID: 3, Name: "Sample Item 3", Value: 300},
		}

		c.JSON(http.StatusOK, gin.H{
			"items":     items,
			"total":     len(items),
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	router.GET("/items/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item id"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"item": Item{
				ID:    id,
				Name:  "Sample Item " + strconv.Itoa(id),
				Value: id * 100,
			},
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})
}
