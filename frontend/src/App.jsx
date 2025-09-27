import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Users, DollarSign } from "lucide-react";

function App() {
  const [accountId, setAccountId] = useState("");
  const [introducerId, setIntroducerId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/account");
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/account/add", {
        account_id: accountId,
        introducer_id: introducerId ? parseInt(introducerId) : null,
      });
      setMessage(res.data.message);
      setAccountId("");
      setIntroducerId("");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error adding account");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Users size={32} /> Bank Account Manager
        </h1>

        <form
          onSubmit={handleAddAccount}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={24} /> Add New Account
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Account ID</label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Introducer ID</label>
              <input
                type="number"
                value={introducerId}
                onChange={(e) => setIntroducerId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Add Account
          </button>
          {message && <p className="mt-3 text-green-600">{message}</p>}
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={24} /> All Accounts
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border px-4 py-2">Account ID</th>
                  <th className="border px-4 py-2">Introducer ID</th>
                  <th className="border px-4 py-2">Beneficiary ID</th>
                  <th className="border px-4 py-2">Balance (₹)</th>
                  
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.account_id} className="text-gray-800 hover:bg-gray-50">
                    <td className="border px-4 py-2">{acc.account_id}</td>
                    <td className="border px-4 py-2">{acc.introducer_id}</td>
                    <td className="border px-4 py-2">{acc.beneficiary_id}</td>
                    <td className="border px-4 py-2 font-medium">{acc.balance}</td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No accounts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
