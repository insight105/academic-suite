package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GetClasses godoc
// @Summary      Get All Classes
// @Tags         classes
// @Produce      json
// @Success      200  {array}  models.Class
// @Router       /api/classes [get]
func GetClasses(c *fiber.Ctx) error {
	var classes []models.Class
	if err := database.DB.Find(&classes).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch classes"})
	}
	return c.JSON(classes)
}

// GetClass godoc
// @Summary      Get Class by ID
// @Tags         classes
// @Produce      json
// @Param        id   path      string  true  "Class ID"
// @Success      200  {object}  models.Class
// @Router       /api/classes/{id} [get]
func GetClass(c *fiber.Ctx) error {
	id := c.Params("id")
	var class models.Class
	if err := database.DB.First(&class, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Class not found"})
	}
	return c.JSON(class)
}

// CreateClass godoc
// @Summary      Create New Class
// @Tags         classes
// @Accept       json
// @Produce      json
// @Param        class body models.Class true "Class Data"
// @Success      200  {object}  models.Class
// @Router       /api/classes [post]
func CreateClass(c *fiber.Ctx) error {
	var class models.Class
	if err := c.BodyParser(&class); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	class.ID = fmt.Sprintf("class-%d", time.Now().UnixNano())
	class.CreatedAt = time.Now()

	if err := database.DB.Create(&class).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create class"})
	}

	return c.JSON(class)
}

// UpdateClass godoc
// @Summary      Update Class
// @Tags         classes
// @Accept       json
// @Produce      json
// @Param        id   path      string       true  "Class ID"
// @Param        class body models.Class true "Class Data"
// @Success      200  {object}  models.Class
// @Router       /api/classes/{id} [put]
func UpdateClass(c *fiber.Ctx) error {
	id := c.Params("id")
	var class models.Class
	if err := database.DB.First(&class, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Class not found"})
	}

	var updateData models.Class
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	class.Name = updateData.Name
	class.SubjectID = updateData.SubjectID
	class.TeacherID = updateData.TeacherID
	class.StudentIDs = updateData.StudentIDs
	class.UpdatedAt = time.Now()

	database.DB.Save(&class)
	return c.JSON(class)
}

// DeleteClass godoc
// @Summary      Delete Class
// @Tags         classes
// @Param        id   path      string  true  "Class ID"
// @Success      200  {object}  map[string]string
// @Router       /api/classes/{id} [delete]
func DeleteClass(c *fiber.Ctx) error {
	id := c.Params("id")
	var class models.Class
	if err := database.DB.First(&class, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Class not found"})
	}

	database.DB.Delete(&class)
	return c.JSON(fiber.Map{"message": "Class deleted"})
}
