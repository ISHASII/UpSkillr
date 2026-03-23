const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("Karyawan"),
  asyncHandler(userController.updateProfileSkills),
);

router.post("/", asyncHandler(userController.createUser));
router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUserById));
router.put("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));

module.exports = router;
