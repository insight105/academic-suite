package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
)

// SubjectResponse adds resolved teacher objects to the subject response
type SubjectResponse struct {
	ID            string         `json:"id"`
	DepartmentID  string         `json:"departmentId"`
	Name          string         `json:"name"`
	Code          string         `json:"code"`
	Credits       int            `json:"credits"`
	InstitutionID string         `json:"institutionId"`
	TeacherIDs    []string       `json:"teacherIds"` // Raw IDs
	Teachers      []UserResponse `json:"teachers"`   // Resolved objects
}

func toSubjectResponse(s models.Subject) SubjectResponse {
	var teacherIDs []string
	if s.TeacherIDs != "" {
		_ = json.Unmarshal([]byte(s.TeacherIDs), &teacherIDs)
	}

	var teachers []UserResponse = []UserResponse{}
	if len(teacherIDs) > 0 {
		var teacherUsers []models.User
		// Find users where ID is in the list
		database.DB.Where("id IN ?", teacherIDs).Find(&teacherUsers)
		for _, t := range teacherUsers {
			teachers = append(teachers, toUserResponse(t))
		}
	}

	return SubjectResponse{
		ID:            s.ID,
		DepartmentID:  s.DepartmentID,
		Name:          s.Name,
		Code:          s.Code,
		Credits:       s.Credits,
		InstitutionID: s.InstitutionID,
		TeacherIDs:    teacherIDs,
		Teachers:      teachers,
	}
}

// GetSubjects godoc
// @Summary      Get All Subjects
// @Description  Retrieve a list of all subjects with resolved teachers
// @Tags         subjects
// @Produce      json
// @Success      200  {array}  SubjectResponse
// @Router       /api/subjects [get]
func GetSubjects(c *fiber.Ctx) error {
	institutionId := c.Query("institutionId")
	var subjects []models.Subject

	query := database.DB
	if institutionId != "" {
		query = query.Where("institution_id = ?", institutionId)
	}
	query.Find(&subjects)

	var responses []SubjectResponse
	for _, s := range subjects {
		responses = append(responses, toSubjectResponse(s))
	}

	return c.JSON(responses)
}

// GetSubject godoc
// @Summary      Get Subject by ID
// @Description  Retrieve a single subject by its ID
// @Tags         subjects
// @Produce      json
// @Param        id   path      string  true  "Subject ID"
// @Success      200  {object}  SubjectResponse
// @Failure      404  {object}  map[string]string
// @Router       /api/subjects/{id} [get]
func GetSubject(c *fiber.Ctx) error {
	id := c.Params("id")
	var subject models.Subject
	if err := database.DB.First(&subject, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Subject not found"})
	}
	return c.JSON(toSubjectResponse(subject))
}

// CreateSubject godoc
// @Summary      Create New Subject
// @Description  Create a new subject (Admin only)
// @Tags         subjects
// @Accept       json
// @Produce      json
// @Param        subject body models.Subject true "Subject Data"
// @Success      200  {object}  SubjectResponse
// @Failure      400  {object}  map[string]string
// @Router       /api/subjects [post]
func CreateSubject(c *fiber.Ctx) error {
	type CreateReq struct {
		Name          string   `json:"name"`
		Code          string   `json:"code"`
		Credits       int      `json:"credits"`
		TeacherIDs    []string `json:"teacherIds"`
		DepartmentID  string   `json:"departmentId"`
		InstitutionID string   `json:"institutionId"`
	}

	var req CreateReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Name == "" || req.Code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name and Code are required"})
	}

	// Serialize TeacherIDs to JSON string
	teacherIDsJSON, _ := json.Marshal(req.TeacherIDs)

	// Get User to set InstitutionID
	userId := c.Locals("userId").(string)
	var user models.User
	if err := database.DB.First(&user, "id = ?", userId).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found"})
	}

	subject := models.Subject{
		ID:            "subj-" + time.Now().Format("20060102150405"),
		Name:          req.Name,
		Code:          req.Code,
		Credits:       req.Credits,
		DepartmentID:  req.DepartmentID,
		TeacherIDs:    string(teacherIDsJSON),
		InstitutionID: user.InstitutionID,
	}

	if err := database.DB.Create(&subject).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create subject"})
	}

	return c.JSON(toSubjectResponse(subject))
}

// UpdateSubject godoc
// @Summary      Update Subject
// @Description  Update subject details
// @Tags         subjects
// @Accept       json
// @Produce      json
// @Param        id   path      string       true  "Subject ID"
// @Param        subject body      CreateReq    true  "Subject Data"
// @Success      200  {object}  SubjectResponse
// @Router       /api/subjects/{id} [put]
func UpdateSubject(c *fiber.Ctx) error {
	id := c.Params("id")

	var subject models.Subject
	if err := database.DB.First(&subject, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Subject not found"})
	}

	type UpdateReq struct {
		Name         string   `json:"name"`
		Code         string   `json:"code"`
		Credits      int      `json:"credits"`
		TeacherIDs   []string `json:"teacherIds"`
		DepartmentID string   `json:"departmentId"`
	}

	var req UpdateReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Name != "" {
		subject.Name = req.Name
	}
	if req.Code != "" {
		subject.Code = req.Code
	}
	subject.Credits = req.Credits // Allow 0?
	subject.DepartmentID = req.DepartmentID

	// Ensure InstitutionID matches the user updating it (or prevent moving to another inst)
	userId := c.Locals("userId").(string)
	var user models.User
	if err := database.DB.First(&user, "id = ?", userId).Error; err == nil {
		subject.InstitutionID = user.InstitutionID
	}

	if req.TeacherIDs != nil {
		teacherIDsJSON, _ := json.Marshal(req.TeacherIDs)
		subject.TeacherIDs = string(teacherIDsJSON)
	}

	database.DB.Save(&subject)

	return c.JSON(toSubjectResponse(subject))
}

// DeleteSubject godoc
// @Summary      Delete Subject
// @Description  Delete a subject
// @Tags         subjects
// @Param        id   path      string  true  "Subject ID"
// @Success      204
// @Router       /api/subjects/{id} [delete]
func DeleteSubject(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Subject{}, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete subject"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
