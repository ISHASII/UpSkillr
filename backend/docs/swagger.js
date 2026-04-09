const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "UpSkillr API",
      version: "1.0.0",
      description:
        "API documentation for Employee Skill Matcher & Training Hub (UpSkillr).",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Berhasil" },
            data: { type: "object", nullable: true },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Terjadi kesalahan" },
          },
        },
      },
    },
    paths: {
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          responses: {
            200: {
              description: "API is healthy",
            },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user (HR/Karyawan)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nama", "email", "password", "role", "divisi"],
                  properties: {
                    nama: { type: "string", example: "Aldi Pratama" },
                    email: { type: "string", example: "aldi@company.com" },
                    password: { type: "string", example: "SecurePass123!" },
                    role: { type: "string", enum: ["HR", "Karyawan"] },
                    divisi: { type: "string", example: "Engineering" },
                    skills: {
                      type: "array",
                      items: { type: "string" },
                      example: ["React", "Node.js"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Registered" },
            400: { description: "Validation error" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "hr@company.com" },
                    password: { type: "string", example: "SecurePass123!" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login success" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/google": {
        post: {
          tags: ["Auth"],
          summary: "Login with Google credential",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["credential"],
                  properties: {
                    credential: {
                      type: "string",
                      example: "GOOGLE_ID_TOKEN",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Google login success" },
          },
        },
      },
      "/api/auth/forgot-password/request-otp": {
        post: {
          tags: ["Auth"],
          summary: "Request OTP for forgot password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", example: "user@company.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP sent" },
          },
        },
      },
      "/api/auth/forgot-password/verify-otp": {
        post: {
          tags: ["Auth"],
          summary: "Verify OTP for forgot password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: { type: "string", example: "user@company.com" },
                    otp: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP verified" },
          },
        },
      },
      "/api/auth/forgot-password/reset": {
        post: {
          tags: ["Auth"],
          summary: "Reset password with OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp", "newPassword"],
                  properties: {
                    email: { type: "string", example: "user@company.com" },
                    otp: { type: "string", example: "123456" },
                    newPassword: {
                      type: "string",
                      example: "NewSecurePass123!",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password reset success" },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users (HR only)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "User list" } },
        },
        post: {
          tags: ["Users"],
          summary: "Create user (HR only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nama: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string", enum: ["HR", "Karyawan"] },
                    divisi: { type: "string" },
                    skills: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "User created" } },
        },
      },
      "/api/users/profile": {
        put: {
          tags: ["Users"],
          summary: "Update profile skills (Karyawan)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["skills"],
                  properties: {
                    skills: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Profile updated" } },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "User detail" } },
        },
        put: {
          tags: ["Users"],
          summary: "Update user by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nama: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["HR", "Karyawan"] },
                    divisi: { type: "string" },
                    skills: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "User updated" } },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user by id (HR only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "User deleted" } },
        },
      },
      "/api/users/registrations/pending": {
        get: {
          tags: ["Users"],
          summary: "Get pending registrations (HR)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Pending registrations" } },
        },
      },
      "/api/users/registrations/{id}/decision": {
        put: {
          tags: ["Users"],
          summary: "Approve/reject registration (HR)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["approved", "rejected"],
                    },
                    reason: { type: "string", example: "Data belum lengkap" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Decision saved" } },
        },
      },
      "/api/skills": {
        get: {
          tags: ["Skills"],
          summary: "Get all skills",
          responses: { 200: { description: "Skill list" } },
        },
        post: {
          tags: ["Skills"],
          summary: "Create skill (HR only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nama"],
                  properties: {
                    nama: { type: "string", example: "React" },
                    kategori: { type: "string", example: "Frontend" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Skill created" } },
        },
      },
      "/api/skills/{id}": {
        get: {
          tags: ["Skills"],
          summary: "Get skill by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Skill detail" } },
        },
        put: {
          tags: ["Skills"],
          summary: "Update skill (HR only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nama: { type: "string" },
                    kategori: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Skill updated" } },
        },
        delete: {
          tags: ["Skills"],
          summary: "Delete skill (HR only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Skill deleted" } },
        },
      },
      "/api/modules": {
        get: {
          tags: ["Training Modules"],
          summary: "Get all training modules",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Module list" } },
        },
        post: {
          tags: ["Training Modules"],
          summary: "Create training module (HR only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["judul", "deskripsi"],
                  properties: {
                    judul: { type: "string", example: "Advanced React" },
                    deskripsi: { type: "string" },
                    linkMateri: { type: "string" },
                    targetSkills: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Module created" } },
        },
      },
      "/api/modules/recommendations/me": {
        get: {
          tags: ["Training Modules"],
          summary: "Get module recommendations for logged-in employee",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Recommendation list" } },
        },
      },
      "/api/modules/{id}": {
        put: {
          tags: ["Training Modules"],
          summary: "Update module (HR only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    judul: { type: "string" },
                    deskripsi: { type: "string" },
                    linkMateri: { type: "string" },
                    targetSkills: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Module updated" } },
        },
        delete: {
          tags: ["Training Modules"],
          summary: "Delete module (HR only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Module deleted" } },
        },
      },
      "/api/logs": {
        get: {
          tags: ["Progress Logs"],
          summary: "Get all progress logs (HR)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Progress logs" } },
        },
        post: {
          tags: ["Progress Logs"],
          summary: "Create progress log (Karyawan)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["module_id"],
                  properties: {
                    module_id: {
                      type: "string",
                      example: "65f1234567890abcde123456",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Progress log created" } },
        },
      },
      "/api/logs/me": {
        get: {
          tags: ["Progress Logs"],
          summary: "Get current employee progress logs",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Employee progress logs" } },
        },
      },
      "/api/logs/module/{moduleId}": {
        get: {
          tags: ["Progress Logs"],
          summary: "Get progress logs by module for HR",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "moduleId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Progress logs by module" } },
        },
      },
      "/api/logs/{id}/submission": {
        put: {
          tags: ["Progress Logs"],
          summary: "Submit task link/files for progress log (Karyawan)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    submissionLink: {
                      type: "string",
                      example: "https://github.com/user/repo",
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Submission sent" } },
        },
      },
      "/api/logs/{id}/validation": {
        put: {
          tags: ["Progress Logs"],
          summary: "Validate submission by HR",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["action"],
                  properties: {
                    action: { type: "string", enum: ["approve", "reject"] },
                    feedback: {
                      type: "string",
                      example: "Perbaiki bagian testing",
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Validation success" } },
        },
      },
      "/api/recommendations/my-recommendation": {
        get: {
          tags: ["Recommendations"],
          summary: "Get AI + module recommendations for current user",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Recommendation result" } },
        },
      },
      "/api/recommendations/modules": {
        get: {
          tags: ["Recommendations"],
          summary: "Get recommended modules only",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Recommended modules" } },
        },
      },
      "/api/recommendations/text-only": {
        post: {
          tags: ["Recommendations"],
          summary: "Get AI text recommendation only",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["skills"],
                  properties: {
                    skills: {
                      type: "array",
                      items: { type: "string" },
                      example: ["React", "TypeScript"],
                    },
                    division: { type: "string", example: "Engineering" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "AI recommendation" } },
        },
      },
      "/api/recommendations/user/{userId}": {
        get: {
          tags: ["Recommendations"],
          summary: "Get recommendation for specific user",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Recommendation result" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
