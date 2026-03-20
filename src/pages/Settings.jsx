import React, { useEffect, useState } from 'react';
import { Settings as SettingsEntity } from '../api/entities';

export default function Settings() {
  const [settings, setSettings] = useState({ monthly_rate: '', currency: '₱', summary_overrides: {} });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await SettingsEntity.list();
        if (res.records?.length > 0) {
          setSettings(res.records[0]);
          setSettingsId(res.records[0].id);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchSettings();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (settingsId) {
        await SettingsEntity.update(settingsId, settings);
      } else {
        const res = await SettingsEntity.create(settings);
        setSettingsId(res.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Monthly Rate (default)</label>
            <input type="number" value={settings.monthly_rate}
              onChange={e => setSettings({ ...settings, monthly_rate: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. 3000" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Currency Symbol</label>
            <input type="text" value={settings.currency}
              onChange={e => setSettings({ ...settings, currency: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. ₱" />
          </div>
          <button type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Save Settings
          </button>
          {saved && <p className="text-green-600 text-sm mt-2">✓ Settings saved!</p>}
        </form>
      </div>
    </div>
  );
}
