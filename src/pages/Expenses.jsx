import React, { useEffect, useState } from 'react';
import { Expense } from '../api/entities';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm());

  function defaultForm() {
    return { bill_name: '', date: '', amount: '', receipt_url: '', notes: '', month_year: new Date().toISOString().slice(0, 7) };
  }

  useEffect(() => { fetchExpenses(); }, []);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await Expense.list();
      setExpenses(res.records || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) await Expense.update(editingId, form);
      else await Expense.create(form);
      setShowForm(false); setEditingId(null); setForm(defaultForm());
      fetchExpenses();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    await Expense.delete(id);
    fetchExpenses();
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm()); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          + Add Expense
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Expense</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: 'Bill Name', key: 'bill_name', required: true },
              { label: 'Date', key: 'date', type: 'date' },
              { label: 'Amount', key: 'amount', type: 'number' },
              { label: 'Receipt URL', key: 'receipt_url' },
              { label: 'Month/Year', key: 'month_year', placeholder: 'e.g. 2026-03' },
              { label: 'Notes', key: 'notes' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm text-gray-600">{f.label}</label>
                <input type={f.type || 'text'} value={form[f.key]} required={f.required}
                  placeholder={f.placeholder}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg border text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {['Bill Name', 'Date', 'Month', 'Amount', 'Notes', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{exp.bill_name}</td>
                <td className="px-4 py-3 text-gray-500">{exp.date}</td>
                <td className="px-4 py-3 text-gray-500">{exp.month_year}</td>
                <td className="px-4 py-3">₱{exp.amount?.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{exp.notes || '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm({...exp}); setEditingId(exp.id); setShowForm(true); }}
                    className="text-blue-500 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No expenses logged.</td></tr>
            )}
          </tbody>
        </table>
        {expenses.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-right font-semibold text-sm">
            Total: ₱{total.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
