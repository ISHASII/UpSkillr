# UpSkillr

Enterprise AI Web Solution untuk manajemen pengembangan skill karyawan, validasi progress pembelajaran, dan rekomendasi pelatihan berbasis AI.

## 1. Project Overview

UpSkillr adalah platform internal perusahaan (enterprise solution) yang membantu tim HR dan karyawan menjalankan siklus peningkatan kompetensi secara terstruktur.

Masalah yang diselesaikan:

- Data skill karyawan tersebar dan sulit ditindaklanjuti.
- Rekomendasi pelatihan sering manual dan tidak konsisten.
- Validasi progress belajar karyawan kurang terpantau.
- Proses approval registrasi karyawan belum rapi.

Nilai bisnis yang diberikan:

- HR bisa memetakan kebutuhan pengembangan SDM lebih cepat.
- Karyawan mendapatkan arah belajar yang lebih relevan.
- Perusahaan punya jejak pembelajaran yang terukur untuk keputusan talent development.

## 2. Goal and Objectives

### Goal

Membangun platform Employee Skill Matcher and Training Hub yang mampu mengelola data skill, modul pelatihan, serta progress pembelajaran secara end-to-end dengan dukungan AI recommendation.

### Objectives

- Menyediakan alur autentikasi dan otorisasi berbasis role (HR dan Karyawan).
- Memungkinkan CRUD data inti: user, skill, modul, dan progress log.
- Menyediakan approval registrasi karyawan oleh HR.
- Memberikan rekomendasi pembelajaran berbasis AI untuk meningkatkan user experience dan ketepatan keputusan belajar.
- Menyajikan dashboard internal yang responsif dan mudah dipahami.

## 3. Target Users (Persona)

### Persona 1: HR Admin

- Kebutuhan:
  - Melihat daftar user dan status registrasi.
  - Menyetujui atau menolak registrasi karyawan.
  - Mengelola data skill dan modul pelatihan.
  - Memantau dan memvalidasi progress belajar.
- Pain point:
  - Sulit memonitor pembelajaran lintas divisi tanpa sistem terpusat.

### Persona 2: Karyawan

- Kebutuhan:
  - Mendaftar akun dan menunggu persetujuan HR.
  - Melihat modul pelatihan yang relevan.
  - Mengirimkan progress/submission hasil belajar.
  - Mendapatkan rekomendasi skill atau modul berikutnya.
- Pain point:
  - Tidak tahu prioritas belajar yang paling tepat untuk karier.

## 4. Core Features

### A. Authentication and Authorization

- Register, login, dan login Google.
- Forgot password dengan OTP email.
- JWT-based authentication.
- Role-based authorization:
  - HR: full management.
  - Karyawan: akses area pembelajaran pribadi.

### B. CRUD and Operational Features

- User management (HR): create, read, update, delete user.
- Registration workflow (HR):
  - Lihat pending registration.
  - Approve/reject dengan status tracking.
- Skill management:
  - CRUD skill oleh HR.
- Training module management:
  - CRUD modul oleh HR.
  - Target skill, target division, materi link/file.
- Progress log:
  - Karyawan membuat progress per modul.
  - Karyawan submit bukti belajar.
  - HR validasi hasil belajar (lulus, revisi, menunggu validasi).

### C. AI-Based Feature (Real-World Value)

AI Recommendation Engine memberikan:

- Rekomendasi teks berbasis skill dan divisi karyawan.
- Saran modul pelatihan yang relevan dari database.
- Pengalaman belajar yang lebih personal dan actionable.

Manfaat nyata:

- Mengurangi trial-and-error pemilihan pelatihan.
- Membantu HR menyusun pengembangan kompetensi berbasis data.

## 5. Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google Auth Library
- Nodemailer
- Multer
- Swagger (swagger-jsdoc + swagger-ui-express)

### Frontend

- React (Vite)
- React Router DOM
- Axios
- SweetAlert2
- Custom CSS utility classes

### AI Integration

- External AI Chat API melalui variabel environment:
  - MLAPI_CHAT_URL
  - MLAPI_KEY
  - MLAPI_MODEL

## 6. Clean Architecture and Modular Structure

Struktur proyek dipisah jelas antara frontend dan backend, serta menggunakan pendekatan modular pada backend:

- controllers: menangani request-response logic.
- services: business logic utama.
- models: definisi skema database.
- routes: endpoint API per domain.
- middlewares: auth, role guard, error handler, upload.
- docs: dokumentasi Swagger.

Struktur utama:

```text
Hrd-Track/
  backend/
    config/
    controllers/
    docs/
    middlewares/
    models/
    routes/
    services/
    server.js
  frontend/
    src/
      components/
      pages/
      services/
      App.jsx
```

## 7. Database Design (Core Entities)

Minimal 4 model Mongoose telah diimplementasikan:

- User
- Skill
- TrainingModule
- ProgressLog

Relasi utama:

- Satu user dapat memiliki banyak progress log.
- Satu training module dapat diikuti banyak user (melalui progress log).
- Training module memiliki target skills (referensi ke Skill).

## 8. API Highlights

Base URL:

- http://localhost:5000/api

Contoh endpoint utama:

- Health check: GET /health
- Auth:
  - POST /auth/register
  - POST /auth/login
  - POST /auth/google
  - POST /auth/forgot-password/request-otp
  - POST /auth/forgot-password/verify-otp
  - POST /auth/forgot-password/reset
- Users:
  - GET /users
  - POST /users
  - PUT /users/:id
  - DELETE /users/:id
  - GET /users/registrations/pending
  - PUT /users/registrations/:id/decision
- Skills:
  - GET /skills
  - POST /skills
  - PUT /skills/:id
  - DELETE /skills/:id
- Modules:
  - GET /modules
  - POST /modules
  - PUT /modules/:id
  - DELETE /modules/:id
  - GET /modules/recommendations/me
- Logs:
  - GET /logs
  - GET /logs/me
  - GET /logs/module/:moduleId
  - POST /logs
  - PUT /logs/:id/submission
  - PUT /logs/:id/validation
- Recommendations:
  - GET /recommendations/my-recommendation
  - GET /recommendations/modules
  - POST /recommendations/text-only
  - GET /recommendations/user/:userId

Dokumentasi API:

- Swagger UI: http://localhost:5000/api-docs
- OpenAPI JSON: http://localhost:5000/api-docs.json

## 9. UI/UX Approach

Prinsip UI/UX yang diterapkan:

- Role-based navigation (menu berbeda untuk HR dan Karyawan).
- Form validation dan feedback interaktif menggunakan modal alert.
- Halaman auth dan dashboard dirancang responsif untuk desktop dan mobile.
- Informasi penting ditampilkan ringkas agar alur kerja internal cepat dipahami.

Catatan aksesibilitas dan usability:

- Label form jelas dan konsisten.
- Notifikasi error/sukses langsung ditampilkan.
- Pengguna diarahkan ulang saat token kedaluwarsa untuk menjaga keamanan sesi.

## 10. Project Requirement Mapping

Kesesuaian terhadap requirement inti:

- MERN + arsitektur modular: terpenuhi.
- Fitur AI bernilai nyata: terpenuhi (rekomendasi skill/modul).
- CRUD + authentication/authorization: terpenuhi.
- UI/UX intuitif dan responsif: terpenuhi.
- Git workflow untuk kolaborasi: diterapkan (branching dan merge flow).

## 11. Git Workflow

Workflow yang disarankan untuk tim:

- Gunakan branch utama:
  - main: branch stabil untuk rilis.
  - dev: integrasi fitur aktif.
- Setiap fitur dikerjakan di feature branch dari dev:
  - contoh: feature/ai-recommendation
- Lakukan pull request ke dev terlebih dahulu.
- Setelah lolos review, merge ke main untuk final delivery.

Best practice commit:

- Gunakan pesan commit yang jelas dan terukur.
- Pisahkan commit per unit perubahan agar mudah review.
- Hindari commit campuran antara refactor dan fitur baru.

## 12. Local Setup

### Prerequisites

- Node.js 18+
- MongoDB lokal

### Backend

```bash
cd backend
npm install
Copy-Item .env.example .env
npm start
```

Contoh environment minimum backend:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/upskillr
JWT_SECRET=dev_jwt_secret_change_me
JWT_EXPIRES_IN=1d

MLAPI_CHAT_URL=your_ml_api_chat_url
MLAPI_KEY=your_ml_api_key
MLAPI_MODEL=openai/gpt-5-nano

GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Contoh environment frontend:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

## 13. Demo Scenario for Presentation

Alur demo yang direkomendasikan saat presentasi:

- Register akun karyawan.
- Login HR, approve registrasi karyawan.
- HR membuat skill dan training module.
- Login sebagai karyawan, lihat modul rekomendasi.
- Karyawan submit progress.
- HR melakukan validasi progress.
- Tampilkan hasil AI recommendation untuk user.

## 14. End-to-End System Workflow (Register to Completion)

Berikut alur operasional lengkap sistem dari awal sampai akhir:

### A. Alur Karyawan (Standard Register/Login)

1. Karyawan membuka halaman auth dan melakukan registrasi akun.
2. Sistem menyimpan data user dengan role Karyawan dan status pending.
3. Karyawan mencoba login.
4. Jika status masih pending, sistem menahan akses dashboard dan menampilkan informasi menunggu persetujuan HR.
5. Setelah disetujui HR, karyawan login ulang.
6. Sistem mengeluarkan JWT token dan mengarahkan ke dashboard Karyawan.
7. Karyawan melengkapi atau update profil skill.
8. Karyawan melihat rekomendasi modul dan rekomendasi AI berdasarkan skill/divisi.
9. Karyawan memilih modul, membuat progress log, lalu mengirim submission link/file.
10. Status progress berubah menjadi menunggu validasi HR.
11. Karyawan menunggu hasil validasi:
    - jika lulus, proses modul selesai.
    - jika perlu revisi, karyawan memperbaiki submission lalu kirim ulang.

### B. Alur Karyawan (Google Login)

1. Karyawan login menggunakan Google.
2. Jika email belum ada di sistem, akun otomatis dibuat sebagai Karyawan dengan status pending.
3. Jika belum approved HR, akses dashboard tetap ditahan.
4. Setelah approved HR, login Google berikutnya akan langsung masuk ke dashboard.

### C. Alur HR dari Awal Sampai Akhir

1. HR login ke sistem.
2. HR membuka menu pending registrations.
3. HR memeriksa data pendaftar lalu memilih approve atau reject.
4. Sistem mengirim notifikasi email keputusan ke karyawan.
5. HR mengelola master data:
   - CRUD skill
   - CRUD training module (target skill, target divisi, materi)
6. HR memantau progress log seluruh karyawan.
7. HR melakukan validasi submission:
   - lulus jika memenuhi kriteria
   - perlu revisi jika belum sesuai
8. HR dapat melihat rekomendasi user untuk membantu coaching atau assignment modul berikutnya.

### D. Workflow Status Utama

- Registration status:
  - pending -> approved/rejected
- Progress status:
  - Sedang Berjalan -> Menunggu Validasi HR -> Lulus/Perlu Revisi

### E. End State Sistem

- Karyawan memiliki riwayat pembelajaran terstruktur dan terverifikasi.
- HR memiliki visibilitas perkembangan skill lintas divisi.
- Keputusan pengembangan kompetensi didukung AI recommendation dan data progress aktual.

## 15. PPT Outline (Ready-to-Use)

Kamu bisa langsung jadikan README ini ke slide dengan urutan berikut:

- Slide 1: Judul proyek dan elevator pitch UpSkillr.
- Slide 2: Latar belakang masalah dan kebutuhan enterprise.
- Slide 3: Goal, objectives, dan value bisnis.
- Slide 4: Persona pengguna (HR dan Karyawan).
- Slide 5: Fitur utama per role.
- Slide 6: Arsitektur sistem dan struktur modular.
- Slide 7: Tech stack (frontend, backend, database, AI).
- Slide 8: AI feature deep dive (cara kerja + manfaat).
- Slide 9: API dan database design.
- Slide 10: UI/UX approach dan flow utama user.
- Slide 11: Git workflow dan quality process.
- Slide 12: Timeline development + hasil akhir + next roadmap.

## 16. Optional Enhancements (Recommended Next Sprint)

Untuk memperkuat production readiness:

- Tambahkan automated testing (unit + integration + e2e).
- Tambahkan centralized state management (Context API atau Redux Toolkit).
- Tambahkan observability (request logging, monitoring, analytics dashboard).
- Tambahkan notification center real-time (email + in-app reminder).
- Tambahkan CI/CD pipeline (lint, test, build, deploy otomatis).
- Tambahkan role audit trail untuk compliance.

## 17. Conclusion

UpSkillr menunjukkan implementasi AI web solution yang relevan untuk kebutuhan enterprise internal:

- Secara teknis, memenuhi kebutuhan full-stack modular, auth, CRUD, dan AI integration.
- Secara praktis, memberi dampak langsung pada pengembangan skill karyawan dan efisiensi kerja HR.

Project ini siap dijadikan fondasi untuk pengembangan lanjutan ke level production.
