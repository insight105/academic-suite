package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// LogEvent is a helper to create event logs from other handlers
func LogEvent(eventType models.EventType, batchID, attemptID, userID, details string) {
	log := models.EventLog{
		ID:        uuid.New().String(),
		EventType: eventType,
		BatchID:   batchID,
		AttemptID: attemptID,
		UserID:    userID,
		Details:   details,
		Timestamp: time.Now(),
	}
	// Run in background to not block main request?
	// For simplicity, just run it. If strict performance needed, use goroutine.
	go func() {
		database.DB.Create(&log)
	}()
}

// GetEventLogs godoc
// @Summary      Get Event Logs
// @Description  Retrieve event logs, optionally filtered by batchId
// @Tags         reports
// @Produce      json
// @Param        batchId    query     string  false  "Batch ID to filter"
// @Success      200  {array}  models.EventLog
// @Router       /api/reports/logs [get]
func GetEventLogs(c *fiber.Ctx) error {
	batchID := c.Query("batchId")

	var logs []models.EventLog
	query := database.DB.Order("timestamp desc")

	if batchID != "" {
		query = query.Where("batch_id = ?", batchID)
	}

	if err := query.Find(&logs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch logs"})
	}

	return c.JSON(logs)
}
