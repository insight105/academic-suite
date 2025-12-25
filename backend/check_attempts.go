package main

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
	"log"
	"os"
)

func main() {
	cwd, _ := os.Getwd()
	fmt.Printf("CWD: %s\n", cwd)

	database.Connect()

	batchId := "batch-20251222143943"
	var attempts []models.Attempt
	if err := database.DB.Where("batch_id = ?", batchId).Find(&attempts).Error; err != nil {
		log.Fatalf("Error finding attempts: %v", err)
	}

	fmt.Printf("\n--- Batch Attempts ---\n")
	fmt.Printf("Count: %d\n", len(attempts))
	for _, a := range attempts {
		fmt.Printf("Attempt: %s, Student: %s, Status: %s, Score: %.2f\n", a.ID, a.StudentID, a.Status, a.Score)
	}
}
