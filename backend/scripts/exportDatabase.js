require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");
const Expense = require("../models/Expense");
const UserActivity = require("../models/UserActivity");

async function exportDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for export");

    const exportDir = path.join(__dirname, "../../database");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const users = await User.find()
      .select("-password")
      .lean();

    const expenses = await Expense.find()
      .lean();

    const userActivities = await UserActivity.find()
      .populate("user", "name email role")
      .lean();

    fs.writeFileSync(
      path.join(exportDir, "users.json"),
      JSON.stringify(users, null, 2)
    );

    fs.writeFileSync(
      path.join(exportDir, "expenses.json"),
      JSON.stringify(expenses, null, 2)
    );

    fs.writeFileSync(
      path.join(exportDir, "useractivities.json"),
      JSON.stringify(userActivities, null, 2)
    );

    console.log("Database export completed:");
    console.log("- database/users.json");
    console.log("- database/expenses.json");
    console.log("- database/useractivities.json");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Database export failed:", error);
    process.exit(1);
  }
}

exportDatabase();