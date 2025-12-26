<div align="center">
  <h1>🎓 Academic Suite (LMS)</h1>
  
  <p>
    <b>High-Stakes Examination Platform built with Golang & React.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Built_in-5_Days-orange?style=for-the-badge&logo=clock" alt="Built in 5 Days" />
    <img src="https://img.shields.io/badge/Workflow-AI--Augmented-blueviolet?style=for-the-badge&logo=openai" alt="AI Augmented" />
    <img src="https://img.shields.io/badge/Status-Open_Source-green?style=for-the-badge&logo=github" alt="Open Source" />
    <img src="https://img.shields.io/badge/Status-Open_Source-green?style=for-the-badge&logo=github" alt="Open Source" />
  </p>

  <p>
    Architected & Managed by <b>Insight 105</b>.<br/>
    <i>Shipping production-grade software at AI speed.</i>
  </p>

  <a href="https://academic-suite.netlify.app">🌐 <b>Live Demo</b></a> •
  <a href="https://insight105.hashnode.dev">📚 <b>Read the Book</b></a> •
  <a href="https://youtube.com/@insight105">📺 <b>Watch the Story</b></a>
</div>

<br />

**Academic Suite** is a modern, fullstack Learning Management System (LMS) designed for high-stakes examinations. It is built to be resilient, secure, and scalable, featuring a robust exam engine, real-time monitoring, and comprehensive analytical reporting.

This repository contains the complete source code and accompanying documentation book.

## 🚀 Features

*   **Robust Exam Engine**: State machine-based logic with server-side time authority.
*   **Anti-Cheating Mechanisms**: Secure timers, focus tracking, and client-side friction.
*   **Real-time Monitoring**: Teacher dashboard for live student status tracking.
*   **Data Integrity**: Idempotent answer saving and crash recovery.
*   **Role-Based Access Control (RBAC)**: Distinct roles for Admins, Teachers, and Students.
*   **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui.

## 🛠 Technology Stack

### Backend
*   **Language**: Go (Golang)
*   **Framework**: Fiber v2 (Fast HTTP web framework)
*   **Database**: PostgreSQL
*   **ORM**: GORM
*   **Auth**: JWT (JSON Web Tokens)

### Frontend
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **State Management**: Zustand (Global), TanStack Query (Server)
*   **Styling**: Tailwind CSS, shadcn/ui

## 📂 Project Structure

*   `backend/`: Golang API source code.
*   `frontend/`: React application source code.
*   `book/`:
    *   `id/`: The original Indonesian book "Membangun Academic Suite".
    *   `en/`: The translated English version "Building Academic Suite".
    *   Contains full documentation on the system's architecture and implementation.

---

## 🐳 Quick Start (Docker)

The easiest way to run the application is using Docker.

1.  **Prerequisites**: Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.
2.  **Run**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Access**:
    *   **Frontend**: [http://localhost:8080](http://localhost:8080)
    *   **Backend API**: [http://localhost:8060](http://localhost:8060)
    *   **Swagger Docs**: [http://localhost:8060/swagger/](http://localhost:8060/swagger/)

To stop the application:
```bash
docker-compose down
```

---

## 💻 Manual Setup (Without Docker)

If you prefer to run the components individually:

### 1. Database Setup
*   Ensure **PostgreSQL** is running.
*   Create a user `postgres` with password `Password.1`.
*   Create a database named `academic_suite`.
*   *(Alternatively, update `backend/config.yml` with your own credentials)*.

### 2. Backend Setup
```bash
cd backend
go mod download
go run main.go
```
*   The server will start on port `8060`.
*   It will automatically migrate the schema and seed dummy data.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*   The application will be available at `http://localhost:5173`.

---

## 🔑 Default Accounts (Seeded Data)

The system comes pre-seeded with the following accounts for testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eduexam.com` | `admin123` |
| **Teacher** | `guru@eduexam.com` | `guru123` |
| **Student** | `siswa@eduexam.com` | `siswa123` |

*Note: There are also 1000 generated dummy student accounts (`student-dummy-1@eduexam.com`, etc.) for load testing.*

## 📚 Documentation & Book

For a deep dive into how this system was built, refer to the **book** included in this repository.

*   **PDF Location**: `book/en/Academic-Suite.pdf` (English) or `book/id/Academic-Suite.pdf` (Indonesian).
*   **Topics Covered**:
    *   Database Design & ERD
    *   Authentication Strategy
    *   Exam State Machine
    *   React Architecture & Performance
    *   Anti-Cheating Implementation

---

## 🤝 Support & Connect

Maintained by **Insight 105**. I share tutorials on Software Architecture, .NET, Go, and AI Engineering.

If you find this project useful, please consider giving it a ⭐ **Star** or supporting via:

<div align="left">
  <a href="https://saweria.co/insight105">
    <img src="https://img.shields.io/badge/Traktir_Kopi-Saweria-orange?style=for-the-badge&logo=ko-fi" alt="Saweria" />
  </a>
  
  <a href="https://insight105.hashnode.dev">
    <img src="https://img.shields.io/badge/Read_My_Blog-Hashnode-blue?style=for-the-badge&logo=hashnode" alt="Hashnode" />
  </a>

  <a href="https://youtube.com/@insight105">
    <img src="https://img.shields.io/badge/Subscribe-YouTube-red?style=for-the-badge&logo=youtube" alt="YouTube" />
  </a>
</div>

---

<p align="center">
  Made with ❤️ and 🤖 by <a href="https://github.com/insight105">Insight 105</a>
</p>

**Happy Coding! 🚀**
