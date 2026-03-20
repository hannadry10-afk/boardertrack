// BoarderTrack - Entity API Layer
// These mirror the Base44 entity schemas

const BASE_URL = process.env.REACT_APP_API_URL || '';

// Generic entity factory
function createEntity(name) {
  return {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/api/entities/${name}?${query}`);
      return res.json();
    },
    get: async (id) => {
      const res = await fetch(`${BASE_URL}/api/entities/${name}/${id}`);
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${BASE_URL}/api/entities/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${BASE_URL}/api/entities/${name}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/api/entities/${name}/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
    filter: async (query = {}) => {
      const params = new URLSearchParams(query).toString();
      const res = await fetch(`${BASE_URL}/api/entities/${name}/filter?${params}`);
      return res.json();
    },
  };
}

export const Boarder = createEntity('Boarder');
export const Settings = createEntity('Settings');
export const Expense = createEntity('Expense');
export const ActivityLog = createEntity('ActivityLog');
