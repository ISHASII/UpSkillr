# Backend API - Employee Skill Matcher & Training Hub

## 1) Persiapan

Pastikan sudah install:

- Node.js (disarankan v18+)
- MongoDB lokal (service aktif / `mongod` berjalan)

## 2) Jalankan Backend (copy-paste)

Buka terminal di folder `backend`, lalu jalankan berurutan:

```powershell
cd C:\Users\ilham\Documents\Hrd-Track\backend
npm install
Copy-Item .env.example .env
node server.js
```

Kalau berhasil, akan muncul log server running dan MongoDB terhubung.

## 3) Endpoint Ringkas

Base URL:

```text
http://localhost:5000
```

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Modules (Role-based)

- `GET /api/modules` → HR, Karyawan
- `POST /api/modules` → HR
- `PUT /api/modules/:id` → HR
- `DELETE /api/modules/:id` → HR

### Logs (Role-based)

- `GET /api/logs` → HR
- `POST /api/logs` → Karyawan
- `PUT /api/logs/:id` (status harus `Selesai`) → Karyawan

### User

- `PUT /api/users/profile` (update skills sendiri) → Karyawan

## 4) Dokumentasi Testing Postman (Method + URL + Body)

Base URL:

```text
http://localhost:5000
```

Gunakan 2 file Postman ini:

- Collection: `postman/Employee-Skill-Matcher-Training-Hub.postman_collection.json`
- Environment: `postman/local.postman_environment.json`

### 4.1 Cara umum kirim request di Postman

1. Klik **New Request**.
2. Pilih method (GET/POST/PUT/DELETE).
3. Isi URL endpoint.
4. Jika butuh body: tab **Body** → pilih **raw** → **JSON**.
5. Jika butuh token: tab **Headers** tambahkan:
   - Key: `Authorization`
   - Value: `Bearer <token>`

---

### 4.2 Auth - Register

Daftarkan pengguna baru (HR atau Karyawan):

```text
POST http://localhost:5000/api/auth/register
```

Body (JSON) contoh HR:

```json
{
  "nama": "Admin HR",
  "email": "hr@example.com",
  "password": "password123",
  "role": "HR",
  "divisi": "Human Resource",
  "skills": ["Leadership", "Recruitment"]
}
```

Body (JSON) contoh Karyawan:

```json
{
  "nama": "Karyawan Satu",
  "email": "karyawan@example.com",
  "password": "password123",
  "role": "Karyawan",
  "divisi": "Engineering",
  "skills": ["Node.js", "MongoDB"]
}
```

Respon sukses: status `201`, berisi `token` dan `user`.

---

### 4.3 Auth - Login

Login user:

```text
POST http://localhost:5000/api/auth/login
```

Body (JSON):

```json
{
  "email": "hr@example.com",
  "password": "password123"
}
```

Respon sukses: status `200`, berisi `data.token` dan `data.user`.

Simpan token ini untuk endpoint yang dilindungi.

---

### 4.4 Modules - GET (HR & Karyawan)

Lihat semua modul:

```text
GET http://localhost:5000/api/modules
```

Header wajib:

```text
Authorization: Bearer <token_hr_atau_karyawan>
```

---

### 4.5 Modules - POST (Hanya HR)

Buat modul baru:

```text
POST http://localhost:5000/api/modules
```

Header wajib:

```text
Authorization: Bearer <token_hr>
```

Body (JSON):

```json
{
  "judul": "Advanced Node.js",
  "deskripsi": "Pendalaman Node.js untuk backend engineer",
  "linkMateri": "https://example.com/node-advanced",
  "targetSkills": ["Node.js", "System Design"]
}
```

Respon sukses berisi data modul. Simpan nilai `data._id` sebagai `moduleId`.

---

### 4.6 Modules - PUT (Hanya HR)

Edit modul:

```text
PUT http://localhost:5000/api/modules/MODULE_ID
```

Contoh real URL:

```text
PUT http://localhost:5000/api/modules/67d9b2f31f02b2460b40f9ac
```

Header wajib:

```text
Authorization: Bearer <token_hr>
```

Body (JSON) contoh:

```json
{
  "judul": "Advanced Node.js Updated",
  "deskripsi": "Materi terbaru backend engineer"
}
```

---

### 4.7 Modules - DELETE (Hanya HR)

Hapus modul:

```text
DELETE http://localhost:5000/api/modules/MODULE_ID
```

Header wajib:

```text
Authorization: Bearer <token_hr>
```

---

### 4.8 Users Profile - PUT (Hanya Karyawan)

Update skills profile user login:

```text
PUT http://localhost:5000/api/users/profile
```

Header wajib:

```text
Authorization: Bearer <token_karyawan>
```

Body (JSON):

```json
{
  "skills": ["Node.js", "MongoDB", "Express.js"]
}
```

---

### 4.9 Logs - POST (Hanya Karyawan)

Buat progress log (mulai training):

```text
POST http://localhost:5000/api/logs
```

Header wajib:

```text
Authorization: Bearer <token_karyawan>
```

Body (JSON):

```json
{
  "module_id": "MODULE_ID"
}
```

Contoh:

```json
{
  "module_id": "67d9b2f31f02b2460b40f9ac"
}
```

Respon sukses berisi data log. Simpan `data._id` sebagai `logId`.

---

### 4.10 Logs - PUT (Hanya Karyawan)

Update status log menjadi selesai:

```text
PUT http://localhost:5000/api/logs/LOG_ID
```

Header wajib:

```text
Authorization: Bearer <token_karyawan>
```

Body (JSON) wajib:

```json
{
  "status": "Selesai"
}
```

Catatan: endpoint ini hanya menerima nilai status `Selesai`.

---

### 4.11 Logs - GET (Hanya HR)

Lihat semua progress log karyawan:

```text
GET http://localhost:5000/api/logs
```

Header wajib:

```text
Authorization: Bearer <token_hr>
```

---

### 4.12 Urutan testing yang direkomendasikan

1. `POST /api/auth/register` (HR)
2. `POST /api/auth/register` (Karyawan)
3. `POST /api/auth/login` (HR) → simpan token HR
4. `POST /api/auth/login` (Karyawan) → simpan token Karyawan
5. `POST /api/modules` (HR) → simpan `moduleId`
6. `GET /api/modules` (Karyawan)
7. `PUT /api/users/profile` (Karyawan)
8. `POST /api/logs` (Karyawan) → simpan `logId`
9. `PUT /api/logs/:id` (Karyawan, status `Selesai`)
10. `GET /api/logs` (HR)

### 4.13 Error yang paling sering muncul

- `401 Token tidak ditemukan` → header `Authorization` belum dikirim.
- `403 Forbidden` → role token tidak punya akses endpoint itu.
- `404` saat PUT/DELETE by id → ID salah / data sudah tidak ada.
- `400` saat update log → body harus `{ "status": "Selesai" }`.

## 5) Test Lengkap via PowerShell (copy-paste)

> Jalankan perintah ini di terminal baru saat server sudah hidup.

### 5.1 Set base URL

```powershell
$baseUrl = "http://localhost:5000"
```

### 5.2 Register HR

```powershell
$registerHrBody = @{
  nama = "Admin HR"
  email = "hr@example.com"
  password = "password123"
  role = "HR"
  divisi = "Human Resource"
  skills = @("Leadership", "Recruitment")
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$baseUrl/api/auth/register" -ContentType "application/json" -Body $registerHrBody
```

### 5.3 Register Karyawan

```powershell
$registerKaryawanBody = @{
  nama = "Karyawan Satu"
  email = "karyawan@example.com"
  password = "password123"
  role = "Karyawan"
  divisi = "Engineering"
  skills = @("Node.js", "MongoDB")
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$baseUrl/api/auth/register" -ContentType "application/json" -Body $registerKaryawanBody
```

### 5.4 Login HR & simpan token

```powershell
$loginHrBody = @{
  email = "hr@example.com"
  password = "password123"
} | ConvertTo-Json

$loginHr = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/auth/login" -ContentType "application/json" -Body $loginHrBody
$hrToken = $loginHr.data.token
$hrHeaders = @{ Authorization = "Bearer $hrToken" }

$hrToken
```

### 5.5 Login Karyawan & simpan token

```powershell
$loginKaryawanBody = @{
  email = "karyawan@example.com"
  password = "password123"
} | ConvertTo-Json

$loginKaryawan = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/auth/login" -ContentType "application/json" -Body $loginKaryawanBody
$karyawanToken = $loginKaryawan.data.token
$karyawanHeaders = @{ Authorization = "Bearer $karyawanToken" }

$karyawanToken
```

### 5.6 HR buat module

```powershell
$createModuleBody = @{
  judul = "Advanced Node.js"
  deskripsi = "Pendalaman Node.js untuk backend engineer"
  linkMateri = "https://example.com/node-advanced"
  targetSkills = @("Node.js", "System Design")
} | ConvertTo-Json -Depth 5

$moduleRes = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/modules" -Headers $hrHeaders -ContentType "application/json" -Body $createModuleBody
$moduleId = $moduleRes.data._id

$moduleId
```

### 5.7 HR/Karyawan lihat semua module

```powershell
Invoke-RestMethod -Method GET -Uri "$baseUrl/api/modules" -Headers $karyawanHeaders
```

### 5.8 Karyawan update profile skills

```powershell
$updateProfileBody = @{
  skills = @("Node.js", "MongoDB", "Express.js")
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method PUT -Uri "$baseUrl/api/users/profile" -Headers $karyawanHeaders -ContentType "application/json" -Body $updateProfileBody
```

### 5.9 Karyawan buat log (mulai training)

```powershell
$createLogBody = @{
  module_id = $moduleId
} | ConvertTo-Json

$logRes = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/logs" -Headers $karyawanHeaders -ContentType "application/json" -Body $createLogBody
$logId = $logRes.data._id

$logId
```

### 5.10 Karyawan update status log jadi Selesai

```powershell
$updateLogBody = @{
  status = "Selesai"
} | ConvertTo-Json

Invoke-RestMethod -Method PUT -Uri "$baseUrl/api/logs/$logId" -Headers $karyawanHeaders -ContentType "application/json" -Body $updateLogBody
```

### 5.11 HR lihat semua log

```powershell
Invoke-RestMethod -Method GET -Uri "$baseUrl/api/logs" -Headers $hrHeaders
```

## 6) Contoh Error Umum

- `401 Token tidak ditemukan` → header `Authorization: Bearer <token>` belum dikirim.
- `403 Forbidden` → role tidak sesuai endpoint.
- `400 status hanya boleh Selesai` → endpoint update log karyawan hanya menerima `status: "Selesai"`.
- `409 Email sudah terdaftar` → email user sudah pernah register.

## 7) Catatan Penting

- Untuk endpoint yang butuh role, **wajib login dulu**.
- Password disimpan dalam bentuk hash (`bcrypt`).
- JWT secret sebaiknya diganti di file `.env` sebelum dipakai di production.
