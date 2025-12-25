package main

import (
	"academic-suite-backend/database"
	"academic-suite-backend/routes"
	"log"

	_ "academic-suite-backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberRecover "github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/swagger"
)

// @title           Academic Suite API
// @version         1.0
// @description     This is the API server for Academic Suite.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /

func main() {
	// 1. Initialize Database
	database.Connect()

	// 2. Setup Fiber App
	app := fiber.New()
	app.Use(fiberRecover.New())

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:8080, https://academic-suite.netlify.app", // Allow Frontend (Vite default & Custom & Netlify)
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// 3. Setup Routes
	routes.SetupRoutes(app)

	// Swagger Route
	app.Get("/swagger/*", swagger.HandlerDefault)

	// 4. Start Server
	log.Fatal(app.Listen("0.0.0.0:8060"))
}
