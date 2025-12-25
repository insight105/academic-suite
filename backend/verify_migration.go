package main

import (
	"academic-suite-backend/database"
	"academic-suite-backend/models"
	"fmt"
)

func main() {
	// Trigger the database connection which includes migration and seeding logic
	database.Connect()

	// Verify that no users have "Siswa Dummy" in their name
	var count int64
	database.DB.Model(&models.User{}).Where("name LIKE ?", "%Siswa Dummy%").Count(&count)

	if count == 0 {
		fmt.Println("SUCCESS: No users found with 'Siswa Dummy' in their name.")
	} else {
		fmt.Printf("FAILURE: Found %d users with 'Siswa Dummy' in their name.\n", count)
	}

	// Print some sample names
	var users []models.User
	database.DB.Limit(5).Where("email LIKE ?", "student-dummy-%").Find(&users)
	fmt.Println("Sample User Names:")
	for _, u := range users {
		fmt.Printf("- %s (%s)\n", u.Name, u.Email)
	}
}
