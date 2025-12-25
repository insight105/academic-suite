package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GetAttemptsByBatch godoc
// @Summary      Get Attempts by Batch
// @Tags         attempts
// @Produce      json
// @Param        batchId query string true "Batch ID"
// @Success      200  {array}  models.Attempt
// @Router       /api/attempts [get]
func GetAttempts(c *fiber.Ctx) error {
	batchId := c.Query("batchId")
	studentId := c.Query("studentId")

	db := database.DB.Preload("Answers")

	if batchId != "" {
		db = db.Where("batch_id = ?", batchId)
	}
	if studentId != "" {
		db = db.Where("student_id = ?", studentId)
	}

	var attempts []models.Attempt
	if err := db.Find(&attempts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
	}

	return c.JSON(attempts)
}

// StartAttempt godoc
// @Summary      Start Exam Attempt
// @Description  Start a new attempt or resume existing one.
// @Tags         attempts
// @Accept       json
// @Produce      json
// @Param        req body map[string]string true "Request (batchId, studentId)"
// @Success      200  {object}  models.Attempt
// @Failure      400  {object}  map[string]string
// @Router       /api/attempts/start [post]
func StartAttempt(c *fiber.Ctx) error {
	type StartReq struct {
		BatchID   string `json:"batchId"`
		StudentID string `json:"studentId"`
	}
	var req StartReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// 0. Check for already completed attempts
	var completedAttempt models.Attempt
	if err := database.DB.Where("batch_id = ? AND student_id = ? AND status IN ?",
		req.BatchID, req.StudentID, []models.AttemptStatus{models.AttemptSubmitted, models.AttemptExpired}).First(&completedAttempt).Error; err == nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Anda sudah menyelesaikan ujian ini."})
	}

	// 1. Check existing active attempt
	var existingAttempt models.Attempt
	err := database.DB.Where("batch_id = ? AND student_id = ? AND status NOT IN ?",
		req.BatchID, req.StudentID, []models.AttemptStatus{models.AttemptSubmitted, models.AttemptExpired, models.AttemptResetByAdmin}).First(&existingAttempt).Error

	if err == nil {
		// Attempt exists, return it (Resuming)
		return c.JSON(existingAttempt)
	}

	// 2. Validate Batch
	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", req.BatchID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
	}

	// 3. Check Access Control (AllowedParticipants)
	if batch.AllowedParticipants != "" {
		var allowed []string
		if err := json.Unmarshal([]byte(batch.AllowedParticipants), &allowed); err == nil {
			if len(allowed) > 0 {
				isAllowed := false
				for _, id := range allowed {
					if id == req.StudentID {
						isAllowed = true
						break
					}
				}
				if !isAllowed {
					return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Anda tidak terdaftar dalam kelas ujian ini."})
				}
			}
		}
	}

	// Calculate Initial Remaining Time
	now := time.Now()
	secondsUntilBatchEnd := int(batch.EndTime.Sub(now).Seconds())
	allowedDurationSeconds := batch.Duration * 60

	// Initial remaining time capped by batch end
	initialRemaining := int(math.Max(0, math.Min(float64(allowedDurationSeconds), float64(secondsUntilBatchEnd))))

	// 3. Create New Attempt
	nowPtr := &now
	newAttempt := models.Attempt{
		ID:            fmt.Sprintf("attempt-%d", time.Now().UnixNano()),
		BatchID:       req.BatchID,
		StudentID:     req.StudentID,
		Status:        models.AttemptActive,
		StartedAt:     nowPtr,
		RemainingTime: initialRemaining,
		CreatedAt:     now,
	}

	if err := database.DB.Create(&newAttempt).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not start attempt"})
	}

	// Log Event
	LogEvent(models.EventAttemptStart, req.BatchID, newAttempt.ID, req.StudentID, "Student started exam attempt")

	return c.JSON(newAttempt)
}

// SaveAnswer godoc
// @Summary      Save Answer
// @Tags         attempts
// @Accept       json
// @Produce      json
// @Param        id   path      string         true  "Attempt ID"
// @Param        answer body models.Answer true "Answer Data"
// @Success      200  {object}  models.Attempt
// @Router       /api/attempts/{id}/answers [post]
func SaveAnswer(c *fiber.Ctx) error {
	attemptId := c.Params("id")
	var ans models.Answer
	// Extract currentQuestionIdx if present in body (hacky but quick)
	// Or better, define a request struct that includes Answer fields + CurrentIndex
	type SaveAnswerReq struct {
		models.Answer
		CurrentQuestionIdx int `json:"currentQuestionIdx"`
	}
	var req SaveAnswerReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}
	ans = req.Answer

	// Verify attempt validity
	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}
	if attempt.Status != models.AttemptActive {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Attempt not active"})
	}

	ans.AttemptID = attemptId
	ans.AnsweredAt = time.Now()

	// Upsert Answer
	// GORM Clause OnConflict for Postgres
	// Alternatively manual check
	var existingAns models.Answer
	err := database.DB.Where("attempt_id = ? AND question_id = ?", attemptId, ans.QuestionID).First(&existingAns).Error
	if err == nil {
		// Update
		existingAns.SelectedOptionID = ans.SelectedOptionID
		existingAns.TextAnswer = ans.TextAnswer
		existingAns.AnsweredAt = time.Now()
		database.DB.Save(&existingAns)
	} else {
		// Create
		database.DB.Create(&ans)
	}

	return c.JSON(attempt)
}

// SubmitAttempt godoc
// @Summary      Submit Exam Attempt
// @Tags         attempts
// @Accept       json
// @Produce      json
// @Param        id   path      string         true  "Attempt ID"
// @Param        answers body []models.Answer true "Final Answers"
// @Success      200  {object}  models.Attempt
// @Router       /api/attempts/{id}/submit [post]
func SubmitAttempt(c *fiber.Ctx) error {
	attemptId := c.Params("id")
	var answers []models.Answer
	if err := c.BodyParser(&answers); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	now := time.Now()
	attempt.Status = models.AttemptSubmitted
	attempt.SubmittedAt = &now

	// Calculate Score with Normalization
	var batch models.ExamBatch
	database.DB.First(&batch, "id = ?", attempt.BatchID)
	var quiz models.Quiz
	database.DB.Preload("Questions").Preload("Questions.Options").First(&quiz, "id = ?", batch.QuizID)

	rawScore := 0
	totalPossiblePoints := 0

	// Calculate Total Possible Points first
	for _, q := range quiz.Questions {
		totalPossiblePoints += q.Points
	}

	// Calculate Earned Points
	for _, ans := range answers {
		// Find question
		for _, q := range quiz.Questions {
			if q.ID == ans.QuestionID {
				// Find correct option
				for _, opt := range q.Options {
					if opt.IsCorrect && opt.ID == ans.SelectedOptionID {
						rawScore += q.Points
					}
				}
			}
		}
	}

	// Normalize Score
	// If Quiz.TotalPoints is not set, default to 100 for scaling target
	targetTotal := float64(quiz.TotalPoints)
	if targetTotal == 0 {
		targetTotal = 100.0
	}

	finalScore := 0.0
	if totalPossiblePoints > 0 {
		finalScore = (float64(rawScore) / float64(totalPossiblePoints)) * targetTotal
	} else {
		finalScore = float64(rawScore) // Fallback if no points defined
	}

	attempt.Score = finalScore
	database.DB.Save(&attempt)

	// Save answers bulk? Or rely on individual saves.
	// To match dummyApi logic: attempt.answers = answers.
	// We should ensure these answers are persisted.
	for _, ans := range answers {
		ans.AttemptID = attemptId
		// Save to DB
		var existingAns models.Answer
		if err := database.DB.Where("attempt_id = ? AND question_id = ?", attemptId, ans.QuestionID).First(&existingAns).Error; err == nil {
			existingAns.SelectedOptionID = ans.SelectedOptionID
			database.DB.Save(&existingAns)
		} else {
			database.DB.Create(&ans)
		}
	}

	return c.JSON(attempt)
}

// GetServerTime godoc
// @Summary      Sync Server Time
// @Tags         attempts
// @Produce      json
// @Param        id   path      string  true  "Attempt ID"
// @Success      200  {object}  map[string]interface{}
// @Router       /api/attempts/{id}/time [get]
func GetServerTime(c *fiber.Ctx) error {
	attemptId := c.Params("id")

	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", attempt.BatchID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
	}

	now := time.Now()

	startedAt := attempt.StartedAt
	if startedAt == nil {
		startedAt = &attempt.CreatedAt
	}

	// Time elapsed
	elapsedSeconds := now.Sub(*startedAt).Seconds()

	// Adjust for pauses
	effectiveElapsed := elapsedSeconds - float64(attempt.TotalPausedTime)

	// If currently paused, we don't count time since PausedAt
	if attempt.IsPaused && attempt.PausedAt != nil {
		currentPauseDuration := now.Sub(*attempt.PausedAt).Seconds()
		effectiveElapsed -= currentPauseDuration
	}

	allowedDurationSeconds := float64(batch.Duration * 60)
	secondsUntilBatchEnd := batch.EndTime.Sub(now).Seconds()

	remaining := math.Max(0, allowedDurationSeconds-effectiveElapsed)

	// Cap at batch end
	if remaining > secondsUntilBatchEnd {
		remaining = math.Max(0, secondsUntilBatchEnd)
	}

	return c.JSON(fiber.Map{
		"serverTime":    now,
		"remainingTime": int(remaining),
	})
}

// LogAttemptEvent godoc
// @Summary      Log Security Event (Focus Lost, etc)
// @Tags         attempts
// @Accept       json
// @Produce      json
// @Param        id   path      string true "Attempt ID"
// @Param        req  body      map[string]interface{} true "Event Data (eventType, details)"
// @Success      200  {object}  map[string]string
// @Router       /api/attempts/{id}/log [post]
func LogAttemptEvent(c *fiber.Ctx) error {
	attemptId := c.Params("id")

	type LogReq struct {
		EventType string `json:"eventType"`
		Details   string `json:"details"`
	}
	var req LogReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	// Optional: Check status? Maybe allow logging even if submitted/frozen for forensics
	// But mostly useful for Active exams.

	// Save Log
	LogEvent(models.EventType(req.EventType), attempt.BatchID, attemptId, attempt.StudentID, req.Details)

	// Logic for Auto-Freeze could go here (e.g., if violation count > X)
	// For now, just Log.

	return c.JSON(fiber.Map{"message": "Event logged"})
}

// PauseAttempt godoc
// @Summary      Pause Attempt
// @Tags         attempts
// @Param        id   path      string true "Attempt ID"
// @Success      200  {object}  models.Attempt
// @Router       /api/attempts/{id}/pause [post]
func PauseAttempt(c *fiber.Ctx) error {
	attemptId := c.Params("id")
	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	if attempt.IsPaused {
		return c.JSON(attempt)
	}

	now := time.Now()
	attempt.IsPaused = true
	attempt.PausedAt = &now
	database.DB.Save(&attempt)

	LogEvent("ATTEMPT_PAUSED", attempt.BatchID, attempt.ID, attempt.StudentID, "Teacher paused the attempt")

	return c.JSON(attempt)
}

// ResumeAttempt godoc
// @Summary      Resume Attempt
// @Tags         attempts
// @Param        id   path      string true "Attempt ID"
// @Success      200  {object}  models.Attempt
// @Router       /api/attempts/{id}/resume [post]
func ResumeAttempt(c *fiber.Ctx) error {
	attemptId := c.Params("id")
	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	if !attempt.IsPaused {
		return c.JSON(attempt)
	}

	now := time.Now()
	pausedDuration := 0
	if attempt.PausedAt != nil {
		pausedDuration = int(now.Sub(*attempt.PausedAt).Seconds())
	}

	attempt.IsPaused = false
	attempt.PausedAt = nil
	attempt.TotalPausedTime += pausedDuration
	database.DB.Save(&attempt)

	LogEvent("ATTEMPT_RESUMED", attempt.BatchID, attempt.ID, attempt.StudentID, fmt.Sprintf("Teacher resumed the attempt. Paused for %d seconds", pausedDuration))

	return c.JSON(attempt)
}

// ForceSubmitAttempt godoc
// @Summary      Force Submit Attempt
// @Tags         attempts
// @Param        id   path      string true "Attempt ID"
// @Success      200  {object}  models.Attempt
// @Router       /api/attempts/{id}/force-submit [post]
func ForceSubmitAttempt(c *fiber.Ctx) error {
	// Re-use existing submission logic but trigger by teacher
	// We call SubmitAttempt internally? No, SubmitAttempt expects answers body.
	// Force submit implies taking whatever is in DB.

	attemptId := c.Params("id")
	var attempt models.Attempt
	if err := database.DB.First(&attempt, "id = ?", attemptId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Attempt not found"})
	}

	if attempt.Status == models.AttemptSubmitted || attempt.Status == models.AttemptExpired {
		return c.JSON(attempt)
	}

	now := time.Now()
	attempt.Status = models.AttemptSubmitted
	attempt.SubmittedAt = &now

	// We need to calculate score based on EXISTING answers in DB
	var answers []models.Answer
	database.DB.Where("attempt_id = ?", attemptId).Find(&answers)

	// Copy-paste scoring logic from SubmitAttempt (Refactoring suggested later)
	var batch models.ExamBatch
	database.DB.First(&batch, "id = ?", attempt.BatchID)
	var quiz models.Quiz
	database.DB.Preload("Questions").Preload("Questions.Options").First(&quiz, "id = ?", batch.QuizID)

	rawScore := 0
	totalPossiblePoints := 0
	for _, q := range quiz.Questions {
		totalPossiblePoints += q.Points
	}
	for _, ans := range answers {
		for _, q := range quiz.Questions {
			if q.ID == ans.QuestionID {
				for _, opt := range q.Options {
					if opt.IsCorrect && opt.ID == ans.SelectedOptionID {
						rawScore += q.Points
					}
				}
			}
		}
	}

	targetTotal := float64(quiz.TotalPoints)
	if targetTotal == 0 {
		targetTotal = 100.0
	}
	finalScore := 0.0
	if totalPossiblePoints > 0 {
		finalScore = (float64(rawScore) / float64(totalPossiblePoints)) * targetTotal
	} else {
		finalScore = float64(rawScore)
	}

	attempt.Score = finalScore
	database.DB.Save(&attempt)

	LogEvent("ATTEMPT_FORCE_SUBMITTED", attempt.BatchID, attempt.ID, attempt.StudentID, "Teacher forced submission")

	return c.JSON(attempt)
}

// PingAttempt godoc
// @Summary      Ping Attempt (Heartbeat)
// @Description  Update LastActiveAt timestamp for an attempt
// @Tags         attempts
// @Param        id   path      string true "Attempt ID"
// @Success      200  {object}  map[string]string
// @Router       /api/attempts/{id}/ping [post]
func PingAttempt(c *fiber.Ctx) error {
	attemptId := c.Params("id")

	// Fast update: execute SQL directly to avoid fetch-then-save overhead
	// But GORM 'Model' needs a struct or valid reference.
	// Let's use simple Update logic.
	type PingReq struct {
		CurrentQuestionIdx int `json:"currentQuestionIdx"`
	}
	var req PingReq
	c.BodyParser(&req) // Optional

	now := time.Now()

	// We update LastActiveAt and optionally CurrentQuestionIdx
	updates := map[string]interface{}{}
	updates["last_active_at"] = now

	if req.CurrentQuestionIdx > 0 {
		updates["current_question_idx"] = req.CurrentQuestionIdx
	}

	result := database.DB.Model(&models.Attempt{}).Where("id = ?", attemptId).Updates(updates)

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to ping"})
	}

	return c.JSON(fiber.Map{"status": "ok", "timestamp": now})
}
