const UserActivity = require("../models/UserActivity");

async function logActivity({ userId, action, entityType, entityId, description }) {
  try {
    await UserActivity.create({
      user: userId,
      action,
      entityType,
      entityId,
      description,
    });
  } catch (error) {
    console.error("Activity logging failed:", error.message);
  }
}

module.exports = logActivity;