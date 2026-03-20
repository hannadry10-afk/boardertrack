import React, { useEffect, useState } from 'react';
import { Boarder } from '../api/entities';

const STATUS_COLORS = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  partial: 'bg-yellow-100 text-yellow-700',
};

export default function Boarders() {
  const [boarders, setBoarders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm());

  function defaultForm() {
    return {
      name: '', entry_date: '', time_in: '', time_out: '',
      time_out_date: '', status: 'unpaid', amount: '',
      amount_paid: '', month_year: new Date().toISOString().slice(0, 7), notes: '',
    };
  }

  useEffect(() => { fetchBoarders(); }, []);

  async function fetchBoarders() {
    setLoading(true);
    try {
      const res = await Boarder.list();
      setBoarders(res.records || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await Boarder.update(editingId, form);
      } else {
        await Boarder.create(form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm());
      fetchBoarders();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this boarder?')) return;
    await Boarder.delete(id);
    fetchBoarders();
  }

  function handleEdit(b) {
    setForm({ ...b });
    setEditingId(b.id);
    setShowForm(true);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Boarders</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm()); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          + Add Boarder
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Boarder</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
            <Field label="Entry Date" type="date" value={form.entry_date} onChange={v => setForm({...form, entry_date: v})} />
            <Field label="Time In" type="time" value={form.time_in} onChange={v => setForm({...form, time_in: v})} />
            <Field label="Time Out" type="time" value={form.time_out} onChange={v => setForm({...form, time_out: v})} />
            <Field label="Time Out Date" type="date" value={form.time_out_date} onChange={v => setForm({...form, time_out_date: v})} />
            <Field label="Month/Year" value={form.month_year} onChange={v => setForm({...form, month_year: v})} placeholder="e.g. 2026-03" />
            <Field label="Amount Due" type="number" value={form.amount} onChange={v => setForm({...form, amount: v})} />
            <Field label="Amount Paid" type="number" value={form.amount_paid} onChange={v => setForm({...form, amount_paid: v})} />
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </div>
            <Field label="Notes" value={form.notes} onChange={v => setForm({...form, notes: v})} />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg border text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {['Name','Entry Date','Time Out','Month','Amount','Paid','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {boarders.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-gray-500">{b.entry_date}</td>
                <td className="px-4 py-3 text-gray-500">{b.time_out_date || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{b.month_year}</td>
                <td className="px-4 py-3">₱{b.amount?.toLocaleString()}</td>
                <td className="px-4 py-3">₱{b.amount_paid?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ''}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(b)} className="text-blue-500 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {boarders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No boarders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        required={required} placeholder={placeholder}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
    </div>
  );
}
