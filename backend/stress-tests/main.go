package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

const (
	BaseURL = "http://127.0.0.1:8060/api"
)

var (
	successCount  int64
	failCount     int64
	totalRequests int64
)

type LoginResponse struct {
	Tokens struct {
		AccessToken string `json:"accessToken"`
	} `json:"tokens"`
}

type AttemptResponse struct {
	ID string `json:"id"`
}

func main() {
	batchID := flag.String("batch", "", "Batch ID to test")
	concurrency := flag.Int("c", 50, "Number of concurrent users")
	flag.Parse()

	if *batchID == "" {
		log.Fatal("Please provide a batch ID using -batch flag")
	}

	log.Printf("Starting stress test on Batch: %s with %d concurrent users...", *batchID, *concurrency)

	var wg sync.WaitGroup
	start := time.Now()

	// Launch workers
	for i := 1; i <= *concurrency; i++ {
		wg.Add(1)
		// Use dummy students 1 to 1000 cyclically
		studentIdx := (i % 1000) + 1
		go func(idx int) {
			defer wg.Done()
			simulateUser(idx, *batchID)
		}(studentIdx)
	}

	wg.Wait()
	duration := time.Since(start)

	fmt.Println("\n--- Test Results ---")
	fmt.Printf("Time Taken: %v\n", duration)
	fmt.Printf("Total Users: %d\n", *concurrency)
	fmt.Printf("Successful Attempts: %d\n", successCount)
	fmt.Printf("Failed Attempts: %d\n", failCount)
	if duration.Seconds() > 0 {
		fmt.Printf("RPS estimates: %.2f req/s\n", float64(totalRequests)/duration.Seconds())
	}
}

func simulateUser(studentIdx int, batchID string) {
	//client := &http.Client{Timeout: 10 * time.Second}
	var client = &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        1000,
			MaxIdleConnsPerHost: 1000,
			IdleConnTimeout:     90 * time.Second,
		},
	}
	email := fmt.Sprintf("student-dummy-%d@eduexam.com", studentIdx)
	password := "siswa123"

	// 1. Login
	loginPayload := map[string]string{
		"email":    email,
		"password": password,
	}
	body, _ := json.Marshal(loginPayload)

	req, _ := http.NewRequest("POST", BaseURL+"/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	atomic.AddInt64(&totalRequests, 1)

	status := 0
	if resp != nil {
		status = resp.StatusCode
	}

	if err != nil || status != 200 {
		var respBody string
		if resp != nil && resp.Body != nil {
			b, _ := io.ReadAll(resp.Body)
			respBody = string(b)
		}
		log.Printf("Login failed for %s: Status %d, Error: %v, Body: %s", email, status, err, respBody)
		atomic.AddInt64(&failCount, 1)
		return
	}
	defer resp.Body.Close()

	var loginRes LoginResponse
	json.NewDecoder(resp.Body).Decode(&loginRes)
	token := loginRes.Tokens.AccessToken

	// 2. Start Attempt
	startPayload := map[string]string{
		"batchId":   batchID,
		"studentId": fmt.Sprintf("student-dummy-%d", studentIdx),
	}
	body, _ = json.Marshal(startPayload)

	req, _ = http.NewRequest("POST", BaseURL+"/attempts/start", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err = client.Do(req)
	atomic.AddInt64(&totalRequests, 1)

	status = 0
	if resp != nil {
		status = resp.StatusCode
	}

	if err != nil || status != 200 {
		var respBody string
		if resp != nil && resp.Body != nil {
			b, _ := io.ReadAll(resp.Body)
			respBody = string(b)
		}
		log.Printf("Start Attempt failed for %s: Status %d, Error: %v, Body: %s", email, status, err, respBody)
		atomic.AddInt64(&failCount, 1)
		return
	}
	defer resp.Body.Close()

	// 3. Simulate random "Thinking" and maybe submit an answer (optional)
	time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)

	atomic.AddInt64(&successCount, 1)
}
