package main

import (
	"fmt"
	"math"
	"time"
)

func main() {
	// Simulate the scenario
	// User Current Time: 2025-12-22 14:41 +0700
	userNowStr := "2025-12-22T14:41:16+07:00"
	userNow, _ := time.Parse(time.RFC3339, userNowStr)

	// Batch End Time: 2025-12-22 14:50
	// Hypothesis 1: EndTime stored as UTC (parsed from 14:50 Local) -> 07:50 UTC
	endTimeUTCStr := "2025-12-22T07:50:00Z"
	endTimeUTC, _ := time.Parse(time.RFC3339, endTimeUTCStr)

	// Hypothesis 2: EndTime stored as Local 14:50 +0700
	endTimeLocalStr := "2025-12-22T14:50:00+07:00"
	endTimeLocal, _ := time.Parse(time.RFC3339, endTimeLocalStr)

	// Hypothesis 3: EndTime stored as 14:50 UTC (User put 14:50, backend treated as UTC)
	endTimeWrongUTCStr := "2025-12-22T14:50:00Z"
	endTimeWrongUTC, _ := time.Parse(time.RFC3339, endTimeWrongUTCStr)

	// Duration: 60 mins (plenty)
	duration := 60
	allowedDurationSeconds := float64(duration * 60)

	fmt.Printf("User Now: %v\n", userNow)

	testScenario("Correct UTC", userNow, endTimeUTC, allowedDurationSeconds)
	testScenario("Correct Local", userNow, endTimeLocal, allowedDurationSeconds)
	testScenario("Wrong UTC (14:50 Z)", userNow, endTimeWrongUTC, allowedDurationSeconds)
}

func testScenario(name string, now time.Time, end time.Time, allowedDuration float64) {
	fmt.Printf("\n--- %s ---\n", name)
	fmt.Printf("End Time: %v\n", end)

	secondsUntilBatchEnd := end.Sub(now).Seconds()
	fmt.Printf("Seconds Until End: %f\n", secondsUntilBatchEnd)

	// Logic from attempt.go
	// remaining := math.Max(0, allowedDurationSeconds-elapsedSeconds)
	// elapsedSeconds is roughly Now - Start.
	// If Start is Now (just starting), elapsed is 0.

	initialRemaining := int(math.Max(0, math.Min(allowedDuration, secondsUntilBatchEnd)))
	fmt.Printf("Initial Remaining: %d\n", initialRemaining)
}
