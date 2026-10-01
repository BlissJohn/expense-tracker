import { useEffect, useState } from "react";
import "./App.css";

import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";
import CategorySummary from "./Pages/CategorySummary";
import Transactions from "./Pages/Transactions";

import { supabase } from "./lib/supabase";
import type { Transaction } from "./types/transaction";

type Page =
  | "dashboard"
  | "add"
  | "categories"
  | "transactions";

function App() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [currentPage, setCurrentPage] =
    useState<Page>("dashboard");

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  // Check authentication when the app starts
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session?.user) {
        await loadTransactions();
      }

      setLoading(false);
    };

    checkSession();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadTransactions();
        } else {
          setTransactions([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load transactions belonging to the logged-in user
  const loadTransactions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setTransactions([]);
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error(
        "Error loading transactions:",
        error
      );

      alert("Could not load your transactions.");
      return;
    }

    setTransactions(data ?? []);
  };

  // Login
  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoginLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("Login error:", error);
      alert(error.message);
    }

    setLoginLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert("Could not log out.");
      return;
    }

    setTransactions([]);
    setCurrentPage("dashboard");
  };

  const handleAddTransaction = () => {
    setCurrentPage("add");
  };

  // Save transaction
  const handleSaveTransaction = async (
    transaction: Transaction
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first.");
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          name: transaction.name,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,

          // IMPORTANT:
          // Automatically connect this transaction
          // to the currently logged-in user.
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Error saving transaction:",
        error
      );

      alert("Could not save the transaction.");
      return;
    }

    setTransactions((currentTransactions) => [
      data,
      ...currentTransactions,
    ]);

    setCurrentPage("dashboard");
  };

  // Delete transaction
  const handleDeleteTransaction = async (
    id: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting transaction:",
        error
      );

      alert("Could not delete the transaction.");
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const handleViewCategories = () => {
    setCurrentPage("categories");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  // Initial loading
  if (loading) {
    return (
      <div className="app">
        <main className="app-content">
          <div className="empty-state">
            <h2>Loading...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  // Login screen
if (!user) {
  return (
    <div id="formWrapper">
      <div id="form">
        <div className="logo">
          <h1>Expense Tracker</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-item">
            <label
              className="formLabel"
              htmlFor="email"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              className="form-style"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-item">
            <label
              className="formLabel"
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              className="form-style"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="form-item">
            <button
              type="submit"
              className="login"
              disabled={loginLoading}
            >
              {loginLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  // Main application
  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>

        <nav className="app-nav">
          <button
            onClick={() =>
              setCurrentPage("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              setCurrentPage("transactions")
            }
          >
            Transactions
          </button>

          <button
            onClick={() =>
              setCurrentPage("categories")
            }
          >
            Categories
          </button>

          <button
            onClick={() =>
              setCurrentPage("add")
            }
          >
            + Add Transaction
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="app-content">
        {currentPage === "dashboard" && (
          <Dashboard
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onViewCategories={handleViewCategories}
          />
        )}

        {currentPage === "add" && (
          <AddTransaction
            onSave={handleSaveTransaction}
            onCancel={handleBackToDashboard}
          />
        )}

        {currentPage === "categories" && (
          <CategorySummary
            transactions={transactions}
            onBack={handleBackToDashboard}
          />
        )}

        {currentPage === "transactions" && (
          <Transactions
            transactions={transactions}
            onBack={handleBackToDashboard}
            onDelete={handleDeleteTransaction}
          />
        )}
      </main>
    </div>
  );
}

export default App;