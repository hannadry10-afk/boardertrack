# BoarderTrack 🏠

An intuitive web app for boarding house owners to efficiently log, track, and manage boarder details with a spreadsheet-like interface and real-time updates.

## Features

- 📋 Track boarders with entry/exit dates, payment status, and notes
- 💰 Monitor payments — paid, unpaid, partial
- 🧾 Log expenses (bills, receipts, etc.)
- 📊 Monthly dashboard summary
- 🕒 Activity log — full audit trail of all changes
- 🗄️ Local SQLite database — no internet required, data stays on your machine

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3) — stored locally as `server/boardertrack.db`

## Getting Started

### Requirements
- Node.js v16+ installed ([download here](https://nodejs.org))

### 1. Clone the repo
```bash
git clone https://github.com/hannadry10-afk/boardertrack.git
cd boardertrack
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

### 4. Start the backend server
Open a terminal and run:
```bash
cd server
node index.js
```
You should see: `🚀 BoarderTrack server running at http://localhost:5000`

### 5. Start the frontend (in a new terminal)
```bash
npm start
```
App opens at: **http://localhost:3000**

## Project Structure

```
boardertrack/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── entities.js       # API calls to backend
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Boarders.jsx
│   │   ├── Expenses.jsx
│   │   ├── ActivityLog.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── server/
│   ├── index.js              # Express API server
│   ├── db.js                 # SQLite database setup
│   ├── boardertrack.db       # Your local database (auto-created)
│   └── package.json
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entities/boarders` | List all boarders |
| POST | `/api/entities/boarders` | Add a boarder |
| PUT | `/api/entities/boarders/:id` | Update a boarder |
| DELETE | `/api/entities/boarders/:id` | Delete a boarder |
| GET | `/api/entities/expenses` | List all expenses |
| GET | `/api/health` | Server health check |

Same pattern applies for `expenses`, `settings`, `activity_log`.

## License

MIT — free to use, modify, and share.
