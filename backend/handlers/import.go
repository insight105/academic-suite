package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
	"golang.org/x/crypto/bcrypt"
)

// ImportUsers godoc
// @Summary      Import Users from Excel
// @Description  Import students or teachers from an Excel file (.xlsx)
// @Tags         import
// @Accept       multipart/form-data
// @Produce      json
// @Param        file formData file true "Excel file"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Router       /api/import/users [post]
func ImportUsers(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "File parsing failed"})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Could not open file"})
	}
	defer f.Close()

	excelFile, err := excelize.OpenReader(f)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Excel file"})
	}

	// Assuming first sheet
	rows, err := excelFile.GetRows(excelFile.GetSheetName(0))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not read rows"})
	}

	successCount := 0
	errors := []string{}

	// Skip header row
	for i, row := range rows {
		if i == 0 {
			continue // Skip header
		}
		if len(row) < 3 {
			errors = append(errors, fmt.Sprintf("Row %d: Not enough columns", i+1))
			continue
		}

		// Expected Columns: Name, Email, Password, Role (optional), InstitutionID (optional)
		name := row[0]
		email := row[1]
		password := row[2]

		role := models.RoleStudent // Default
		if len(row) > 3 && row[3] != "" {
			r := models.UserRole(strings.ToLower(row[3]))
			if r == models.RoleTeacher || r == models.RoleAdmin || r == models.RoleStudent {
				role = r
			}
		}

		institutionId := ""
		if len(row) > 4 {
			institutionId = row[4]
		}

		if email == "" || password == "" {
			errors = append(errors, fmt.Sprintf("Row %d: Missing email or password", i+1))
			continue
		}

		// Check if user exists
		var existingUser models.User
		if err := database.DB.Where("email = ?", email).First(&existingUser).Error; err == nil {
			errors = append(errors, fmt.Sprintf("Row %d: Email %s already exists", i+1, email))
			continue
		}

		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		user := models.User{
			ID:            "user-" + uuid.New().String(),
			Email:         email,
			Password:      string(hashedPassword),
			Name:          name,
			Role:          role,
			InstitutionID: institutionId,
			CreatedAt:     time.Now(),
		}

		if err := database.DB.Create(&user).Error; err != nil {
			errors = append(errors, fmt.Sprintf("Row %d: Database error", i+1))
		} else {
			successCount++
		}
	}

	return c.JSON(fiber.Map{
		"message":      fmt.Sprintf("Imported %d users successfully", successCount),
		"errors":       errors,
		"successCount": successCount,
	})
}

// ImportQuestions godoc
// @Summary      Import Questions from Excel
// @Description  Import questions for a specific quiz from an Excel file (.xlsx)
// @Tags         import
// @Accept       multipart/form-data
// @Produce      json
// @Param        quizId path string true "Quiz ID"
// @Param        file formData file true "Excel file"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Router       /api/import/questions/{quizId} [post]
func ImportQuestions(c *fiber.Ctx) error {
	quizId := c.Params("quizId")
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "File parsing failed"})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Could not open file"})
	}
	defer f.Close()

	excelFile, err := excelize.OpenReader(f)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Excel file"})
	}

	rows, err := excelFile.GetRows(excelFile.GetSheetName(0))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not read rows"})
	}

	successCount := 0
	errors := []string{}

	// Skip header
	for i, row := range rows {
		if i == 0 {
			continue
		}
		// Expected: Type (mcq), Text, A, B, C, D, Correct (A/B/C/D or text), Points
		if len(row) < 3 {
			errors = append(errors, fmt.Sprintf("Row %d: Not enough columns", i+1))
			continue
		}

		qType := models.QuestionType(strings.ToLower(row[0]))
		text := row[1]

		// Basic validation
		if text == "" {
			continue
		}

		if qType == "" {
			qType = models.TypeMCQ
		}

		question := models.Question{
			ID:         uuid.New().String(),
			QuizID:     quizId,
			Type:       qType,
			Text:       text,
			OrderIndex: i, // maintain order
		}

		// Options & Correct Answer Handling
		if qType == models.TypeMCQ {
			if len(row) < 7 {
				errors = append(errors, fmt.Sprintf("Row %d: MCQ requires Options A-D and Correct Answer", i+1))
				continue
			}
			optA := row[2]
			optB := row[3]
			optC := row[4]
			optD := row[5]
			correct := strings.ToUpper(strings.TrimSpace(row[6])) // Expecting "A", "B", "C", "D"

			dbOptions := []models.QuestionOption{
				{ID: uuid.New().String(), QuestionID: question.ID, Text: optA, IsCorrect: correct == "A"},
				{ID: uuid.New().String(), QuestionID: question.ID, Text: optB, IsCorrect: correct == "B"},
				{ID: uuid.New().String(), QuestionID: question.ID, Text: optC, IsCorrect: correct == "C"},
				{ID: uuid.New().String(), QuestionID: question.ID, Text: optD, IsCorrect: correct == "D"},
			}
			question.Options = dbOptions
		} else {
			// Other types, correct answer is just the text in col 6 (index 6, but might be different pos if not MCQ)
			// For simplicity let's assume same column index for "Correct Answer" even if options are empty
			// But usually templates differ. Let's rely on standard template:
			// Type | Text | OptA | OptB | OptC | OptD | Correct | Points
			if len(row) > 6 {
				question.CorrectAnswer = row[6]
			}
		}

		// Points
		if len(row) > 7 {
			fmt.Sscanf(row[7], "%d", &question.Points)
		}
		if question.Points == 0 {
			question.Points = 1 // Default
		}

		if err := database.DB.Create(&question).Error; err != nil {
			errors = append(errors, fmt.Sprintf("Row %d: DB Error", i+1))
		} else {
			successCount++
		}
	}

	return c.JSON(fiber.Map{
		"message":      fmt.Sprintf("Imported %d questions successfully", successCount),
		"errors":       errors,
		"successCount": successCount,
	})
}
