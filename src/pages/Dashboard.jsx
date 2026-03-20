import React, { useEffect, useState } from 'react';
import { Boarder, Expense, Settings } from '../api/entities';

export default function Dashboard() {
  const [boarders, setBoarders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({ monthly_rate: 0, currency: '₱' });
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-03"

  useEffect(() => {
    async function fetchData() {
      try {
        const [b, e, s] = await Promise.all([
          Boarder.filter({ month_year: currentMonth }),
          Expense.filter({ month_year: currentMonth }),
          Settings.list(),
        ]);
        setBoarders(b.records || []);
        setExpenses(e.records || []);
        if (s.records?.length > 0) setSettings(s.records[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalDue = boarders.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalPaid = boarders.reduce((sum, b) => sum + (b.amount_paid || 0), 0);
  const totalUnpaid = totalDue - totalPaid;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const paidCount = boarders.filter(b => b.status === 'paid').length;
  const unpaidCount = boarders.filter(b => b.status === 'unpaid').length;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard — {currentMonth}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Boarders" value={boarders.length} color="blue" />
        <StatCard label="Paid" value={paidCount} color="green" />
        <StatCard label="Unpaid" value={unpaidCount} color="red" />
        <StatCard label="Total Collected" value={`${settings.currency}${totalPaid.toLocaleString()}`} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <Row label="Total Due" value={`${settings.currency}${totalDue.toLocaleString()}`} />
            <Row label="Total Paid" value={`${settings.currency}${totalPaid.toLocaleString()}`} />
            <Row label="Balance" value={`${settings.currency}${totalUnpaid.toLocaleString()}`} highlight />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Expenses This Month</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses logged.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {expenses.map(exp => (
                <li key={exp.id} className="flex justify-between">
                  <span>{exp.bill_name}</span>
                  <span className="font-medium">{settings.currency}{exp.amount?.toLocaleString()}</span>
                </li>
              ))}
              <li className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{settings.currency}{totalExpenses.toLocaleString()}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className={`flex justify-between ${highlight ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
