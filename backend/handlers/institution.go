package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"

	"time"

	"github.com/gofiber/fiber/v2"
)

// GetInstitutions godoc
// @Summary      Get All Institutions
// @Description  Retrieve a list of all institutions
// @Tags         institutions
// @Produce      json
// @Success      200  {array}  models.Institution
// @Router       /api/institutions [get]
func GetInstitutions(c *fiber.Ctx) error {
	var institutions []models.Institution
	database.DB.Find(&institutions)
	return c.JSON(institutions)
}

// CreateInstitution godoc
// @Summary      Create New Institution
// @Description  Create a new institution
// @Tags         institutions
// @Accept       json
// @Produce      json
// @Param        institution body models.Institution true "Institution Data"
// @Success      200  {object}  models.Institution
// @Router       /api/institutions [post]
func CreateInstitution(c *fiber.Ctx) error {
	var req models.Institution
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name is required"})
	}

	req.ID = "inst-" + time.Now().Format("20060102150405")
	req.CreatedAt = time.Now()

	if err := database.DB.Create(&req).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create institution"})
	}

	return c.JSON(req)
}
