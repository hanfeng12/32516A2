const express = require("express");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");
const bcrypt = require("bcrypt");

const router = express.Router();

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/activities", protect, adminOnly, async (req, res) => {
  try {
    const activities = await UserActivity.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(activities);
  } catch (error) {
    console.error("Fetch activities error:", error);
    res.status(500).json({ message: "Failed to fetch user activities" });
  }
});

router.put("/users/:id", protect, adminOnly, async (req, res) => {
    try {
      const { name, password } = req.body;
  
      const targetUser = await User.findById(req.params.id);
  
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
  
      if (password && password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }
  
      if (name !== undefined) {
        targetUser.name = name;
      }
  
      if (password) {
        targetUser.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await targetUser.save();
  
      await logActivity({
        userId: req.user._id,
        action: "UPDATE_USER_PROFILE",
        entityType: "user",
        entityId: updatedUser._id,
        description: `Admin updated user profile: ${updatedUser.email}`,
      });
  
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } catch (error) {
      console.error("Update user profile error:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ message: "Admin cannot delete own account" });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUserEmail = targetUser.email;
    const deletedUserId = targetUser._id;

    await Expense.deleteMany({ user: deletedUserId });
    await UserActivity.deleteMany({ user: deletedUserId });
    await targetUser.deleteOne();

    await logActivity({
      userId: req.user._id,
      action: "DELETE_USER",
      entityType: "user",
      entityId: deletedUserId,
      description: `Admin deleted user account: ${deletedUserEmail}`,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;