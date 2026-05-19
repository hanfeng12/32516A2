import "./App.css";

function App() {
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

        <section className="card">
          <h2>Expense List</h2>
          <p className="placeholder-text">
            Expenses will appear here after connecting the frontend to the backend API.
          </p>
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