import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load expenses. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track expenses, manage budgets, and review spending summaries.</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Add Expense</h2>

          <form className="expense-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Lunch"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                placeholder="e.g. 15.50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="e.g. Food"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Optional note"
              />
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
              No expenses found. Add your first expense after the form is connected.
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