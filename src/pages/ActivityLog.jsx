import React, { useEffect, useState } from 'react';
import { ActivityLog as ActivityLogEntity } from '../api/entities';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await ActivityLogEntity.list();
        setLogs(res.records || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity Log</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {['Action', 'Entity', 'Name', 'User', 'Amount', 'Summary', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.action === 'create' ? 'bg-green-100 text-green-700' :
                    log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>{log.action}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{log.entity_type}</td>
                <td className="px-4 py-3 font-medium">{log.entity_name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.user_email}</td>
                <td className="px-4 py-3">{log.amount ? `₱${log.amount.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{log.changes_summary || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(log.created_date).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No activity yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
