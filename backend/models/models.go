package models

import (
	"time"
)

type UserRole string

const (
	RoleAdmin   UserRole = "admin"
	RoleTeacher UserRole = "teacher"
	RoleStudent UserRole = "student"
)

type User struct {
	ID            string    `json:"id" gorm:"primaryKey"`
	Email         string    `json:"email" gorm:"unique;not null"`
	Password      string    `json:"-"` // Not present in frontend types but needed for auth
	Name          string    `json:"name"`
	Role          UserRole  `json:"role"`
	InstitutionID string    `json:"institutionId"`
	AvatarURL     string    `json:"avatarUrl"`
	CreatedAt     time.Time `json:"createdAt"`
}

type Institution struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Type      string    `json:"type"` // 'school' | 'university'
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"createdAt"`
}

type Subject struct {
	ID            string `json:"id" gorm:"primaryKey"`
	DepartmentID  string `json:"departmentId"`
	Name          string `json:"name"`
	Code          string `json:"code"`
	Credits       int    `json:"credits"`
	TeacherIDs    string `json:"teacherIds" gorm:"type:text"` // JSON array of teacher IDs
	InstitutionID string `json:"institutionId"`
}

type QuestionType string

const (
	TypeMCQ         QuestionType = "mcq"
	TypeTrueFalse   QuestionType = "true_false"
	TypeShortAnswer QuestionType = "short_answer"
	TypeEssay       QuestionType = "essay"
)

type QuestionOption struct {
	ID         string `json:"id" gorm:"primaryKey"`
	QuestionID string `json:"questionId"`
	Text       string `json:"text"`
	IsCorrect  bool   `json:"isCorrect"`
}

type Question struct {
	ID            string           `json:"id" gorm:"primaryKey"`
	QuizID        string           `json:"quizId"`
	Type          QuestionType     `json:"type"`
	Text          string           `json:"text"`
	Points        int              `json:"points"`
	Options       []QuestionOption `json:"options" gorm:"foreignKey:QuestionID"`
	CorrectAnswer string           `json:"correctAnswer"` // For non-MCQ
	Explanation   string           `json:"explanation"`
	OrderIndex    int              `json:"orderIndex"`
}

type ExamType string

const (
	ExamDaily    ExamType = "daily_quiz"
	ExamMidterm  ExamType = "midterm"
	ExamFinal    ExamType = "final"
	ExamPractice ExamType = "practice"
)

type Quiz struct {
	ID            string     `json:"id" gorm:"primaryKey"`
	SubjectID     string     `json:"subjectId"`
	Title         string     `json:"title"`
	Description   string     `json:"description"`
	ExamType      ExamType   `json:"examType"`
	TotalPoints   int        `json:"totalPoints"`
	PassingScore  int        `json:"passingScore"`
	Status        string     `json:"status" gorm:"default:'active'"` // 'active', 'archived', 'draft'
	InstitutionID string     `json:"institutionId"`
	Questions     []Question `json:"questions" gorm:"foreignKey:QuizID"`
	CreatedBy     string     `json:"createdBy"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}

type BatchType string
type BatchStatus string

const (
	BatchRegular BatchType = "REGULAR"
	BatchMakeup  BatchType = "MAKEUP"
)

const (
	StatusScheduled BatchStatus = "scheduled"
	StatusActive    BatchStatus = "active"
	StatusFrozen    BatchStatus = "frozen"
	StatusFinished  BatchStatus = "finished"
)

type ExamBatch struct {
	ID                  string      `json:"id" gorm:"primaryKey"`
	QuizID              string      `json:"quizId"`
	ClassID             string      `json:"classId"`
	Type                BatchType   `json:"type"`
	Name                string      `json:"name"` // Renamed from Title to match Frontend
	Token               string      `json:"token"`
	StartTime           time.Time   `json:"startTime"`
	EndTime             time.Time   `json:"endTime"`
	Duration            int         `json:"duration"` // minutes
	Status              BatchStatus `json:"status"`
	AllowedParticipants string      `json:"allowedParticipants" gorm:"type:text"` // Stored as JSON
	Waitlist            string      `json:"waitlist" gorm:"type:text"`            // Stored as JSON
	CreatedBy           string      `json:"createdBy"`
	CreatedAt           time.Time   `json:"createdAt"`
	FrozenAt            *time.Time  `json:"frozenAt"`
	ResumedAt           *time.Time  `json:"resumedAt"`
}

type AttemptStatus string

const (
	AttemptNotStarted   AttemptStatus = "NOT_STARTED"
	AttemptActive       AttemptStatus = "ACTIVE"
	AttemptSubmitted    AttemptStatus = "SUBMITTED"
	AttemptExpired      AttemptStatus = "EXPIRED"
	AttemptFrozen       AttemptStatus = "FROZEN"
	AttemptInterrupted  AttemptStatus = "INTERRUPTED"
	AttemptResetByAdmin AttemptStatus = "RESET_BY_ADMIN"
)

type Answer struct {
	AttemptID        string    `json:"attemptId" gorm:"primaryKey"` // Composite key part 1? No, better own ID or belong to Attempt
	QuestionID       string    `json:"questionId" gorm:"primaryKey"`
	SelectedOptionID string    `json:"selectedOptionId"`
	TextAnswer       string    `json:"textAnswer"`
	AnsweredAt       time.Time `json:"answeredAt"`
}

type Attempt struct {
	ID                 string        `json:"id" gorm:"primaryKey"`
	BatchID            string        `json:"batchId"`
	StudentID          string        `json:"studentId"`
	Status             AttemptStatus `json:"status"`
	Answers            []Answer      `json:"answers" gorm:"foreignKey:AttemptID"`
	Score              float64       `json:"score"`
	StartedAt          *time.Time    `json:"startedAt"`
	SubmittedAt        *time.Time    `json:"submittedAt"`
	ExpiredAt          *time.Time    `json:"expiredAt"`
	FrozenAt           *time.Time    `json:"frozenAt"`
	RemainingTime      int           `json:"remainingTime"` // seconds, snapshot
	ServerTime         time.Time     `json:"serverTime"`    // Unlikely to store in DB, but kept for struct parity
	CreatedAt          time.Time     `json:"createdAt"`
	LastActiveAt       *time.Time    `json:"lastActiveAt"`
	CurrentQuestionIdx int           `json:"currentQuestionIdx"`
	IsPaused           bool          `json:"isPaused"`
	PausedAt           *time.Time    `json:"pausedAt"`
	TotalPausedTime    int           `json:"totalPausedTime"` // seconds
}

type EventType string

const (
	EventBatchCreated  EventType = "BATCH_CREATED"
	EventBatchUpdated  EventType = "BATCH_UPDATED"
	EventBatchFrozen   EventType = "BATCH_FROZEN"
	EventBatchResumed  EventType = "BATCH_RESUMED"
	EventAttemptStart  EventType = "ATTEMPT_STARTED"
	EventAttemptSubmit EventType = "ATTEMPT_SUBMITTED"
	EventFocusLost     EventType = "FOCUS_LOST"
	EventFocusGained   EventType = "FOCUS_GAINED"
	EventCopyAttempt   EventType = "COPY_ATTEMPT"
	EventPasteAttempt  EventType = "PASTE_ATTEMPT"
)

type EventLog struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	EventType EventType `json:"eventType"`
	BatchID   string    `json:"batchId"`
	AttemptID string    `json:"attemptId"`
	UserID    string    `json:"userId"`
	Details   string    `json:"details" gorm:"type:text"` // JSON string
	Timestamp time.Time `json:"timestamp"`
}

type Class struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name"`
	SubjectID  string    `json:"subjectId"`
	TeacherID  string    `json:"teacherId"`
	StudentIDs string    `json:"studentIds" gorm:"type:text"` // JSON array of UserIDs
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
