package database

import (
	"academic-suite-backend/models"
	"fmt"
	"log"
	"time"
)

func seedAcademicData() {
	log.Println("Seeding Academic Data for SMP 20 SURABAYA...")

	// 1. Ensure Institution Exists
	institutionID := "inst-smp20"
	var inst models.Institution
	if err := DB.FirstOrCreate(&inst, models.Institution{
		ID:      institutionID,
		Name:    "SMP 20 SURABAYA",
		Type:    "school",
		Address: "Surabaya, Jawa Timur",
	}).Error; err != nil {
		log.Println("Failed to seed institution:", err)
		return
	}

	// 2. Define Subjects Metadata
	// We map code -> Name mapping for creation
	subjectMeta := map[string]string{
		"PAI":  "Pendidikan Agama dan Budi Pekerti",
		"PPKN": "Pendidikan Pancasila",
		"IND":  "Bahasa Indonesia",
		"MAT":  "Matematika",
		"IPA":  "Ilmu Pengetahuan Alam (IPA)",
		"IPS":  "Ilmu Pengetahuan Sosial (IPS)",
		"ING":  "Bahasa Inggris",
		"PJOK": "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
		"TIK":  "Informatika",
		"SENI": "Seni dan Prakarya",
	}

	// 3. Aggregate All Data
	var allQuizzes []SeedQuiz
	allQuizzes = append(allQuizzes, GetSeedDataPart1()...)
	allQuizzes = append(allQuizzes, GetSeedDataPart2()...)
	allQuizzes = append(allQuizzes, GetSeedDataPart3()...)
	allQuizzes = append(allQuizzes, GetSeedDataPart4()...)

	log.Printf("Loaded %d quizzes to seed.", len(allQuizzes))

	// 4. Processing
	for _, qData := range allQuizzes {
		// A. Ensure Subject Exists
		subjectName, ok := subjectMeta[qData.SubjectCode]
		if !ok {
			log.Printf("Unknown subject code: %s", qData.SubjectCode)
			continue // Should not happen if data matches
		}

		subjectID := "subj-" + qData.SubjectCode
		var subject models.Subject
		DB.Where(models.Subject{ID: subjectID}).Attrs(models.Subject{
			Name:          subjectName,
			Code:          qData.SubjectCode,
			Credits:       2,
			TeacherIDs:    `["teacher-1"]`,
			DepartmentID:  "dept-1",
			InstitutionID: institutionID,
		}).FirstOrCreate(&subject)

		// B. Create Quiz
		// Format ID: quiz-[CODE]-G[GRADE]-001 (e.g., quiz-MAT-G7-001)
		// We can stick to one quiz per grade per subject as requested (30 total)
		quizID := fmt.Sprintf("quiz-%s-G%d", qData.SubjectCode, qData.Grade)

		var count int64
		DB.Model(&models.Quiz{}).Where("id = ?", quizID).Count(&count)

		if count == 0 {
			quiz := models.Quiz{
				ID:            quizID,
				SubjectID:     subject.ID,
				Title:         qData.Title,
				Description:   fmt.Sprintf("Latihan Soal %s untuk Kelas %d - Semester Ganjil/Genap", subjectName, qData.Grade),
				ExamType:      models.ExamDaily,
				TotalPoints:   100, // Fixed 100
				PassingScore:  70,
				Status:        "active",
				InstitutionID: institutionID,
				CreatedBy:     "teacher-1",
				CreatedAt:     time.Now(),
				UpdatedAt:     time.Now(),
			}

			if err := DB.Create(&quiz).Error; err != nil {
				log.Printf("Failed to create quiz %s: %v", quiz.Title, err)
				continue
			}

			// C. Create Questions
			// Request: 20 questions per quiz. 5 points each.
			pointsPerQuestion := 5

			for i, qSeed := range qData.Questions {
				// Use 1-indexed for display
				qID := fmt.Sprintf("%s-q%02d", quizID, i+1)
				question := models.Question{
					ID:          qID,
					QuizID:      quizID,
					Type:        models.TypeMCQ, // All MCQ for simplicity
					Text:        qSeed.Text,
					Points:      pointsPerQuestion,
					OrderIndex:  i,
					Explanation: qSeed.Explanation,
				}
				if err := DB.Create(&question).Error; err != nil {
					log.Printf("Failed to create question %s: %v", qID, err)
					continue
				}

				// D. Create Options
				for j, optSeed := range qSeed.Options {
					optID := fmt.Sprintf("%s-opt%d", qID, j+1)
					option := models.QuestionOption{
						ID:         optID,
						QuestionID: qID,
						Text:       optSeed.Text,
						IsCorrect:  optSeed.IsCorrect,
					}
					DB.Create(&option)
				}
			}
			log.Printf("Seeded Quiz: %s (%d questions)", quiz.Title, len(qData.Questions))
		}
	}
	log.Println("Seeding Completed Successfully.")
}
