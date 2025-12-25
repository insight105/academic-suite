package routes

import (
	"academic-suite-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/auth/login", handlers.Login)
	api.Post("/auth/forgot-password", handlers.ForgotPassword)
	api.Post("/auth/reset-password", handlers.ResetPassword)

	// Protected
	api.Use(AuthMiddleware)

	api.Get("/auth/profile", handlers.GetProfile)

	// Users
	api.Get("/users", handlers.GetUsers)
	api.Post("/users", handlers.CreateUser)
	api.Put("/users/:id", handlers.UpdateUser)

	// Quizzes
	api.Get("/quizzes", handlers.GetQuizzes)
	api.Get("/quizzes/:id", handlers.GetQuiz)
	api.Post("/quizzes", handlers.CreateQuiz)
	api.Put("/quizzes/:id", handlers.UpdateQuiz)

	// Institutions
	api.Get("/institutions", handlers.GetInstitutions)
	api.Post("/institutions", handlers.CreateInstitution)

	// Subjects
	api.Get("/subjects", handlers.GetSubjects)
	api.Get("/subjects/:id", handlers.GetSubject)
	api.Post("/subjects", handlers.CreateSubject)
	api.Put("/subjects/:id", handlers.UpdateSubject)
	api.Delete("/subjects/:id", handlers.DeleteSubject)

	// Batches
	api.Get("/batches", handlers.GetBatches)
	api.Post("/batches", handlers.CreateBatch)
	api.Put("/batches/:id", handlers.UpdateBatch)
	api.Put("/batches/:id/status", handlers.UpdateBatchStatus)
	api.Get("/batches/:id/live", handlers.GetBatchLiveStatus) // New

	// Attempts
	attempts := api.Group("/attempts")
	attempts.Get("/", handlers.GetAttempts)
	attempts.Post("/start", handlers.StartAttempt)
	attempts.Post("/:id/answers", handlers.SaveAnswer)
	attempts.Post("/:id/submit", handlers.SubmitAttempt) // Now redundant? No, keeps compatible.
	attempts.Post("/:id/log", handlers.LogAttemptEvent)
	attempts.Post("/:id/pause", handlers.PauseAttempt)
	attempts.Post("/:id/resume", handlers.ResumeAttempt)
	attempts.Post("/:id/force-submit", handlers.ForceSubmitAttempt)
	attempts.Post("/:id/ping", handlers.PingAttempt)
	attempts.Get("/:id/time", handlers.GetServerTime)

	// Reports
	api.Get("/reports/batch", handlers.GetBatchReport)
	api.Get("/reports/logs", handlers.GetEventLogs)
	api.Get("/export/batch/:id", handlers.ExportBatchReport) // Export route

	// Import
	api.Post("/import/users", handlers.ImportUsers)
	api.Post("/import/questions/:quizId", handlers.ImportQuestions)

	// Classes
	api.Get("/classes", handlers.GetClasses)
	api.Get("/classes/:id", handlers.GetClass)
	api.Post("/classes", handlers.CreateClass)
	api.Put("/classes/:id", handlers.UpdateClass)
	api.Delete("/classes/:id", handlers.DeleteClass)
}
