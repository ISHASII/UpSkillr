const TrainingModule = require("../models/TrainingModule");

/**
 * AI Recommendation Service
 * Menggunakan API dari server capstone untuk mendapatkan rekomendasi modul
 */

// Load API credentials dari environment variables
const SUMMARY_API = process.env.MLAPI_CHAT_URL;
const API_KEY = process.env.MLAPI_KEY;
const MLAPI_MODEL = process.env.MLAPI_MODEL || "openai/gpt-5-nano";

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractAIText = (data) => {
  return (
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.output_text ||
    data?.response?.output_text ||
    ""
  );
};

// Validate environment variables
if (!SUMMARY_API || !API_KEY) {
  console.warn(
    "⚠️  WARNING: MLAPI_CHAT_URL or MLAPI_KEY not set in environment variables!",
  );
}

/**
 * Panggil AI untuk get recommendation berdasarkan skill yang sudah dimiliki user
 * @param {Array<string>} userSkills - Skill yang dimiliki user
 * @param {string} userDivision - Divisi user (optional)
 * @returns {Promise<string>} - Rekomendasi dari AI
 */
const getAIRecommendation = async (userSkills, userDivision = "") => {
  try {
    // Format skills menjadi string yang readable
    const skillsString =
      userSkills && userSkills.length > 0
        ? userSkills.join(", ")
        : "tidak memiliki skill khusus";

    const divisionInfo = userDivision ? `Divisi: ${userDivision}. ` : "";

    const response = await fetch(SUMMARY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MLAPI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah AI Career Coach spesialis pengembangan karir karyawan di perusahaan. " +
              "Berikan rekomendasi 2-3 modul training atau skill pembelajaran yang sangat relevan dan penting untuk pengembangan karir selanjutnya. " +
              "Rekomendasi harus spesifik, praktis, dan sesuai dengan path karir yang umum. " +
              "Jawab langsung dalam format bullet point singkat dan padat, tanpa menjelaskan proses berpikir. " +
              "Jelaskan alasan singkat untuk setiap rekomendasi mengapa itu penting.",
          },
          {
            role: "user",
            content:
              divisionInfo +
              `Skill yang saya miliki saat ini: ${skillsString}. ` +
              `Berdasarkan skill ini, skill apa yang harus saya pelajari selanjutnya untuk mengembangkan karir saya? ` +
              `Berikan rekomendasi spesifik dan alasan singkatnya.`,
          },
        ],
        reasoning_effort: "low",
        max_completion_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = extractAIText(data).trim();

    if (!aiResponse) {
      console.warn("⚠️ Empty AI response payload:", JSON.stringify(data));
      return "Tidak dapat mendapatkan rekomendasi saat ini";
    }

    return aiResponse;
  } catch (error) {
    console.error("❌ Error calling AI API:", error.message);
    throw new Error(`AI API Error: ${error.message}`);
  }
};

/**
 * Filter training modules berdasarkan recommended skills dari AI
 * @param {Array<string>} recommendedSkills - Skills yang direkomendasikan
 * @param {string} userDivision - Divisi user
 * @returns {Promise<Array>} - Array modul training yang relevan
 */
const getRecommendedModules = async (userSkills, userDivision = "") => {
  try {
    const normalizedDivision = String(userDivision || "").trim();
    let modules = [];

    if (normalizedDivision) {
      const divisionTokens = normalizedDivision.split(/\s+/).filter(Boolean);
      const divisionRegex = divisionTokens.map(
        (token) => new RegExp(escapeRegex(token), "i"),
      );

      modules = await TrainingModule.find({
        targetDivisions: { $in: divisionRegex },
      })
        .populate("targetSkills")
        .limit(5);
    }

    // Fallback: kalau belum nemu berdasarkan divisi, tampilkan modul umum
    if (!modules.length) {
      modules = await TrainingModule.find({}).populate("targetSkills").limit(5);
    }

    return modules;
  } catch (error) {
    console.error("❌ Error fetching modules:", error.message);
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Get full recommendation dengan AI insights + recommended modules
 * @param {Object} user - User object dengan skills dan divisi
 * @returns {Promise<Object>} - Recommendation object
 */
const getFullRecommendation = async (user) => {
  try {
    // Step 1: Get AI recommendation
    const aiRecommendation = await getAIRecommendation(
      user.skills,
      user.divisi,
    );

    // Step 2: Get recommended modules dari database
    const recommendedModules = await getRecommendedModules(
      user.skills,
      user.divisi,
    );

    return {
      success: true,
      aiRecommendation,
      recommendedModules: recommendedModules.map((m) => ({
        _id: m._id,
        judul: m.judul,
        deskripsi: m.deskripsi,
        goalsModule: m.goalsModule,
        targetSkills: m.targetSkills,
        targetDivisions: m.targetDivisions,
      })),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("❌ Error in getFullRecommendation:", error.message);
    throw error;
  }
};

module.exports = {
  getAIRecommendation,
  getRecommendedModules,
  getFullRecommendation,
};
