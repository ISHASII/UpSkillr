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

router.get(
  "/registrations/pending",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(userController.getPendingRegistrations),
);

router.put(
  "/registrations/:id/decision",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(userController.decideRegistration),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(userController.createUser),
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(userController.getUsers),
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("HR", "Karyawan"),
  asyncHandler(userController.getUserById),
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("HR", "Karyawan"),
  asyncHandler(userController.updateUser),
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(userController.deleteUser),
);

module.exports = router;
