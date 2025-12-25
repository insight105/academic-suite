package main

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"encoding/json"
	"flag"
	"fmt"
	"log"
)

func main() {
	batchID := flag.String("batch", "", "Batch ID to update")
	count := flag.Int("count", 100, "Number of dummy students to add")
	flag.Parse()

	if *batchID == "" {
		log.Fatal("Please provide a batch ID using -batch flag")
	}

	// Connect to DB
	database.Connect()

	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", *batchID).Error; err != nil {
		log.Fatalf("Batch not found: %v", err)
	}

	log.Printf("Found Batch: %s (Current Participants: %d bytes)", batch.Name, len(batch.AllowedParticipants))

	// Get existing participants
	var participants []string
	if batch.AllowedParticipants != "" {
		json.Unmarshal([]byte(batch.AllowedParticipants), &participants)
	}

	// Add dummy students
	existingSet := make(map[string]bool)
	for _, p := range participants {
		existingSet[p] = true
	}

	addedCount := 0
	for i := 1; i <= *count; i++ {
		dummyID := fmt.Sprintf("student-dummy-%d", i)
		if !existingSet[dummyID] {
			participants = append(participants, dummyID)
			existingSet[dummyID] = true
			addedCount++
		}
	}

	// Save back
	newData, _ := json.Marshal(participants)
	batch.AllowedParticipants = string(newData)

	if err := database.DB.Save(&batch).Error; err != nil {
		log.Fatalf("Failed to update batch: %v", err)
	}

	log.Printf("Successfully added %d dummy students. Total participants: %d", addedCount, len(participants))
}
