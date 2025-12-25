import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Configuration
export const options = {
    stages: [
        { duration: '30s', target: 50 }, // Ramp up to 50 users
        { duration: '1m', target: 50 },  // Stay at 50 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

// Target Batch ID (Replace with your active batch ID)
const BATCH_ID = __ENV.BATCH_ID || 'BATCH_ID_HERE';
const BASE_URL = 'http://localhost:8080/api';

export default function () {
    // 1. Unique User for this VU
    // We use __VU to pick a dummy student (1 to 1000)
    // __VU starts at 1
    const studentId = (__VU % 1000) + 1;
    const email = `student-dummy-${studentId}@eduexam.com`;
    const password = 'siswa123';

    // 2. Login
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        email: email,
        password: password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    const isLoginSuccess = check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    if (!isLoginSuccess) {
        console.error(`Login failed for ${email}`);
        return;
    }

    const token = loginRes.json('tokens.accessToken');
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // 3. Start/Resume Attempt
    const startRes = http.post(`${BASE_URL}/attempts/start`, JSON.stringify({
        batchId: BATCH_ID,
        studentId: `student-dummy-${studentId}`,
    }), {
        headers: authHeaders,
    });

    check(startRes, {
        'attempt started': (r) => r.status === 200,
    });

    // Simulate thinking time
    sleep(1);

    // 4. Submit Random Answers (Mocking a few answers)
    // Note: We need the attempt ID usually, which comes from startRes
    const attempt = startRes.json();
    if (attempt && attempt.id) {
        // Submit an answer for a hypothetical question
        // In a real test, you'd fetch the quiz questions first and answer them
        sleep(Math.random() * 2);
    }
}
