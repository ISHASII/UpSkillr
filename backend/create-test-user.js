#!/usr/bin/env node

/**
 * Script untuk membuat test user dengan skills
 */

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const Skill = require("./models/Skill");

const TEST_USER = {
  nama: "Test Karyawan",
  email: "testkaryawan@test.com",
  password: "password123",
  role: "Karyawan",
  divisi: "IT",
  skills: ["JavaScript", "React", "Node.js"],
  registrationStatus: "approved",
};

async function createTestUser() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if user already exists
    const existingUser = await User.findOne({ email: TEST_USER.email });

    if (existingUser) {
      console.log("⚠️  User sudah ada, mengupdate...");
      existingUser.skills = TEST_USER.skills;
      existingUser.divisi = TEST_USER.divisi;
      existingUser.registrationStatus = "approved";
      await existingUser.save();
      console.log("✅ User berhasil diupdate");
      console.log("📧 Email:", TEST_USER.email);
      console.log("🔑 Password:", TEST_USER.password);
      console.log("💼 Skills:", TEST_USER.skills);
      console.log("🏢 Divisi:", TEST_USER.divisi);
    } else {
      // Create new user
      console.log("📝 Creating new test user...");
      const newUser = new User(TEST_USER);
      await newUser.save();
      console.log("✅ User berhasil dibuat!");
      console.log("📧 Email:", TEST_USER.email);
      console.log("🔑 Password:", TEST_USER.password);
      console.log("💼 Skills:", TEST_USER.skills);
      console.log("🏢 Divisi:", TEST_USER.divisi);
    }

    await mongoose.disconnect();
    console.log("✅ Connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestUser();
