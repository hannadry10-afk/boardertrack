# BoarderTrack 🏠

An intuitive web app for boarding house owners to efficiently log, track, and manage boarder details with a spreadsheet-like interface and real-time updates.

## Features

- 📋 Track boarders with entry/exit dates, payment status, and notes
- 💰 Monitor payments — paid, unpaid, partial
- 🧾 Log expenses (bills, receipts, etc.)
- 📊 Monthly summaries and overviews
- 🕒 Activity log — full audit trail of all changes

## Entity Structure

### Boarder
| Field | Type | Description |
|-------|------|-------------|
| name | string | Boarder's name |
| entry_date | string | Date they checked in |
| time_in | string | Time in |
| time_out | string | Time out |
| time_out_date | string | Date they checked out |
| status | string | paid / unpaid / partial |
| amount | number | Total amount due |
| amount_paid | number | Amount already paid |
| month_year | string | Billing month (e.g. 2026-03) |
| notes | string | Additional notes |

### Settings
| Field | Type | Description |
|-------|------|-------------|
| monthly_rate | number | Default monthly rate |
| currency | string | Currency symbol |
| summary_overrides | object | Custom summary config |

### Expense
| Field | Type | Description |
|-------|------|-------------|
| bill_name | string | Name of the bill/expense |
| date | string | Date of expense |
| amount | number | Expense amount |
| receipt_url | string | URL to receipt image |
| notes | string | Additional notes |
| month_year | string | Billing month |

### ActivityLog
| Field | Type | Description |
|-------|------|-------------|
| action | string | Action performed |
| entity_type | string | Which entity was affected |
| entity_id | string | ID of affected record |
| entity_name | string | Name of affected record |
| user_email | string | Who performed the action |
| amount | number | Amount involved |
| old_values | object | Previous values |
| new_values | object | New values |
| changes_summary | string | Human-readable summary |

## Getting Started

```bash
npm install
npm start
```

## Built With

- React 18
- React Router v6
- Lucide React (icons)
- Base44 Platform

## License

MIT
