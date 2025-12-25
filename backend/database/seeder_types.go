package database

// Shared Types
type SeedOption struct {
	Text      string
	IsCorrect bool
}

type SeedQuestion struct {
	Text        string
	Options     []SeedOption
	Explanation string
}

type SeedQuiz struct {
	SubjectCode  string
	Grade        int // 7, 8, 9
	Title        string
	Questions    []SeedQuestion
}

// Helper for options
func o(correct string, wrong ...string) []SeedOption {
	opts := []SeedOption{
		{Text: correct, IsCorrect: true},
	}
	for _, w := range wrong {
		opts = append(opts, SeedOption{Text: w, IsCorrect: false})
	}
	return opts
}
