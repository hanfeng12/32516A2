const express = require("express");
const Budget = require("../models/Budget");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({
      month: -1
    });

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;

    if (!category || !monthlyLimit || !month) {
      return res.status(400).json({ message: "Please provide required fields" });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      monthlyLimit,
      month
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Failed to create budget" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const { category, monthlyLimit, month } = req.body;

    budget.category = category ?? budget.category;
    budget.monthlyLimit = monthlyLimit ?? budget.monthlyLimit;
    budget.month = month ?? budget.month;

    const updatedBudget = await budget.save();

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: "Failed to update budget" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.deleteOne();

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete budget" });
  }
});

module.exports = router;