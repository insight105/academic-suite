package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
)

type AttemptReport struct {
	AttemptID   string  `json:"attemptId"`
	StudentName string  `json:"studentName"`
	StudentID   string  `json:"studentId"`
	Status      string  `json:"status"`
	Score       float64 `json:"score"`
	TotalPoints int     `json:"totalPoints"`
	Percentage  float64 `json:"percentage"`
	Duration    int     `json:"duration"` // seconds
	SubmittedAt *string `json:"submittedAt"`
}

type BatchReportResponse struct {
	BatchID           string          `json:"batchId"`
	BatchType         string          `json:"batchType"`
	QuizTitle         string          `json:"quizTitle"`
	TotalParticipants int             `json:"totalParticipants"`
	SubmittedCount    int             `json:"submittedCount"`
	AverageScore      float64         `json:"averageScore"`
	HighestScore      float64         `json:"highestScore"`
	LowestScore       float64         `json:"lowestScore"`
	Attempts          []AttemptReport `json:"attempts"`
}

// getBatchReportData is a helper to fetch and calculate batch report data
func getBatchReportData(batchId string) (*BatchReportResponse, error) {
	// 1. Get Batch & Quiz
	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", batchId).Error; err != nil {
		return nil, fmt.Errorf("batch not found")
	}

	var quiz models.Quiz
	database.DB.First(&quiz, "id = ?", batch.QuizID)

	// 2. Get Attempts with Student info
	var attempts []models.Attempt
	database.DB.Where("batch_id = ?", batchId).Find(&attempts)

	// Deduplicate Attempts: Keep only the "best" attempt per student
	// Priority: SUBMITTED > ACTIVE > EXPIRED/Others
	// Tie-breaker: Highest Score > Latest CreatedAt
	uniqueAttempts := make(map[string]models.Attempt)

	for _, att := range attempts {
		existing, exists := uniqueAttempts[att.StudentID]
		if !exists {
			uniqueAttempts[att.StudentID] = att
			continue
		}

		// Compare att vs existing
		isBetter := false

		// 1. Status Priority
		if att.Status == models.AttemptSubmitted && existing.Status != models.AttemptSubmitted {
			isBetter = true
		} else if att.Status == models.AttemptSubmitted && existing.Status == models.AttemptSubmitted {
			// Both Submitted: check score
			if att.Score > existing.Score {
				isBetter = true
			} else if att.Score == existing.Score {
				// Same score: check timestamp (newer is better?)
				if att.CreatedAt.After(existing.CreatedAt) {
					isBetter = true
				}
			}
		} else if att.Status == models.AttemptActive && existing.Status != models.AttemptSubmitted && existing.Status != models.AttemptActive {
			isBetter = true
		}

		if isBetter {
			uniqueAttempts[att.StudentID] = att
		}
	}

	// 3. Process Stats
	report := &BatchReportResponse{}
	report.BatchID = batch.ID
	report.BatchType = string(batch.Type)
	report.QuizTitle = quiz.Title
	report.TotalParticipants = len(uniqueAttempts)
	report.Attempts = []AttemptReport{}

	totalScore := 0.0
	highest := 0.0
	lowest := 100000.0 // arbitrary high number
	submittedCount := 0

	if len(uniqueAttempts) == 0 {
		report.LowestScore = 0
		return report, nil
	}

	for _, a := range uniqueAttempts {
		// Get Student Name (Optimize with preload/join later)
		var student models.User
		database.DB.First(&student, "id = ?", a.StudentID)

		// Calculate Duration
		duration := 0
		startedAt := a.CreatedAt
		if a.StartedAt != nil {
			startedAt = *a.StartedAt
		}

		// If submitting, use SubmittedAt. If Active, use Now - Started.
		if a.Status == models.AttemptSubmitted && a.SubmittedAt != nil {
			duration = int(a.SubmittedAt.Sub(startedAt).Seconds())
			submittedCount++
		}

		// Stats
		totalScore += a.Score
		if a.Score > highest {
			highest = a.Score
		}
		if a.Score < lowest {
			lowest = a.Score
		}

		// Format SubmittedAt
		var submittedAtStr *string
		if a.SubmittedAt != nil {
			s := a.SubmittedAt.UTC().Format("2006-01-02T15:04:05Z")
			submittedAtStr = &s
		}

		percentage := 0.0
		if quiz.TotalPoints > 0 {
			percentage = (a.Score / float64(quiz.TotalPoints)) * 100
		}

		report.Attempts = append(report.Attempts, AttemptReport{
			AttemptID:   a.ID,
			StudentName: student.Name,
			StudentID:   a.StudentID,
			Status:      string(a.Status),
			Score:       a.Score,
			TotalPoints: quiz.TotalPoints,
			Percentage:  percentage,
			Duration:    duration,
			SubmittedAt: submittedAtStr,
		})
	}

	report.AverageScore = 0
	if submittedCount > 0 {
		report.AverageScore = totalScore / float64(submittedCount)
	}
	report.HighestScore = highest
	report.LowestScore = lowest
	if lowest == 100000.0 {
		report.LowestScore = 0
	}
	report.SubmittedCount = submittedCount

	return report, nil
}

// GetBatchReport godoc
// @Summary      Get Batch Report
// @Description  Get detailed report for an exam batch
// @Tags         reports
// @Produce      json
// @Param        batchId query string true "Batch ID"
// @Success      200  {object}  BatchReportResponse
// @Router       /api/reports/batch [get]
func GetBatchReport(c *fiber.Ctx) error {
	batchId := c.Query("batchId")
	if batchId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Batch ID is required"})
	}

	report, err := getBatchReportData(batchId)
	if err != nil {
		if err.Error() == "batch not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(report)
}

// ExportBatchReport godoc
// @Summary      Export Batch Report to Excel
// @Description  Download batch report as .xlsx
// @Tags         reports
// @Produce      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// @Param        batchId path string true "Batch ID"
// @Success      200  {file}  file
// @Router       /api/export/batch/{batchId} [get]
func ExportBatchReport(c *fiber.Ctx) error {
	batchId := c.Params("id") // Param must match route definition :id

	report, err := getBatchReportData(batchId)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch data not found"})
	}

	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	// Create Sheet
	sheetName := "Laporan Ujian"
	f.SetSheetName("Sheet1", sheetName)

	// Styles
	styleTitle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 16},
		Alignment: &excelize.Alignment{Horizontal: "center"},
	})
	styleHeader, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"#E0E0E0"}, Pattern: 1},
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
		},
	})
	styleBorder, _ := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
		},
	})

	// Header Info
	f.MergeCell(sheetName, "A1", "F1")
	f.SetCellValue(sheetName, "A1", "LAPORAN HASIL UJIAN")
	f.SetCellStyle(sheetName, "A1", "A1", styleTitle)

	f.SetCellValue(sheetName, "A3", "Judul Ujian")
	f.SetCellValue(sheetName, "B3", report.QuizTitle)

	f.SetCellValue(sheetName, "A4", "Kelas/Batch")
	f.SetCellValue(sheetName, "B4", report.BatchID)

	f.SetCellValue(sheetName, "A5", "Total Peserta")
	f.SetCellValue(sheetName, "B5", report.TotalParticipants)

	// Table Header (Row 7)
	headers := []string{"No", "Nama Peserta", "Status", "Skor", "Durasi (Detik)", "Waktu Submit"}
	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 7)
		f.SetCellValue(sheetName, cell, h)
		f.SetCellStyle(sheetName, cell, cell, styleHeader)
	}

	// Table Data
	row := 8
	for i, att := range report.Attempts {
		f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), att.StudentName)
		f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), att.Status)
		f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), att.Score)
		f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), att.Duration)

		submitTime := "-"
		if att.SubmittedAt != nil {
			submitTime = *att.SubmittedAt
		}
		f.SetCellValue(sheetName, fmt.Sprintf("F%d", row), submitTime)

		// Border for row
		f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row), styleBorder)

		row++
	}

	// Auto fit columns (rough approx)
	f.SetColWidth(sheetName, "B", "B", 30)
	f.SetColWidth(sheetName, "F", "F", 20)

	// Set Response Headers
	c.Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=report-%s.xlsx", batchId))

	if err := f.Write(c.Response().BodyWriter()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate excel"})
	}

	return nil
}
