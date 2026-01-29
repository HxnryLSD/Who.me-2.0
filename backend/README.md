# Who.Me Backend

Backend API für die Who.Me Dashboard Anwendung.

## Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- MongoDB (lokal oder MongoDB Atlas)

### Installation

1. Navigiere zum Backend-Ordner:
```bash
cd backend
```

2. Installiere Dependencies:
```bash
npm install
```

3. Erstelle `.env` Datei:
```bash
cp .env.example .env
```

4. Passe die `.env` Datei an:
- `MONGODB_URI`: Deine MongoDB Connection String
- `JWT_SECRET`: Ein sicherer, zufälliger String
- `PORT`: Backend Port (Standard: 5000)
- `CORS_ORIGIN`: Frontend URL (Standard: http://localhost:5173)

### MongoDB Setup

**Option 1: Lokale MongoDB**
1. Installiere MongoDB: https://www.mongodb.com/try/download/community
2. Starte MongoDB Service
3. Connection String: `mongodb://localhost:27017/whome-dashboard`

**Option 2: MongoDB Atlas (Cloud)**
1. Erstelle kostenloses Konto: https://www.mongodb.com/cloud/atlas/register
2. Erstelle Cluster
3. Hole Connection String aus "Connect" → "Connect your application"
4. Ersetze `<password>` und `<dbname>` in der Connection String

### Entwicklung starten

```bash
npm run dev
```

Server läuft auf: `http://localhost:5000`

### API Testen

Health Check:
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Aktueller User (Protected)
- `PUT /api/auth/profile` - Profil aktualisieren (Protected)

### Users
- `GET /api/users/public` - Alle öffentlichen User

### Dashboards
- `GET /api/dashboards/me` - Eigenes Dashboard (Protected)
- `POST /api/dashboards` - Dashboard erstellen/aktualisieren (Protected)
- `PUT /api/dashboards` - Dashboard aktualisieren (Protected)
- `GET /api/dashboards/public/:username` - Öffentliches Dashboard

## Technologie-Stack

- **Express** - Web Framework
- **MongoDB & Mongoose** - Datenbank
- **JWT** - Authentifizierung
- **bcryptjs** - Password Hashing
- **express-validator** - Input Validation
- **cors** - CORS Support
- **dotenv** - Environment Variables

## Projekt-Struktur

```
backend/
├── config/          # Konfigurationsdateien
│   └── db.js       # MongoDB Verbindung
├── controllers/     # Route Handler
│   ├── authController.js
│   ├── dashboardController.js
│   └── userController.js
├── middleware/      # Custom Middleware
│   └── auth.js     # JWT Auth Middleware
├── models/          # Mongoose Models
│   ├── User.js
│   └── Dashboard.js
├── routes/          # API Routes
│   ├── auth.js
│   ├── dashboards.js
│   └── users.js
├── .env            # Environment Variables (nicht in Git!)
├── .env.example    # Environment Template
├── server.js       # Entry Point
└── package.json    # Dependencies
```

## Nächste Schritte

Nach dem Backend-Setup:
1. Frontend API Integration (Teil 5)
2. Password Reset & Email (Teil 6)
3. Production Deployment

## Sicherheit

⚠️ **Wichtig für Production:**
- Ändere `JWT_SECRET` zu einem starken, zufälligen String
- Aktiviere HTTPS
- Implementiere Rate Limiting
- Setze sichere HTTP Headers (helmet.js)
- Validiere alle Inputs
- Implementiere CSRF Protection
