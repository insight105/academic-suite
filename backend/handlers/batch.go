package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GetBatches godoc
// @Summary      Get All Exam Batches
// @Description  Retrieve a list of all exam batches
// @Tags         batches
// @Produce      json
// @Success      200  {array}  models.ExamBatch
// @Router       /api/batches [get]
// BatchResponse with proper JSON types
type BatchResponse struct {
	models.ExamBatch
	AllowedParticipants []string `json:"allowedParticipants"`
	Waitlist            []string `json:"waitlist"`
}

func toBatchResponse(b models.ExamBatch) BatchResponse {
	var participants []string
	if b.AllowedParticipants != "" {
		_ = json.Unmarshal([]byte(b.AllowedParticipants), &participants)
	}
	if participants == nil {
		participants = []string{}
	}

	var waitlist []string
	if b.Waitlist != "" {
		_ = json.Unmarshal([]byte(b.Waitlist), &waitlist)
	}
	if waitlist == nil {
		waitlist = []string{}
	}

	// Prevent shadowing/recursion issues by manually copying or embedding
	// But embedding overrides fields.
	// To avoid "AllowedParticipants" duplicate in JSON (one from embedded, one specific),
	// we should use a struct that *doesn't* embed the raw string fields if we want control,
	// OR use the `json:"-"` on the model if possible (but model is used elsewhere).
	// Easier Strategy: Create a response struct that maps fields manually or use map[string]interface{}.
	// Robust Strategy: Copy meaningful fields.

	return BatchResponse{
		ExamBatch:           b,
		AllowedParticipants: participants,
		Waitlist:            waitlist,
	}
}

// But wait, embedding `models.ExamBatch` will still export `AllowedParticipants` string field unless we hide it.
// The frontend will receive BOTH `allowedParticipants` (string) and `AllowedParticipants` (array) if casing differs?
// Go JSON is case-insensitive match on decode, but strictly respecting tags on encode.
// models.ExamBatch has `json:"allowedParticipants"`.
// BatchResponse has `json:"allowedParticipants"`.
// The one in BatchResponse (top level) should override.

func GetBatches(c *fiber.Ctx) error {
	var batches []models.ExamBatch
	database.DB.Find(&batches)

	// Lazy status update logic... (Keep existing logic)
	now := time.Now()
	for i := range batches {
		b := &batches[i]
		changed := false
		if b.Status == models.StatusScheduled && now.After(b.StartTime) && now.Before(b.EndTime) {
			b.Status = models.StatusActive
			changed = true
		}
		if (b.Status == models.StatusActive || b.Status == models.StatusScheduled) && now.After(b.EndTime) {
			b.Status = models.StatusFinished
			changed = true
		}
		if changed {
			database.DB.Model(b).Update("Status", b.Status)
		}
	}

	var responses []BatchResponse
	for _, b := range batches {
		responses = append(responses, toBatchResponse(b))
	}
	return c.JSON(responses)
}

func CreateBatch(c *fiber.Ctx) error {
	type CreateBatchReq struct {
		models.ExamBatch
		AllowedParticipants []string `json:"allowedParticipants"`
		Waitlist            []string `json:"waitlist"`
		ClassID             string   `json:"classId"`
	}

	var req CreateBatchReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	batch := req.ExamBatch
	batch.ID = "batch-" + time.Now().Format("20060102150405")
	batch.CreatedAt = time.Now()
	batch.Status = models.StatusScheduled

	// Fix: Auto-calculate duration if 0
	if batch.Duration == 0 {
		duration := int(batch.EndTime.Sub(batch.StartTime).Minutes())
		if duration > 0 {
			batch.Duration = duration
		}
	}

	// Sync participants if ClassID is provided
	if req.ClassID != "" {
		var class models.Class
		if err := database.DB.First(&class, "id = ?", req.ClassID).Error; err == nil {
			batch.ClassID = req.ClassID
			// Class.StudentIDs is a JSON string of []string
			var classStudentIDs []string
			_ = json.Unmarshal([]byte(class.StudentIDs), &classStudentIDs)

			// If we want to allow manually added participants on top of class, we merge them
			// But user said "1 batch can only have 1 class". So we overwrite or take unique.
			// Let's assume class defines the list.
			req.AllowedParticipants = classStudentIDs
		}
	}

	// Marshal arrays to string
	ap, _ := json.Marshal(req.AllowedParticipants)
	batch.AllowedParticipants = string(ap)

	wl, _ := json.Marshal(req.Waitlist)
	batch.Waitlist = string(wl)

	if err := database.DB.Create(&batch).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create batch"})
	}

	LogEvent(models.EventBatchCreated, batch.ID, "", batch.CreatedBy, "Batch created")
	return c.JSON(toBatchResponse(batch))
}

func UpdateBatch(c *fiber.Ctx) error {
	id := c.Params("id")

	type UpdateBatchReq struct {
		models.ExamBatch
		AllowedParticipants []string `json:"allowedParticipants"`
		ClassID             string   `json:"classId"`
	}

	var req UpdateBatchReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
	}

	batch.Name = req.Name
	batch.QuizID = req.QuizID
	batch.StartTime = req.StartTime
	batch.EndTime = req.EndTime
	batch.Token = req.Token

	// Fix: Allow updating duration. If 0, auto-calculate.
	if req.Duration > 0 {
		batch.Duration = req.Duration
	} else if req.Duration == 0 {
		// Auto-calculate
		duration := int(req.EndTime.Sub(req.StartTime).Minutes())
		if duration > 0 {
			batch.Duration = duration
		}
	}

	if req.ClassID != "" && req.ClassID != batch.ClassID {
		var class models.Class
		if err := database.DB.First(&class, "id = ?", req.ClassID).Error; err == nil {
			batch.ClassID = req.ClassID
			var classStudentIDs []string
			_ = json.Unmarshal([]byte(class.StudentIDs), &classStudentIDs)
			req.AllowedParticipants = classStudentIDs // Override manual list
		}
	}

	if req.AllowedParticipants != nil {
		ap, _ := json.Marshal(req.AllowedParticipants)
		batch.AllowedParticipants = string(ap)
	}

	if err := database.DB.Save(&batch).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update batch"})
	}

	LogEvent(models.EventBatchUpdated, batch.ID, "", "", "Batch details updated")
	return c.JSON(toBatchResponse(batch))
}

// UpdateBatchStatus godoc
// @Summary      Update Batch Status
// @Description  Update the status of an exam batch
// @Tags         batches
// @Accept       json
// @Produce      json
// @Param        id    path      string             true  "Batch ID"
// @Param        status body      map[string]string  true  "Status Object (e.g. {'status': 'active'})"
// @Success      200   {object}  models.ExamBatch
// @Failure      404   {object}  map[string]string
// @Router       /api/batches/{id}/status [put]
func UpdateBatchStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	type StatusReq struct {
		Status models.BatchStatus `json:"status"`
	}
	var req StatusReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
	}

	batch.Status = req.Status
	// Handle freeze/resume logic dates if needed

	database.DB.Save(&batch)

	if req.Status == models.StatusFrozen {
		LogEvent(models.EventBatchFrozen, batch.ID, "", "", "Batch frozen manually")
	} else if req.Status == models.StatusActive {
		LogEvent(models.EventBatchResumed, batch.ID, "", "", "Batch resumed manually")
	}

	return c.JSON(toBatchResponse(batch))
}

// GetBatchLiveStatus godoc
// @Summary      Get Live Exam Status
// @Tags         batches
// @Param        id   path      string true "Batch ID"
// @Success      200  {array}   map[string]interface{}
// @Router       /api/batches/{id}/live [get]
func GetBatchLiveStatus(c *fiber.Ctx) error {
	batchId := c.Params("id")

	// Get all attempts for this batch
	var attempts []models.Attempt
	if err := database.DB.Where("batch_id = ?", batchId).Find(&attempts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
	}

	// 1. Get Batch to check allowed participants
	var batch models.ExamBatch
	if err := database.DB.First(&batch, "id = ?", batchId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Batch not found"})
	}

	userIds := []string{}
	for _, a := range attempts {
		userIds = append(userIds, a.StudentID)
	}

	var users []models.User
	if len(userIds) > 0 {
		database.DB.Where("id IN ?", userIds).Find(&users)
	}
	userMap := make(map[string]models.User)
	for _, u := range users {
		userMap[u.ID] = u
	}

	type LiveStatus struct {
		AttemptID          string     `json:"attemptId"`
		StudentID          string     `json:"studentId"`
		StudentName        string     `json:"studentName"`
		Status             string     `json:"status"`
		IsOnline           bool       `json:"isOnline"`
		CurrentQuestionIdx int        `json:"currentQuestionIdx"`
		LastActiveAt       *time.Time `json:"lastActiveAt"`
		IsPaused           bool       `json:"isPaused"`
		Score              float64    `json:"score"`
	}

	var liveStatuses []LiveStatus
	now := time.Now()
	threshold := now.Add(-30 * time.Second) // Online if active in last 30s

	// Deduplicate: Keep latest attempt per student
	studentAttemptMap := make(map[string]models.Attempt)

	for _, a := range attempts {
		if existing, ok := studentAttemptMap[a.StudentID]; ok {
			// If we already have an attempt, keep the one that is newer
			if a.CreatedAt.After(existing.CreatedAt) {
				studentAttemptMap[a.StudentID] = a
			}
		} else {
			studentAttemptMap[a.StudentID] = a
		}
	}

	for _, a := range studentAttemptMap {
		isOnline := false
		if a.LastActiveAt != nil && a.LastActiveAt.After(threshold) {
			isOnline = true
		}

		studentName := "Unknown"
		if u, ok := userMap[a.StudentID]; ok {
			studentName = u.Name
		}

		liveStatuses = append(liveStatuses, LiveStatus{
			AttemptID:          a.ID,
			StudentID:          a.StudentID,
			StudentName:        studentName,
			Status:             string(a.Status),
			IsOnline:           isOnline,
			CurrentQuestionIdx: a.CurrentQuestionIdx,
			LastActiveAt:       a.LastActiveAt,
			IsPaused:           a.IsPaused,
			Score:              a.Score,
		})
	}

	return c.JSON(liveStatuses)
}
