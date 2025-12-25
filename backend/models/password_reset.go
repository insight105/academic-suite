package models

import "time"

type PasswordResetToken struct {
	Token     string    `json:"token" gorm:"primaryKey"`
	UserID    string    `json:"userId" gorm:"index"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}
