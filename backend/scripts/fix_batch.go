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
	cwd, _ := os.Getwd()
	fmt.Printf("CWD: %s\n", cwd)

	database.Connect()

	// 2. Find and Update Batch
	batchId := "batch-20251222143943"
	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", batchId).Error; err != nil {
		log.Fatalf("Error finding batch: %v", err)
	}

	fmt.Printf("Current Duration: %d\n", batch.Duration)

	if batch.Duration == 0 {
		fmt.Println("Updating duration to 11 minutes...")
		batch.Duration = 11
		if err := database.DB.Save(&batch).Error; err != nil {
			log.Fatalf("Failed to update batch: %v", err)
		}
		fmt.Println("Success! Duration updated.")
	} else {
		fmt.Println("Duration is already non-zero. No changes made.")
	}
}
