import type { Transaction } from "../types/transaction";

type CategorySummaryProps = {
  transactions: Transaction[];
  onBack: () => void;
};

const expenseCategories = [
  "Food",
  "Alcohol",
  "Tech Accessories",
  "Non-Tech Accessories",
  "Groceries",
  "Rent",
  "Personal Activities",
];

const incomeCategories = [
  "Salary Earned",
  "Money Received from Mom",
  "Money Received from Brother",
];

function CategorySummary({
  transactions,
  onBack,
}: CategorySummaryProps) {
  const getCategoryTotal = (category: string) => {
    return transactions
      .filter(
        (transaction) => transaction.category === category
      )
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  };

  const totalMoneyOut = expenseCategories.reduce(
    (total, category) =>
      total + getCategoryTotal(category),
    0
  );

  const totalMoneyIn = incomeCategories.reduce(
    (total, category) =>
      total + getCategoryTotal(category),
    0
  );

  return (
    <main className="category-summary-page">
      <div className="page-header">
        <div>
          <h2>Category Summary</h2>
          <p>
            See how much money you have spent or received
            in each category.
          </p>
        </div>

        <button onClick={onBack}>
          Back to Dashboard
        </button>
      </div>

      {/* Money Out */}

      <section className="summary-section">
        <div className="summary-section-header">
          <h3>Money Out</h3>

          <strong className="expense">
            ₹{totalMoneyOut.toFixed(2)}
          </strong>
        </div>

        <div className="category-list">
          {expenseCategories.map((category) => {
            const total = getCategoryTotal(category);

            return (
              <div
                className="category-row"
                key={category}
              >
                <span>{category}</span>

                <strong>
                  ₹{total.toFixed(2)}
                </strong>
              </div>
            );
          })}
        </div>
      </section>

      {/* Money In */}

      <section className="summary-section">
        <div className="summary-section-header">
          <h3>Money In</h3>

          <strong className="income">
            ₹{totalMoneyIn.toFixed(2)}
          </strong>
        </div>

        <div className="category-list">
          {incomeCategories.map((category) => {
            const total = getCategoryTotal(category);

            return (
              <div
                className="category-row"
                key={category}
              >
                <span>{category}</span>

                <strong>
                  ₹{total.toFixed(2)}
                </strong>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default CategorySummary;