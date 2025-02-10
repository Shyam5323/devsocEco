const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/authentication"); // Import auth middleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (only accessible if logged in)
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
