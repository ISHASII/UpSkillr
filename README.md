# UpSkillr - Employee Skill Matcher & Training Hub

UpSkillr adalah platform internal untuk mengelola pengembangan skill karyawan: mulai dari registrasi user, approval karyawan oleh HR, manajemen skill dan modul training, tracking progress pembelajaran, sampai AI recommendation untuk next skill/module.

## Fitur Utama

- Authentication: register, login, login Google, forgot password OTP
- Role-based access:
  - `HR`: kelola user, skill, modul, validasi progress
  - `Karyawan`: update skill profile, submit progress, lihat rekomendasi
- Skill management (CRUD)
- Training module management (CRUD)
- Progress log & validation workflow
- AI recommendation untuk text rekomendasi + modul relevan
- Dokumentasi API via Swagger

## Arsitektur Teknologi

### 1) Frontend

- Framework: React 19 + Vite
- Routing: `react-router-dom`
- HTTP client: `axios`
- UI: custom CSS components (termasuk panel rekomendasi AI)

### 2) Backend

- Runtime: Node.js (CommonJS)
- Framework: Express 5
- Database: MongoDB + Mongoose
- Auth: JWT + Google Auth (`google-auth-library`)
- Upload: `multer`
- Email OTP: `nodemailer`
- API docs: `swagger-ui-express` + `swagger-jsdoc`

### 3) High-Level Flow

1. Frontend mengirim request ke backend (`/api/...`) menggunakan JWT bearer token.
2. Backend validasi auth + role middleware.
3. Backend akses MongoDB via model Mongoose.
4. Untuk rekomendasi AI, backend memanggil layanan AI external via `MLAPI_CHAT_URL`.
5. Response dikembalikan ke frontend untuk ditampilkan di dashboard.

## Struktur Folder (Ringkas)

```text
Hrd-Track/
  backend/
    controllers/
    middlewares/
    models/
    routes/
    services/
    docs/swagger.js
    server.js
  frontend/
    src/
      pages/
      components/
      services/api.js
```

## Cara Menjalankan Project (Dari Git Clone)

## 1. Clone repository

```bash
git clone https://github.com/ISHASII/UpSkillr.git
cd UpSkillr
```

Jika nama folder lokal kamu `Hrd-Track`, cukup masuk ke folder itu.

## 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` dari `.env.example`:

```bash
cp .env.example .env
```

Untuk Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Contoh env minimal backend:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/upskillr
JWT_SECRET=dev_jwt_secret_change_me
JWT_EXPIRES_IN=1d

# AI Recommendation
MLAPI_CHAT_URL=your_ml_api_chat_url
MLAPI_KEY=your_ml_api_key
MLAPI_MODEL=openai/gpt-5-nano

# Google Auth
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

Jalankan backend:

```bash
npm start
```

Backend aktif di: `http://localhost:5000`

## 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
```

Buat file `.env` di folder frontend:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

Jalankan frontend:

```bash
npm run dev
```

Frontend aktif di URL dari Vite (umumnya `http://localhost:5173`).

## 4. Jalankan Sekaligus (opsional)

- Terminal 1: `backend` -> `npm start`
- Terminal 2: `frontend` -> `npm run dev`

## Swagger API Documentation

Swagger sudah terintegrasi di backend.

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

### Cara Pakai Swagger

1. Jalankan backend terlebih dahulu.
2. Buka `http://localhost:5000/api-docs`.
3. Untuk endpoint protected, klik tombol **Authorize** (kanan atas).
4. Masukkan JWT token di field bearer auth.
5. Coba endpoint langsung dari Swagger UI.

## Endpoint Group di Swagger

- `System`: health check
- `Auth`: register, login, google login, forgot password OTP
- `Users`: CRUD user, pending registration, approval decision, update profile skills
- `Skills`: CRUD skill
- `Training Modules`: CRUD modul + rekomendasi modul untuk karyawan
- `Progress Logs`: create, submit, validate, listing progress
- `Recommendations`: AI recommendation text + module recommendation

## Base URL API

Semua endpoint utama ada di bawah prefix:

```text
http://localhost:5000/api
```

Contoh:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/recommendations/my-recommendation`

## Dokumentasi Tambahan

- Backend notes: `backend/README.md`
- Postman collection: `backend/postman/Employee-Skill-Matcher-Training-Hub.postman_collection.json`
- Postman env: `backend/postman/local.postman_environment.json`

## Troubleshooting Singkat

- `Route tidak ditemukan`: pastikan backend restart setelah perubahan route.
- `401 Unauthorized`: pastikan JWT valid dan dikirim sebagai `Authorization: Bearer <token>`.
- `AI API Error`: cek `MLAPI_CHAT_URL`, `MLAPI_KEY`, dan `MLAPI_MODEL` di `.env` backend.
- Frontend tidak connect backend: cek `VITE_API_URL` di `.env` frontend.
