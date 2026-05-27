import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api/expenses";
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

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

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setExpenses([]);
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        <section className="auth-card">
          <h1>Expense Tracker</h1>
          <p className="auth-subtitle">
            {authMode === "login"
              ? "Log in to manage your expenses and budgets."
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
        <p>Track expenses, manage budgets, and review spending summaries.</p>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Add Expense</h2>

          <form className="expense-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input id="title" type="text" placeholder="e.g. Lunch" />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input id="amount" type="number" placeholder="e.g. 15.50" />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input id="category" type="text" placeholder="e.g. Food" />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input id="description" type="text" placeholder="Optional note" />
            </div>

            <button type="button">Add Expense</button>
          </form>
        </section>

        <section className="card expense-list-card">
          <h2>Expense List</h2>

          {loading && <p className="placeholder-text">Loading expenses...</p>}

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {!loading && !errorMessage && expenses.length === 0 && (
            <p className="placeholder-text">
              No expenses found.
            </p>
          )}

          {!loading && !errorMessage && expenses.length > 0 && (
            <div className="expense-list">
              {expenses.map((expense) => (
                <article className="expense-item" key={expense._id}>
                  <div>
                    <h3>{expense.title}</h3>
                    <p>
                      {expense.category} • {expense.date}
                    </p>
                    {expense.description && (
                      <p className="expense-description">{expense.description}</p>
                    )}
                  </div>

                  <strong>${Number(expense.amount).toFixed(2)}</strong>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Budget Overview</h2>
          <p className="placeholder-text">
            Budget information will be displayed here.
          </p>
        </section>

        <section className="card">
          <h2>Spending Summary</h2>
          <p className="placeholder-text">
            Category and monthly summaries will be displayed here.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;