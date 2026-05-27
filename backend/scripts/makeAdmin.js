require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

async function makeAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error("Please provide an email address.");
      console.error("Example: node scripts/makeAdmin.js test2@gmail.com");
      process.exit(1);
    }

    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    ).select("-password");

    if (!user) {
      console.error(`No user found with email: ${email}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log("User updated to admin:");
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to update user role:", error);
    process.exit(1);
  }
}

makeAdmin();