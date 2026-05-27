import { useEffect, useState } from "react";
import "./App.css";

const EXPENSE_API_URL = "http://localhost:5001/api/expenses";
const AUTH_API_URL = "http://localhost:5001/api/auth";

function App() {
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const filteredExpenses = expenses.filter((expense) => {
    const searchText = searchTerm.toLowerCase();

    return (
      expense.title?.toLowerCase().includes(searchText) ||
      expense.category?.toLowerCase().includes(searchText) ||
      expense.description?.toLowerCase().includes(searchText) ||
      expense.date?.toLowerCase().includes(searchText) ||
      String(expense.amount).includes(searchText)
    );
  });

  async function fetchExpenses() {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(EXPENSE_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
      }

      setExpenses(data);
    } catch (error) {
      console.error("Fetch expenses error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(event) {
    event.preventDefault();

    try {
      setErrorMessage("");

      const token = localStorage.getItem("token");

      const method = editingExpenseId ? "PUT" : "POST";
      const url = editingExpenseId
        ? `${EXPENSE_API_URL}/${editingExpenseId}`
        : EXPENSE_API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: expenseForm.title,
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
          date: expenseForm.date,
          description: expenseForm.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingExpenseId
              ? "Failed to update expense"
              : "Failed to add expense")
        );
      }

      setExpenseForm({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: "",
      });

      setEditingExpenseId(null);
      fetchExpenses();
    } catch (error) {
      console.error("Save expense error:", error);
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteExpense(id) {
    try {
      setErrorMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${EXPENSE_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense");
      }

      fetchExpenses();
    } catch (error) {
      console.error("Delete expense error:", error);
      setErrorMessage(error.message);
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    try {
      setErrorMessage("");

      const endpoint = authMode === "login" ? "login" : "register";

      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : {
              name: authForm.name,
              email: authForm.email,
              password: authForm.password,
            };

      const response = await fetch(`${AUTH_API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setAuthForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message);
    }
  }

  function handleEditExpense(expense) {
    setEditingExpenseId(expense._id);

    setExpenseForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
      description: expense.description || "",
    });
  }

  function handleCancelEdit() {
    setEditingExpenseId(null);

    setExpenseForm({
      title: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setExpenses([]);
    setSearchTerm("");
    setEditingExpenseId(null);
    setErrorMessage("");
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        <section className="auth-card">
          <h1>Expense Tracker</h1>
          <p className="auth-subtitle">
            {authMode === "login"
              ? "Log in to manage your expenses."
              : "Create an account to start tracking your spending."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active-tab" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={authMode === "register" ? "active-tab" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={authForm.name}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, name: event.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm({ ...authForm, email: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm({ ...authForm, password: event.target.value })
                }
                required
              />
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button type="submit">
              {authMode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track, search, create, update, and delete your expense items.</p>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>{editingExpenseId ? "Edit Expense" : "Add Expense"}</h2>

          <form className="expense-form" onSubmit={handleAddExpense}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Lunch"
                value={expenseForm.title}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, title: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                placeholder="e.g. 15.50"
                value={expenseForm.amount}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, amount: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="e.g. Food"
                value={expenseForm.category}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={expenseForm.date}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, date: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Optional note"
                value={expenseForm.description}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: event.target.value,
                  })
                }
              />
            </div>

            <button type="submit">
              {editingExpenseId ? "Update Expense" : "Add Expense"}
            </button>

            {editingExpenseId && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="card expense-list-card">
          <h2>Expense List</h2>

          <div className="search-box">
            <label htmlFor="expenseSearch">Live Search</label>
            <input
              id="expenseSearch"
              type="text"
              placeholder="Search by title, category, date, amount, or description"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {loading && <p className="placeholder-text">Loading expenses...</p>}

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {!loading && !errorMessage && filteredExpenses.length === 0 && (
            <p className="placeholder-text">
              {searchTerm ? "No matching expenses found." : "No expenses found."}
            </p>
          )}

          {!loading && !errorMessage && filteredExpenses.length > 0 && (
            <div className="expense-list">
              {filteredExpenses.map((expense) => (
                <article className="expense-item" key={expense._id}>
                  <div>
                    <h3>{expense.title}</h3>
                    <p>
                      {expense.category} • {expense.date}
                    </p>
                    {expense.description && (
                      <p className="expense-description">
                        {expense.description}
                      </p>
                    )}
                  </div>

                  <div className="expense-actions">
                    <strong>${Number(expense.amount).toFixed(2)}</strong>

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEditExpense(expense)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;