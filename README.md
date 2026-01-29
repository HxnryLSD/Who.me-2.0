# Who.Me 2.0 🚀

<p align="center">
  <strong>Dein persönliches Dashboard – überall und auf jedem Gerät.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb" alt="MongoDB">
</p>

---

## 🌟 Was ist Who.Me?

Who.Me ist ein **cloud-basierter Dienst**, der die Standard-Startseite des Browsers in ein vollständig personalisierbares Dashboard verwandelt. Es dient als zentrale Kommandozentrale für das Web – geräte- und browserübergreifend synchronisiert.

> **Der Hauptvorteil:** Totale Unabhängigkeit. Da der Dienst in der Cloud läuft, sieht deine Startseite auf dem Arbeits-PC (Chrome), dem Heim-Laptop (Firefox) und dem Tablet (Safari) identisch aus.

---

## ✨ Features

### 📌 Widget-basiertes Dashboard
| Widget | Beschreibung |
|--------|--------------|
| **Bookmark Widget** | Einzelne Links mit Favicon, Screenshot-Vorschau & QR-Code |
| **Bookmark List** | Sortierbare Listen mit Drag & Drop, Tags & Kategorien |
| **Todo Widget** | Aufgabenlisten mit Checkboxen |
| **Note Widget** | Sticky Notes für schnelle Gedanken |
| **Clock Widget** | Weltzeituhr für verschiedene Zeitzonen |
| **Weather Widget** | Wettervorhersage |
| **RSS Widget** | Nachrichten-Feed Reader |

### 🎨 Personalisierung & Design
- **Hintergründe:** Eigene Bilder, kuratierte Galerien oder einfache Farben
- **Layout:** Anpassbare Spaltenanzahl & Widget-Transparenz
- **Themes:** Vordefinierte Theme-Presets (Ocean, Forest, Sunset, etc.)
- **Glassmorphism:** Moderner glassmorphism-Style für Widgets
- **Dark/Light Mode:** Automatisch oder manuell umschaltbar
- **Fonts:** Verschiedene Schriftarten zur Auswahl

### 🔄 Synchronisation & Multi-Device
- **Cloud Sync:** Echtzeit-Synchronisation zwischen allen Geräten
- **Multi-User System:** Benutzer-Authentifizierung mit Login/Registrierung
- **Automatische Backups:** Regelmäßige Auto-Backups mit Versionshistorie
- **Konfliktlösung:** Intelligente Conflict Resolution bei Sync-Konflikten
- **Öffentliche Profile:** Dashboards können öffentlich geteilt werden

### 📱 Responsive & PWA
- **Mobile-optimiert:** Funktioniert auf Desktop, Tablet und Smartphone
- **Progressive Web App:** Installierbar auf allen Geräten
- **Offline-Modus:** Service Worker für Offline-Funktionalität
- **Pull-to-Refresh:** Native mobile Gesten-Unterstützung

### 📥 Import & Export
- **Browser-Import:** Lesezeichen aus Chrome, Firefox, Edge importieren
- **JSON Export/Import:** Vollständiges Backup & Migration
- **HTML Bookmarks:** Standard-HTML-Bookmark-Dateien

---

## 🛠️ Tech Stack

### Frontend
| Technologie | Verwendung |
|-------------|------------|
| React 18 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| react-grid-layout | Drag & Drop Grid |
| Lucide React | Icons |
| date-fns | Datums-Formatierung |

### Backend
| Technologie | Verwendung |
|-------------|------------|
| Node.js | Runtime |
| Express | Web Framework |
| MongoDB | Datenbank |
| Mongoose | ODM |
| JWT | Authentifizierung |
| bcryptjs | Password Hashing |

---

## 🚀 Schnellstart

### Voraussetzungen
- **Node.js** v18 oder höher
- **MongoDB** (lokal oder [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd who.me-2.0

# Frontend-Dependencies installieren
npm install

# Backend-Dependencies installieren
cd backend
npm install
cd ..
```

### Konfiguration

1. **Backend konfigurieren** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whome-dashboard
JWT_SECRET=dein-super-geheimer-schluessel-mindestens-32-zeichen
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

2. **Frontend konfigurieren** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Starten

```bash
# Terminal 1: Backend starten
cd backend
npm run dev

# Terminal 2: Frontend starten
npm run dev
```

🌐 Öffne **http://localhost:5173** im Browser

> 📖 **Detaillierte Anleitung:** Siehe [SETUP.md](SETUP.md) für eine vollständige Schritt-für-Schritt-Anleitung inkl. MongoDB Atlas Setup.

---

## 📁 Projektstruktur

```
who.me-2.0/
├── src/                    # Frontend Source
│   ├── components/         # React Komponenten
│   │   └── widgets/        # Widget-Komponenten
│   ├── contexts/           # React Contexts (Auth, Sync)
│   ├── hooks/              # Custom Hooks
│   ├── pages/              # Seiten-Komponenten
│   ├── services/           # API Services
│   └── utils/              # Helper & Konstanten
├── backend/                # Backend API
│   ├── config/             # DB-Konfiguration
│   ├── controllers/        # Route Handler
│   ├── middleware/         # Auth Middleware
│   ├── models/             # Mongoose Models
│   └── routes/             # API Routes
└── public/                 # Statische Dateien
```

---

## 🌐 Als Browser-Startseite einrichten

### Chrome
Einstellungen → Beim Start → **Bestimmte Seite öffnen** → URL eingeben

### Firefox
Einstellungen → Startseite → **Benutzerdefinierte Adressen** → URL eingeben

### Edge
Einstellungen → Start, Startseite und neue Tabs → **Diese Seiten öffnen** → URL eingeben

---

## 📚 Dokumentation

| Dokument | Beschreibung |
|----------|--------------|
| [SETUP.md](SETUP.md) | Detaillierte Installations- und Setup-Anleitung |
| [PLANS.md](PLANS.md) | Entwicklungsplan & Feature-Roadmap |
| [SystemContext.md](SystemContext.md) | Architektur-Übersicht & Konzepte |
| [backend/README.md](backend/README.md) | Backend API Dokumentation |

---

## 🗺️ Roadmap

Siehe [PLANS.md](PLANS.md) für die vollständige Feature-Roadmap. Highlights:

- [ ] Keyboard Shortcuts
- [ ] Global Search über alle Widgets
- [ ] Weitere Widgets: Kalender, Pomodoro, Spotify, GitHub, etc.
- [ ] Browser Extension für Quick-Add
- [ ] TypeScript Migration
- [ ] Docker Support

---

## 🤝 Contributing

Beiträge sind willkommen! Bitte lies zuerst [PLANS.md](PLANS.md) um zu sehen, welche Features geplant sind.

---

## 📄 Lizenz

MIT License – siehe [LICENSE](LICENSE) für Details.

---

<p align="center">
  <strong>Made with ❤️ for a better browsing experience</strong>
</p>
