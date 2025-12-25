package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"math"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// UserResponse simplifies the user structure for API responses (excludes password)
type UserResponse struct {
	ID            string          `json:"id"`
	Email         string          `json:"email"`
	Name          string          `json:"name"`
	Role          models.UserRole `json:"role"`
	InstitutionID string          `json:"institutionId"`
	AvatarURL     string          `json:"avatarUrl"`
	CreatedAt     time.Time       `json:"createdAt"`
}

func toUserResponse(u models.User) UserResponse {
	return UserResponse{
		ID:            u.ID,
		Email:         u.Email,
		Name:          u.Name,
		Role:          u.Role,
		InstitutionID: u.InstitutionID,
		AvatarURL:     u.AvatarURL,
		CreatedAt:     u.CreatedAt,
	}
}

// GetUsers godoc
// @Summary      Get Users List
// @Description  Get users with options for pagination, search, and filtering
// @Tags         users
// @Produce      json
// @Param        page          query     int     false  "Page number (default 1)"
// @Param        limit         query     int     false  "Items per page (default 10)"
// @Param        search        query     string  false  "Search by name or email"
// @Param        institutionId query     string  false  "Filter by Institution ID"
// @Success      200           {object}  map[string]interface{}
// @Router       /api/users [get]
func GetUsers(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := c.Query("search", "")
	institutionId := c.Query("institutionId", "")
	role := c.Query("role", "")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	var users []models.User
	var total int64

	query := database.DB.Model(&models.User{})

	if institutionId != "" {
		query = query.Where("institution_id = ?", institutionId)
	}
	if role != "" {
		query = query.Where("role = ?", role)
	}

	if search != "" {
		searchLike := "%" + search + "%"
		query = query.Where("name ILIKE ? OR email ILIKE ?", searchLike, searchLike)
	}

	query.Count(&total)

	query.Offset(offset).Limit(limit).Order("created_at desc").Find(&users)

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// Map to response safe struct
	var safeUsers []UserResponse
	for _, u := range users {
		safeUsers = append(safeUsers, toUserResponse(u))
	}

	return c.JSON(fiber.Map{
		"data": safeUsers,
		"meta": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

// CreateUser godoc
// @Summary      Create New User
// @Description  Create a new user (Admin functionality)
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        user body models.User true "User Data"
// @Success      200  {object}  UserResponse
// @Failure      400  {object}  map[string]string
// @Router       /api/users [post]
func CreateUser(c *fiber.Ctx) error {
	type CreateReq struct {
		Email         string          `json:"email"`
		Password      string          `json:"password"`
		Name          string          `json:"name"`
		Role          models.UserRole `json:"role"`
		InstitutionID string          `json:"institutionId"`
	}

	var req CreateReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Basic validation
	if req.Email == "" || req.Password == "" || req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	}

	user := models.User{
		ID:            "user-" + time.Now().Format("20060102150405"), // Simple ID generation
		Email:         req.Email,
		Password:      string(hashedPassword),
		Name:          req.Name,
		Role:          req.Role,
		InstitutionID: req.InstitutionID,
		CreatedAt:     time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create user (email might be taken)"})
	}

	return c.JSON(toUserResponse(user))
}

// UpdateUser godoc
// @Summary      Update User
// @Description  Update user details
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string       true  "User ID"
// @Param        user body      models.User  true  "User Data"
// @Success      200  {object}  UserResponse
// @Router       /api/users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	type UpdateReq struct {
		Name          string          `json:"name"`
		Role          models.UserRole `json:"role"`
		InstitutionID string          `json:"institutionId"`
		// Password updates should be a separate secure endpoint usually, keeping simple for now
	}

	var req UpdateReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Role != "" {
		user.Role = req.Role
	}
	if req.InstitutionID != "" {
		user.InstitutionID = req.InstitutionID
	}

	database.DB.Save(&user)

	return c.JSON(toUserResponse(user))
}
