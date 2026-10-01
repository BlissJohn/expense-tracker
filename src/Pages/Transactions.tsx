import type { Transaction } from "../types/transaction";

type TransactionsProps = {
  transactions: Transaction[];
  onBack: () => void;
  onDelete: (id: number) => void;
};


const incomeCategories = [
  "Salary Earned",
  "Money Received from Mom",
  "Money Received from Brother",
];

function Transactions({
  transactions,
  onBack,
  onDelete,
}: TransactionsProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  const isIncome = (category: string) =>
    incomeCategories.includes(category);

  return (
    <main className="transactions-page">
      <div className="page-header">
        <div>
          <h2>Transactions</h2>
          <p>View all your money in and money out.</p>
        </div>

        <button onClick={onBack}>
          Back to Dashboard
        </button>
      </div>

      <section className="transactions-section">
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions yet</h3>
            <p>
              Add your first transaction to see it here.
            </p>
          </div>
        ) : (
          <div className="transactions-list">
            {sortedTransactions.map((transaction) => {
              const income = isIncome(transaction.category);

              return (
                <div
                  className="transaction-item"
                  key={transaction.id}
                >
                  <div className="transaction-details">
                    <strong>{transaction.name}</strong>

                    <span>
                      {transaction.category}
                    </span>

                    <small>
                      {new Date(
                        transaction.date
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </div>

                  <div className="transaction-actions">
                    <strong
                      className={
                        income ? "income" : "expense"
                      }
                    >
                      {income ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </strong>

                    <button
                      className="delete-button"
                      onClick={() =>
                        onDelete(transaction.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Transactions;