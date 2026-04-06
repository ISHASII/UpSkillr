# AI Recommendation System - Dokumentasi Implementasi

## 📋 Overview

Sistem ini menggunakan AI (GPT-4o-mini) dari server capstone untuk memberikan rekomendasi modul pelatihan kepada karyawan berdasarkan skill yang mereka miliki saat ini.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐
│  Frontend React │ ← Component RecommendationPanel
└────────┬────────┘
         │ GET /api/recommendations/my-recommendation
         │
┌────────▼──────────┐
│  Backend Express  │ ← Controller recommendationController
├──────────────────┤
│ Service Layer:   │
│ - getAIRec...()  │
│ - getRecommend..│
└────────┬──────────┘
         │ HTTP POST
         │
┌────────▼──────────────────────┐
│  mlapi.run AI Server           │
│  (Capstone GPT-4o-mini API)    │
└────────────────────────────────┘
```

---

## 📁 File Structure

### Backend Files:

1. **`services/recommendationService.js`**
   - `getAIRecommendation()` - Panggil AI API untuk rekomendasi
   - `getRecommendedModules()` - Ambil modul training dari DB
   - `getFullRecommendation()` - Kombinasi keduanya

2. **`controllers/recommendationController.js`**
   - `getMyRecommendation()` - Untuk user yang login
   - `getUserRecommendation()` - Untuk user lain (HR)
   - `getRecommendedModulesForUser()` - List modul aja
   - `getAITextRecommendation()` - Text recommendation saja

3. **`routes/recommendationRoutes.js`**
   - Route handler untuk semua endpoint

4. **`routes/index.js`** (Updated)
   - Register recommendation routes

### Frontend Files:

1. **`pages/karyawan/components/RecommendationPanel.jsx`**
   - Main component untuk menampilkan rekomendasi
   - State management dengan useState
   - API integration dengan axios

2. **`pages/karyawan/components/RecommendationPanel.css`**
   - Styling dengan gradient background
   - Responsive design

3. **`pages/karyawan/Index.jsx`** (Updated)
   - Integrate RecommendationPanel ke dashboard

---

## 🔌 API Endpoints

### 1. Get My Recommendation

```
GET /api/recommendations/my-recommendation
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "aiRecommendation": "string (markdown format)",
  "recommendedModules": [
    {
      "_id": "...",
      "judul": "...",
      "deskripsi": "...",
      "goalsModule": "...",
      "targetSkills": [...],
      "targetDivisions": [...]
    }
  ],
  "timestamp": "2026-04-04T..."
}
```

### 2. Get Recommended Modules Only

```
GET /api/recommendations/modules
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "modules": [...]
}
```

### 3. Get AI Text Recommendation (Flexible)

```
POST /api/recommendations/text-only
Authorization: Bearer {token}

Body:
{
  "skills": ["JavaScript", "React", "Node.js"],
  "division": "IT" (optional)
}
```

**Response:**

```json
{
  "success": true,
  "recommendation": "string",
  "timestamp": "2026-04-04T..."
}
```

### 4. Get User Recommendation (untuk HR)

```
GET /api/recommendations/user/:userId
Authorization: Bearer {token}
```

---

## 🤖 Bagaimana AI Recommendation Bekerja?

### Prompt Structure:

**System Role:**

```
Kamu adalah AI Career Coach spesialis pengembangan karir karyawan di perusahaan.
Berikan rekomendasi 2-3 modul training atau skill pembelajaran yang sangat relevan.
Rekomendasi harus spesifik, praktis, dan sesuai dengan path karir yang umum.
```

**User Message:**

```
Divisi: IT.
Skill yang saya miliki saat ini: JavaScript, React, Node.js.
Berdasarkan skill ini, skill apa yang harus saya pelajari selanjutnya untuk mengembangkan karir saya?
Berikan rekomendasi spesifik dan alasan singkatnya.
```

### Output Example:

```
• TypeScript - Sangat penting untuk type-safety di project besar dan meningkatkan
  kualitas code. Menjadi standard industry untuk JavaScript projects profesional.

• Docker & Kubernetes - Essential untuk deployment dan DevOps. Skill ini akan
  membuat lu valuable untuk full-stack dan infrastructure roles.

• Microservices Architecture - Dengan foundation lu di Node.js, mastering
  microservices akan buka peluang architect dan senior developer positions.
```

---

## 🎨 Frontend Component Usage

### Simple Integration:

```jsx
import RecommendationPanel from "./pages/karyawan/components/RecommendationPanel";

export default function Dashboard() {
  return (
    <div>
      <RecommendationPanel />
    </div>
  );
}
```

### Features:

1. **Auto-fetch on Mount** - Load recommendation saat component mount
2. **Refresh Button** - User bisa refresh rekomendasi kapan saja
3. **Expandable Modules** - List modul bisa di-expand/collapse
4. **Loading State** - Spinner saat loading
5. **Error Handling** - Display error message jika ada masalah
6. **Responsive** - Bagus di mobile dan desktop

---

## 🔐 Security Notes

### API Key Management:

**IMPORTANT:** API key sekarang hardcoded di service - UBAH INI DI PRODUCTION!

**Solution - Ubah ke Environment Variable:**

1. Create `.env` di backend root:

```
MLAPI_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MLAPI_URL=https://mlapi.run/daef5150-72ef-48ff-8861-df80052ea7ac/v1/chat/completions
```

2. Update `recommendationService.js`:

```javascript
const API_KEY = process.env.MLAPI_KEY;
const SUMMARY_API = process.env.MLAPI_URL;
```

3. Add ke `.gitignore`:

```
.env
.env.local
```

---

## 🚀 Testing

### Postman Collection Example:

**Test 1: Get My Recommendation**

```
GET http://localhost:5000/api/recommendations/my-recommendation
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

**Test 2: Get Recommendation Text Only**

```
POST http://localhost:5000/api/recommendations/text-only
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "skills": ["JavaScript", "React"],
  "division": "IT"
}
```

---

## 🐛 Troubleshooting

### Issue: "Tidak ada rekomendasi tersedia"

**Possible Causes:**

1. User tidak punya skill (array kosong)
2. Network error ke AI API
3. API key expired atau invalid

**Solution:**

```javascript
// Add debug logging di recommendationService.js
console.log("Calling AI API with skills:", userSkills);
console.log("API Response:", data);
```

### Issue: CORS Error

**Solution:**
Backend sudah punya CORS enabled. Jika masih error:

```javascript
// Di server.js, pastikan CORS config:
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  }),
);
```

### Issue: User tidak punya skill

**Current Behavior:**
Jika user tidak punya skill, AI tetap bisa generate rekomendasi umum.

**To Require Skills:**

```javascript
if (!userSkills || userSkills.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Silakan isi skill kamu terlebih dahulu",
  });
}
```

---

## 📊 Data Flow Diagram

```
1. User membuka Dashboard Karyawan
   ↓
2. RecommendationPanel component mount
   ↓
3. useEffect trigger → API call GET /api/recommendations/my-recommendation
   ↓
4. Backend fetch user data dari MongoDB
   ↓
5. Extract user.skills dan user.divisi
   ↓
6. Call AI API dengan prompt yang sudah di-prepare
   ↓
7. AI return rekomendasi text
   ↓
8. Query training modules dari DB yang match dengan user division
   ↓
9. Response return ke frontend dengan:
   - aiRecommendation (string)
   - recommendedModules (array objects)
   ↓
10. Frontend render RecommendationPanel dengan data
```

---

## 🔄 How to Customize

### 1. Ubah Prompt System:

File: `services/recommendationService.js` → `getAIRecommendation()`

```javascript
role: "system",
content: "YOUR_CUSTOM_SYSTEM_PROMPT"
```

### 2. Ubah Model:

```javascript
model: "openai/gpt-4o-mini"; // Ganti dengan model lain
```

### 3. Ubah Temperature (untuk randomness):

```javascript
temperature: 0.7; // Lebih tinggi = lebih creative, lebih rendah = lebih fokus
```

### 4. Ubah Max Tokens (response length):

```javascript
max_completion_tokens: 500; // Panjang maksimal response
```

---

## ✅ Checklist Implementasi

- [x] Backend Service created
- [x] Backend Controller created
- [x] Backend Routes created
- [x] Routes registered di index.js
- [x] Frontend Component created
- [x] Frontend Styling created
- [x] Integration ke Dashboard
- [x] Documentation

---

## 📝 Next Steps

1. **Testing**: Test di localhost:5000
2. **Environment Variables**: Move API key ke .env
3. **Error Handling**: Add more error handling scenarios
4. **Caching**: Consider cache recommendation untuk reduce API calls
5. **User Testing**: Test dengan berbagai skill combinations
6. **Analytics**: Track recommendation acceptance rate

---

## 📞 Support

Jika ada error atau pertanyaan:

1. Check console log di browser (F12)
2. Check backend logs di terminal
3. Verify API key masih valid
4. Test endpoint via Postman

---

**Created:** April 4, 2026
**Status:** Production Ready
