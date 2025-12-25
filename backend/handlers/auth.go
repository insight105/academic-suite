package handlers

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Secret key should be in env
var jwtSecret = []byte("secret")

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthTokens struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresAt    int64  `json:"expiresAt"`
}

// Login godoc
// @Summary      User Login
// @Description  Authenticate user and return JWT tokens
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body LoginRequest true "Login Credentials"
// @Success      200  {object} map[string]interface{}
// @Failure      400  {object} map[string]string
// @Failure      401  {object} map[string]string
// @Router       /api/auth/login [post]
func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User tidak ditemukan"})
	}

	// Verify Password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Password salah"})
	}

	// Generate Token
	claims := jwt.MapClaims{
		"userId": user.ID,
		"role":   user.Role,
		"exp":    time.Now().Add(time.Hour * 1).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not login"})
	}

	return c.JSON(fiber.Map{
		"user": user,
		"tokens": AuthTokens{
			AccessToken:  t,
			RefreshToken: t + "_refresh", // Mock refresh token
			ExpiresAt:    time.Now().Add(time.Hour*1).Unix() * 1000,
		},
	})
}

// GetProfile godoc
// @Summary      Get User Profile
// @Description  Get the profile of the currently logged in user
// @Tags         auth
// @Accept       json
// @Produce      json
// @Security     ApiKeyAuth
// @Success      200  {object} models.User
// @Failure      404  {object} map[string]string
// @Router       /api/auth/profile [get]
func GetProfile(c *fiber.Ctx) error {
	// userId from middleware
	userId := c.Locals("userId").(string)

	var user models.User
	if err := database.DB.First(&user, "id = ?", userId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(user)
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

// ForgotPassword godoc
// @Summary      Request Password Reset
// @Description  Generate a reset token for the given email
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body ForgotPasswordRequest true "Email"
// @Success      200  {object} map[string]string
// @Failure      404  {object} map[string]string
// @Router       /api/auth/forgot-password [post]
func ForgotPassword(c *fiber.Ctx) error {
	var req ForgotPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		// Return 200 even if not found to prevent enumeration, or 404 for dev convenience?
		// For this project, let's return 404 to be helpful.
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Email tidak terdaftar"})
	}

	// Generate Token
	token := "reset-" + uuid.New().String()
	resetToken := models.PasswordResetToken{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(15 * time.Minute),
		CreatedAt: time.Now(),
	}

	database.DB.Create(&resetToken)

	// In a real app, send email. Here, log to console.
	fmt.Printf("\n=== PASSWORD RESET TOKEN ===\nEmail: %s\nToken: %s\nLink: /reset-password?token=%s\n============================\n", user.Email, token, token)

	return c.JSON(fiber.Map{
		"message": "Link reset password telah dikirim ke email Anda (Cek Console Server)",
	})
}

// ResetPassword godoc
// @Summary      Reset Password
// @Description  Reset user password using token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body ResetPasswordRequest true "Token and New Password"
// @Success      200  {object} map[string]string
// @Failure      400  {object} map[string]string
// @Router       /api/auth/reset-password [post]
func ResetPassword(c *fiber.Ctx) error {
	var req ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var resetToken models.PasswordResetToken
	if err := database.DB.Where("token = ?", req.Token).First(&resetToken).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Token tidak valid"})
	}

	if time.Now().After(resetToken.ExpiresAt) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Token kedaluwarsa"})
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)

	// Update User Password
	if err := database.DB.Model(&models.User{}).Where("id = ?", resetToken.UserID).Update("password", string(hashedPassword)).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mereset password"})
	}

	// Delete used token
	database.DB.Delete(&resetToken)

	return c.JSON(fiber.Map{"message": "Password berhasil diubah. Silakan login."})
}
