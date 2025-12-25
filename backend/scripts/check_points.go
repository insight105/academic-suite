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

	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", batchId).Error; err != nil {
		log.Fatalf("Batch not found: %v", err)
	}

	var quiz models.Quiz
	if err := database.DB.Preload("Questions").First(&quiz, "id = ?", batch.QuizID).Error; err != nil {
		log.Fatalf("Quiz not found: %v", err)
	}

	fmt.Printf("\n--- Quiz: %s ---\n", quiz.Title)
	fmt.Printf("TotalPoints (Metadata): %d\n", quiz.TotalPoints)

	sumPoints := 0
	fmt.Printf("Questions:\n")
	for _, q := range quiz.Questions {
		fmt.Printf("- %s (Type: %s, Points: %d)\n", q.Text, q.Type, q.Points)
		sumPoints += q.Points
	}
	fmt.Printf("Sum of Question Points: %d\n", sumPoints)
}
