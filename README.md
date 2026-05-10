# StockTrack - Inventory Management System

A desktop application for tracking raw material purchases, job work, polishing, and finished goods sales.

## Features

- **Raw Material Tracking** - Record purchases from vendors with batch numbers
- **Job Work Management** - Track material sent to job workers and pieces received
- **Polishing Orders** - Monitor polishing progress and completed goods
- **Sales Management** - Record sales with quick sale mode for walk-in customers
- **Master Data** - Manage vendors, job workers, polishers, and customers
- **Reports** - View stock levels, pending jobs, and export data
- **Offline First** - All data stored locally with SQLite
- **Data Backup** - Export/Import JSON backups

## Tech Stack

- **Electron** - Desktop framework
- **React** - UI framework
- **SQLite** - Local database
- **Webpack** - Build tooling

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run in development mode**
   ```bash
   npm start
   ```

   This will:
   - Start the webpack dev server
   - Launch the Electron app
   - Open DevTools automatically

3. **Build for Windows**
   ```bash
   npm run build
   ```

   The executable will be in the `release/` folder.

## Project Structure

```
Ayush-Software/
├── main.js              # Electron main process
├── preload.js           # Context bridge
├── inventory.db         # SQLite database (created on first run)
├── package.json
├── webpack.config.js
├── public/
│   └── index.html
└── src/
    ├── main/
    │   ├── database/
    │   │   ├── db.js           # Database connection
    │   │   └── migrations.js   # Schema
    │   ├── ipc/                # IPC handlers
    │   │   ├── vendors.js
    │   │   ├── jobWorkers.js
    │   │   ├── polishers.js
    │   │   ├── customers.js
    │   │   ├── materialTypes.js
    │   │   ├── rawMaterialInward.js
    │   │   ├── jobWorkOrders.js
    │   │   ├── polishingOrders.js
    │   │   ├── sales.js
    │   │   └── reports.js
    │   └── initDb.js           # DB initialization
    └── renderer/
        ├── App.jsx             # React app entry
        ├── index.jsx
        ├── App.css
        ├── index.css
        ├── hooks/
        │   └── useIPC.js       # IPC hook
        └── pages/
            ├── Dashboard.jsx
            ├── Vendors.jsx
            ├── JobWorkers.jsx
            ├── Polishers.jsx
            ├── Customers.jsx
            ├── MaterialTypes.jsx
            ├── RawMaterial.jsx
            ├── JobWork.jsx
            ├── Polishing.jsx
            ├── Sales.jsx
            ├── Reports.jsx
            └── Settings.jsx
```

## Usage Flow

1. **Setup Master Data** - Add vendors, job workers, polishers, customers, and material types
2. **Record Raw Material Purchase** - Enter inward entries with batch numbers
3. **Create Job Work Order** - Send material to job worker, receive pieces
4. **Create Polishing Order** - Send pieces to polisher, receive finished goods
5. **Record Sales** - Sell finished goods to customers
6. **View Reports** - Check stock levels and pending orders

## Database Schema

- `vendors` - Vendor information
- `job_workers` - Job worker details with payment rates
- `polishers` - Polisher details with payment rates
- `customers` - Customer information
- `material_types` - Material type definitions
- `raw_material_inward` - Purchase entries with batches
- `job_work_orders` - Job work tracking
- `polishing_orders` - Polishing tracking
- `sales` - Sales records
- `material_movements` - Audit trail (future)

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run in development mode |
| `npm run webpack:build` | Build webpack bundle |
| `npm run build` | Build Windows executable |
| `npm run build:mac` | Build macOS app |
| `npm run build:linux` | Build Linux app |

## Known Issues

- Node.js version warnings are safe to ignore (Electron uses embedded Node)
- First run may take a few seconds to initialize the database

## Next Steps (In Progress)

- [ ] Batch traceability reports
- [ ] Date range filtering on reports
- [ ] Material movement history
- [ ] CSV/Excel export
- [ ] Import data functionality
- [ ] Worker dues calculation

## License

ISC