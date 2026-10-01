import type { Transaction } from "../types/transaction";

type DashboardProps = {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onViewCategories: () => void;
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

function Dashboard({
  transactions,
  onAddTransaction,
  onViewCategories,
}: DashboardProps) {
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

  const balance = totalMoneyIn - totalMoneyOut;

  const isLowBalance =
  transactions.length > 0 && balance < 1000;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <main
      className={
        isLowBalance
          ? "dashboard-page low-balance"
          : "dashboard-page"
      }
    >
      <div className="dashboard-header">
        <div>
          <h2>
            {isLowBalance
              ? "Uh-oh... 😭"
              : "Welcome back! 👋"}
          </h2>

          <p>
            {isLowBalance
              ? "Your wallet is feeling a little lonely."
              : "Here's what's happening with your money."}
          </p>
        </div>

        <button onClick={onAddTransaction}>
          + Add Transaction
        </button>
      </div>

      {isLowBalance && (
        <div className="low-balance-message">
          <strong>🚨 Wallet Emergency!</strong>

          <span>
            Your balance is below ₹1,000. Maybe it's
            time to stop buying things you absolutely
            don't need. 😭
          </span>
        </div>
      )}

      <section className="dashboard-cards">
        <div className="dashboard-card">
          <span>💰 Money In</span>
          <h2 className="income">
            ₹{totalMoneyIn.toFixed(2)}
          </h2>
        </div>

        <div className="dashboard-card">
          <span>💸 Money Out</span>
          <h2 className="expense">
            ₹{totalMoneyOut.toFixed(2)}
          </h2>
        </div>

        <div className="dashboard-card">
          <span>
            {isLowBalance
              ? "😭 Balance"
              : "💵 Balance"}
          </span>

          <h2
            className={
              isLowBalance ? "expense" : "income"
            }
          >
            ₹{balance.toFixed(2)}
          </h2>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>

          <button onClick={onViewCategories}>
            View Categories
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <p>
              Add your first transaction to get started! 🚀
            </p>
          </div>
        ) : (
          recentTransactions.map((transaction) => {
            const isIncome =
              incomeCategories.includes(
                transaction.category
              );

            return (
              <div
                className="transaction-row"
                key={transaction.id}
              >
                <div>
                  <strong>{transaction.name}</strong>

                  <span>
                    {transaction.category} •{" "}
                    {transaction.date}
                  </span>
                </div>

                <strong
                  className={
                    isIncome ? "income" : "expense"
                  }
                >
                  {isIncome ? "+" : "-"}₹
                  {transaction.amount.toFixed(2)}
                </strong>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

export default Dashboard;