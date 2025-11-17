"use client";

import { useEffect, useState } from "react";
import {
  getUserTransactions,
  sendMoney,
  User,
  Transaction,
} from "@/app/api/client";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Send Money modal state
  const [showModal, setShowModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("ks_user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch transactions for this user
      getUserTransactions(parsedUser.id)
        .then((txs) => setTransactions(txs))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSendMoney = async () => {
    if (!recipientEmail || !amount) {
      setSendError("Please fill in all fields");
      return;
    }
    if (amount <= 0) {
      setSendError("Amount must be greater than 0");
      return;
    }
    if (!user) return;

    setSending(true);
    setSendError("");
    setSendSuccess("");

    try {
      await sendMoney(user.id, Number(amount), "sent", recipientEmail);

      // Update local user balance
      const updatedUser: User = { ...user, balance: user.balance - Number(amount) };
      setUser(updatedUser);
      localStorage.setItem("ks_user", JSON.stringify(updatedUser));

      // Refresh transactions
      const updatedTxs = await getUserTransactions(user.id);
      setTransactions(updatedTxs);

      setSendSuccess("Money sent successfully!");
      setRecipientEmail("");
      setAmount("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setSendError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-green-600">Dashboard</h1>

      {user && (
        <div className="mb-6">
          <p className="text-lg">
            Welcome, <strong>{user.name || user.email}</strong>
          </p>
          <p className="text-lg mt-2">
            Balance: <strong className="text-green-600">${user.balance}</strong>
          </p>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Send Money
      </button>

      {/* Transactions Table */}
      <div className="bg-white rounded shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">To/From</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.type}</td>
                  <td className="py-2">${tx.amount}</td>
                  <td className="py-2">{tx.to || tx.from || "-"}</td>
                  <td className="py-2">{new Date(tx.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Send Money Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-green-600">Send Money</h2>

            {sendError && <p className="text-red-500 mb-2">{sendError}</p>}
            {sendSuccess && <p className="text-green-600 mb-2">{sendSuccess}</p>}

            <input
              type="email"
              placeholder="Recipient Email"
              className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSendMoney}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
