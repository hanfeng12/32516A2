const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "LOGOUT",
        "CREATE_EXPENSE",
        "UPDATE_EXPENSE",
        "DELETE_EXPENSE",
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ["user", "expense_item"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);