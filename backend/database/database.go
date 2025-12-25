package database

import (
	"academic-suite-backend/models"
	"fmt"
	"log"
	"time"

	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	// ... (Connect logic remains same until seed call)
	// 1. Load Config
	viper.SetConfigName("config")
	viper.SetConfigType("yml")
	viper.AddConfigPath(".")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	host := viper.GetString("database.host")
	user := viper.GetString("database.user")
	password := viper.GetString("database.password")
	dbname := viper.GetString("database.dbname")
	port := viper.GetString("database.port")
	sslmode := viper.GetString("database.sslmode")

	// 2. Connect to default 'postgres' database to check/create target DB
	dsnDefault := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=%s",
		host, user, password, port, sslmode)

	db, err := gorm.Open(postgres.Open(dsnDefault), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to postgres default DB: %v", err)
	}

	// Check if database exists
	var count int
	db.Raw("SELECT count(*) FROM pg_database WHERE datname = ?", dbname).Scan(&count)
	if count == 0 {
		log.Printf("Database %s does not exist. Creating...", dbname)
		if err := db.Exec(fmt.Sprintf("CREATE DATABASE %s", dbname)).Error; err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
		log.Println("Database created successfully")
	}

	// Close connection to default DB
	sqlDB, _ := db.DB()
	sqlDB.Close()

	// 3. Connect to Target Database
	dsnTarget := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbname, port, sslmode)

	DB, err = gorm.Open(postgres.Open(dsnTarget), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Optimize Connection Pool
	// Optimize Connection Pool
	targetSQLDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get sqlDB:", err)
	}
	// Postgre Default Max Connections is usually 100. Set slightly lower to leave room for other apps.
	targetSQLDB.SetMaxOpenConns(90)
	targetSQLDB.SetMaxIdleConns(10)
	targetSQLDB.SetConnMaxLifetime(time.Hour)

	log.Println("Connected to Database")

	log.Println("Running Migrations...")
	err = DB.AutoMigrate(
		&models.User{},
		&models.Institution{},
		&models.Subject{},
		&models.Quiz{},
		&models.Question{},
		&models.QuestionOption{},
		&models.ExamBatch{},
		&models.Attempt{},
		&models.Answer{},
		&models.EventLog{},
		&models.Class{},
		&models.PasswordResetToken{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
	log.Println("Migrations Completed")

	// Seed Users
	seedUsers()

	// Seed Academic Data
	seedAcademicData()

	// Migrate Dummy Names
	migrateDummyNames()
}

func hashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Println("Error hashing password:", err)
		return ""
	}
	return string(bytes)
}

func seedUsers() {
	users := []models.User{
		{
			ID:            "admin-1",
			Email:         "admin@eduexam.com",
			Password:      hashPassword("admin123"),
			Name:          "Dr. Admin Utama",
			Role:          models.RoleAdmin,
			InstitutionID: "inst-1",
			CreatedAt:     time.Now(),
		},
		{
			ID:            "teacher-1",
			Email:         "guru@eduexam.com",
			Password:      hashPassword("guru123"),
			Name:          "Pak Budi Santoso",
			Role:          models.RoleTeacher,
			InstitutionID: "inst-1",
			CreatedAt:     time.Now(),
		},
		{
			ID:            "student-1",
			Email:         "siswa@eduexam.com",
			Password:      hashPassword("siswa123"),
			Name:          "Andi Pratama",
			Role:          models.RoleStudent,
			InstitutionID: "inst-1",
			CreatedAt:     time.Now(),
		},
	}

	for _, u := range users {
		// Use Upsert (OnConflict) to handle duplicates gracefully
		// Conflict on 'id' -> Update fields
		// Note: We need to make sure we conflict on the Primary Key "id"
		if err := DB.Model(&u).Where("id = ?", u.ID).Updates(&u).Error; err == nil {
			// Check if updates affected 0 rows (meaning ID didn't exist)
			// Actually Updates with Where only updates if exists.
			// Let's use FirstOrCreate or explicit check by ID.
			var existing models.User
			if err := DB.First(&existing, "id = ?", u.ID).Error; err == nil {
				// Exists, update fields
				existing.Email = u.Email
				existing.Password = u.Password
				existing.Name = u.Name
				existing.Role = u.Role
				DB.Save(&existing)
				log.Printf("Updated User: %s", u.Email)
			} else {
				// Not found, create
				if err := DB.Create(&u).Error; err != nil {
					log.Printf("Failed to seed user %s: %v", u.Email, err)
				} else {
					log.Printf("Seeded User: %s", u.Email)
				}
			}
		}
	}

	seedDummyStudents()
}

func seedDummyStudents() {
	var count int64
	DB.Model(&models.User{}).Where("email LIKE ?", "student-dummy-%@eduexam.com").Count(&count)

	if count >= 1000 {
		log.Println("Dummy students already seeded.")
		return
	}

	log.Println("Seeding 1000 dummy students...")
	password := hashPassword("siswa123")
	var users []models.User

	// Create 1000 students
	for i := 1; i <= 1000; i++ {
		users = append(users, models.User{
			ID:            fmt.Sprintf("student-dummy-%d", i),
			Email:         fmt.Sprintf("student-dummy-%d@eduexam.com", i),
			Password:      password,
			Name:          GenerateRandomName(),
			Role:          models.RoleStudent,
			InstitutionID: "inst-1",
			CreatedAt:     time.Now(),
		})
	}

	// Batch insert in chunks of 100
	if err := DB.CreateInBatches(users, 100).Error; err != nil {
		log.Printf("Failed to batch seed dummy students: %v", err)
	} else {
		log.Println("Successfully seeded 1000 dummy students")
	}
}

func migrateDummyNames() {
	log.Println("Checking for dummy names to migrate...")
	var users []models.User
	if err := DB.Where("name LIKE ?", "%Siswa Dummy%").Find(&users).Error; err != nil {
		log.Printf("Error finding users to migrate: %v", err)
		return
	}

	if len(users) == 0 {
		log.Println("No dummy names found to migrate.")
		return
	}

	log.Printf("Migrating %d dummy names...", len(users))
	count := 0
	for _, user := range users {
		user.Name = GenerateRandomName()
		if err := DB.Save(&user).Error; err != nil {
			log.Printf("Failed to update name for user %s: %v", user.ID, err)
		} else {
			count++
		}
	}
	log.Printf("Successfully migrated %d/%d dummy names.", count, len(users))
}
