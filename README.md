# MegaCare — Local Development Setup

## Prerequisites
| Tool | Minimum version |
|------|----------------|
| Node.js | 18 |
| npm | 9 |
| MongoDB | 6 (local) **or** a MongoDB Atlas URI |
| MongoDB Database Tools | 100+ (`mongodump` / `mongorestore`) |

> Install MongoDB Database Tools:  
> **macOS** — `brew install mongodb/brew/mongodb-database-tools`  
> **Ubuntu** — `sudo apt install mongodb-database-tools`  
> **Windows** — https://www.mongodb.com/try/download/database-tools

---

## 1 — Clone & install dependencies

```bash
git clone <repo-url>
cd MegaCare

# Install root dev tooling (concurrently, etc.)
npm install

# Install backend and frontend dependencies
npm run install:all
```

---

## 2 — Configure environment variables

### Backend (`backend/.env`)
Copy the example and fill in the required values:
```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | no | Backend port (default: `5000`) |
| `FRONTEND_URL` | yes | Exact URL of the frontend dev server, used for CORS. Default: `http://localhost:5173` |
| `JWT_SECRET` | yes | ≥64 random characters. Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `MONGO_URI` | yes | MongoDB connection string. Local default: `mongodb://localhost:27017/megacare` |

### Frontend (`frontend/.env`)  *(optional)*
Only needed if the backend is **not** on `http://localhost:5000`:
```bash
cp frontend/.env.example frontend/.env
# Then set VITE_API_URL to point at your backend
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | no | Backend base URL. Default: `http://localhost:5000` |

> **How the frontend talks to the backend:** Vite's dev server proxies `/api`, `/uploads`, and `/socket.io` to `VITE_API_URL`, so the React code never needs to know the backend address directly.

---

## 3 — Start the services

### Option A — Both services in one terminal
```bash
npm run dev
```
Starts backend and frontend concurrently with colour-coded output.

### Option B — Separate terminals (recommended for active development)

**Terminal 1 — Backend**
```bash
cd backend
npm run dev          # nodemon, auto-restarts on file changes
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev          # Vite dev server with HMR
```

### Available URLs once running
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Uploaded files | http://localhost:5000/uploads |

---

## 4 — Production build

```bash
# Build the frontend bundle
cd frontend && npm run build

# Start the backend in production mode
cd ../backend && npm start
```

---

## 5 — Database: export & restore

The repository ships with a complete, ready-to-restore database dump at
`backend/dump/megacare/` (gzip-compressed BSON, ~444 KB).  
It reflects the exact test users documented in [USERS.md](USERS.md).

### Restore on a fresh machine (recommended)

This is the fastest path — no seeding scripts needed:

```bash
# 1. Copy your env file (if not done already)
cp backend/.env.example backend/.env
# Edit backend/.env and set MONGO_URI, JWT_SECRET, etc.

# 2. Restore the database (preserves existing data)
npm run db:restore

# 3. Restore and wipe any existing data first
npm run db:restore:drop
```

`npm run db:restore` wraps the following `mongorestore` command:

```bash
mongorestore \
  --uri="mongodb://localhost:27017/megacare" \
  --gzip \
  --dir="backend/dump/megacare" \
  --nsInclude="megacare.*"
```

### Alternative: seed from scratch

If you prefer to regenerate data rather than restoring the dump:

```bash
cd backend
npm run dev      # seed.js runs automatically on first startup
# Then run the two one-off account scripts:
node src/create-lab-accounts.js
node src/create-establishment-accounts.js
```

### Re-export (after data changes)

To update the committed dump after making data changes:

```bash
mongodump \
  --uri="mongodb://localhost:27017/megacare" \
  --out="backend/dump" \
  --gzip
```

Then commit the updated dump files.

### Restore to MongoDB Atlas

```bash
# Replace the URI with your Atlas connection string
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/megacare" \
  node backend/db-restore.js --drop
```
