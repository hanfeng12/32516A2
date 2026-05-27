const express = require("express");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.json(expenses);
  } catch (error) {
    console.error("Fetch expenses error:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date, note, description } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "Please provide required fields" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      note: note ?? description ?? "",
    });

    await logActivity({
      userId: req.user._id,
      action: "CREATE_EXPENSE",
      entityType: "expense_item",
      entityId: expense._id,
      description: `Created expense item: ${expense.title}`,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const { title, amount, category, date, note, description } = req.body;

    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.note = note ?? description ?? expense.note;

    const updatedExpense = await expense.save();

    await logActivity({
      userId: req.user._id,
      action: "UPDATE_EXPENSE",
      entityType: "expense_item",
      entityId: updatedExpense._id,
      description: `Updated expense item: ${updatedExpense.title}`,
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const deletedExpenseTitle = expense.title;
    const deletedExpenseId = expense._id;

    await expense.deleteOne();

    await logActivity({
      userId: req.user._id,
      action: "DELETE_EXPENSE",
      entityType: "expense_item",
      entityId: deletedExpenseId,
      description: `Deleted expense item: ${deletedExpenseTitle}`,
    });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;