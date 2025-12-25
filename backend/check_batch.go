package main

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
	"log"
	"os"
)

func main() {
	// 1. Initialize Database
	// Ensure we are in backend dir
	cwd, _ := os.Getwd()
	fmt.Printf("CWD: %s\n", cwd)

	database.Connect()

	// 2. Query Batch
	batchId := "batch-20251222143943"
	var batch models.ExamBatch
	result := database.DB.First(&batch, "id = ?", batchId)

	if result.Error != nil {
		log.Fatalf("Error finding batch: %v", result.Error)
	}

	fmt.Printf("\n--- Batch Details ---\n")
	fmt.Printf("ID: %s\n", batch.ID)
	fmt.Printf("Name: %s\n", batch.Name)
	fmt.Printf("Start Time: %v (UTC: %v)\n", batch.StartTime, batch.StartTime.UTC())
	fmt.Printf("End Time:   %v (UTC: %v)\n", batch.EndTime, batch.EndTime.UTC())
	fmt.Printf("Duration:   %d minutes\n", batch.Duration)
	fmt.Printf("Status:     %s\n", batch.Status)
}
