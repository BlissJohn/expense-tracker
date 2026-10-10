import { useState } from "react";
import type { Category, Transaction } from "../types/transaction";

type AddTransactionProps = {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
};

const expenseCategories: Category[] = [
  "Food",
  "Alcohol",
  "Tech Accessories",
  "Non-Tech Accessories",
  "Groceries",
  "Transportation",
  "Rent",
  "Personal Activities",
];

const incomeCategories: Category[] = [
  "Salary Earned",
  "Money Received from Mom",
  "Money Received from Brother",
];

function AddTransaction({
  onSave,
  onCancel,
}: AddTransactionProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<Category>("Food");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter what the transaction is for.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transaction: Transaction = {
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      category,
      date,
    };

    onSave(transaction);
  };

  return (
    <main className="add-transaction-page">
      <div className="page-header">
        <div>
          <h2>Add Transaction</h2>
          <p>Record money you spent or received.</p>
        </div>

        <button onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form
        className="transaction-form"
        onSubmit={handleSubmit}
      >
        {/* Name */}

        <div className="form-group">
          <label htmlFor="name">
            What is this transaction for?
          </label>

          <input
            id="name"
            type="text"
            placeholder="Example: Pani Puri"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Amount */}

        <div className="form-group">
          <label htmlFor="amount">
            Amount
          </label>

          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="₹ 0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Category */}

        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Category)
            }
          >
            <optgroup label="Money Out">
              {expenseCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </optgroup>

            <optgroup label="Money In">
              {incomeCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Date */}

        <div className="form-group">
          <label htmlFor="date">
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Buttons */}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddTransaction;