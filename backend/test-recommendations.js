#!/usr/bin/env node

/**
 * Test Script untuk AI Recommendation API
 * Navigate ke backend folder dan run: node test-recommendations.js
 */

const API_BASE_URL = "http://localhost:5000/api";

// Test credentials (ganti dengan user yang sudah ada)
const TEST_EMAIL = "testkaryawan@test.com";
const TEST_PASSWORD = "password123";

async function testHealthCheck() {
  console.log("\n🔍 TEST 1: Health Check");
  console.log("─".repeat(50));
  try {
    const response = await fetch("http://localhost:5000/api/health");
    const data = await response.json();
    console.log("✅ Status:", response.status);
    console.log("✅ Response:", data);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function loginUser() {
  console.log("\n🔍 TEST 2: User Login");
  console.log("─".repeat(50));
  console.log(`📧 Email: ${TEST_EMAIL}`);
  console.log(`🔑 Password: ${TEST_PASSWORD}`);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      console.log("✅ Login berhasil!");
      console.log("📝 User ID:", data.user._id);
      console.log("📝 User Name:", data.user.nama);
      console.log("📝 User Email:", data.user.email);
      console.log("📝 User Role:", data.user.role);
      console.log("📝 User Skills:", data.user.skills || []);
      console.log("📝 User Divisi:", data.user.divisi || "N/A");
      return data.token;
    } else {
      console.error("❌ Login gagal");
      console.error("Response:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

async function testRecommendationAPI(token) {
  console.log("\n🔍 TEST 3: Get AI Recommendation");
  console.log("─".repeat(50));

  if (!token) {
    console.error("❌ Tidak ada token, skip test");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations/my-recommendation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ API Response Status:", response.status);
      console.log("\n📋 AI Recommendation:");
      console.log("─".repeat(50));

      if (data.aiRecommendation) {
        console.log(data.aiRecommendation);
      } else {
        console.log("(Tidak ada rekomendasi)");
      }

      console.log("\n📚 Recommended Modules:");
      console.log("─".repeat(50));

      if (data.recommendedModules && data.recommendedModules.length > 0) {
        data.recommendedModules.forEach((module, idx) => {
          console.log(`\n${idx + 1}. ${module.judul}`);
          console.log(`   Deskripsi: ${module.deskripsi}`);
          console.log(`   Goals: ${module.goalsModule}`);
          console.log(
            `   Skills: ${
              module.targetSkills
                .map((s) => (typeof s === "object" ? s.nama : s))
                .join(", ") || "N/A"
            }`,
          );
        });
      } else {
        console.log("(Tidak ada modul yang direkomendasikan)");
      }

      console.log("\n✅ Recommendation API berjalan dengan lancar!");
    } else {
      console.error("❌ API Error:", response.status);
      console.error("Response:", data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function testTextOnlyRecommendation(token) {
  console.log("\n🔍 TEST 4: Get Text-Only Recommendation");
  console.log("─".repeat(50));

  if (!token) {
    console.error("❌ Tidak ada token, skip test");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/text-only`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        skills: ["JavaScript", "React", "Node.js"],
        division: "IT",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ API Response Status:", response.status);
      console.log("\n💡 Recommendation untuk Custom Skills:");
      console.log("─".repeat(50));
      console.log(data.recommendation);
      console.log("\n✅ Text-Only API berjalan dengan lancar!");
    } else {
      console.error("❌ API Error:", response.status);
      console.error("Response:", data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting API Tests for AI Recommendation System");
  console.log("═".repeat(50));

  await testHealthCheck();

  const token = await loginUser();

  if (token) {
    await testRecommendationAPI(token);
    await testTextOnlyRecommendation(token);
  }

  console.log("\n═".repeat(50));
  console.log("✅ All tests completed!");
  console.log("\n📌 Notes:");
  console.log("- Pastikan user dengan email tertentu sudah ada di database");
  console.log("- Pastikan user memiliki skills yang di-set");
  console.log("- Pastikan backend running di http://localhost:5000");
  console.log("- Pastikan MongoDB connected");
}

// Run tests
runAllTests();
