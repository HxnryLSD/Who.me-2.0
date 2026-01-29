# Setup Anleitung für Who.Me 2.0

## Übersicht
Diese Anleitung führt Sie durch die vollständige Einrichtung des Who.Me Bookmark Manager Dashboards mit Backend und Datenbank.

---

## Voraussetzungen

### Erforderliche Software
1. **Node.js** (v16 oder höher) - [Download](https://nodejs.org/)
2. **MongoDB** - Wählen Sie eine Option:
   - **Option A: MongoDB Atlas (Cloud - Empfohlen für Anfänger)**
     - Kostenlos für kleine Projekte
     - Keine lokale Installation nötig
     - [Registrieren Sie sich hier](https://www.mongodb.com/cloud/atlas/register)
   
   - **Option B: MongoDB lokal (Fortgeschritten)**
     - [Download für Windows](https://www.mongodb.com/try/download/community)
     - [Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

3. **Git** - [Download](https://git-scm.com/)

---

## Schritt 1: MongoDB einrichten

### Option A: MongoDB Atlas (Cloud)

1. **Account erstellen**
   - Gehen Sie zu [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Registrieren Sie sich kostenlos

2. **Cluster erstellen**
   - Wählen Sie "Create a FREE cluster"
   - Wählen Sie einen Cloud Provider (AWS empfohlen)
   - Wählen Sie eine Region (z.B. Frankfurt)
   - Klicken Sie auf "Create Cluster"

3. **Datenbankbenutzer erstellen**
   - Gehen Sie zu "Database Access"
   - Klicken Sie "Add New Database User"
   - Wählen Sie "Password" als Authentication Method
   - Erstellen Sie einen Benutzernamen und Passwort (MERKEN SIE SICH DIESE!)
   - Setzen Sie "Database User Privileges" auf "Read and write to any database"
   - Klicken Sie "Add User"

4. **Netzwerkzugriff konfigurieren**
   - Gehen Sie zu "Network Access"
   - Klicken Sie "Add IP Address"
   - Wählen Sie "Allow Access from Anywhere" (für Entwicklung)
   - Klicken Sie "Confirm"

5. **Connection String erhalten**
   - Gehen Sie zurück zu "Database" → "Clusters"
   - Klicken Sie auf "Connect"
   - Wählen Sie "Connect your application"
   - Kopieren Sie den Connection String (sieht aus wie: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/...`)
   - **WICHTIG**: Ersetzen Sie `<password>` mit Ihrem echten Passwort
   - **WICHTIG**: Ersetzen Sie `myFirstDatabase` mit `whome` (oder Ihrem gewünschten Datenbanknamen)

### Option B: MongoDB lokal

1. **Installation**
   - Laden Sie MongoDB Community Server herunter
   - Führen Sie das Installationsprogramm aus
   - Wählen Sie "Complete" Installation
   - Installieren Sie MongoDB als Windows Service
   - Installieren Sie optional MongoDB Compass (GUI Tool)

2. **Starten Sie MongoDB**
   - MongoDB sollte automatisch als Service laufen
   - Überprüfen Sie im Task Manager unter "Services"
   - Oder starten Sie manuell: `net start MongoDB`

3. **Connection String**
   - Für lokale Installation: `mongodb://localhost:27017/whome`

---

## Schritt 2: Backend einrichten

1. **Öffnen Sie ein Terminal** im Projektordner

2. **Wechseln Sie ins Backend-Verzeichnis**
   ```powershell
   cd backend
   ```

3. **Installieren Sie die Abhängigkeiten**
   ```powershell
   npm install
   ```

4. **Konfigurieren Sie die Umgebungsvariablen**
   - Öffnen Sie die Datei `backend/.env`
   - Passen Sie die Werte an:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/whome
     JWT_SECRET=ihr-super-geheimer-schlüssel-hier-mindestens-32-zeichen-lang
     NODE_ENV=development
     CORS_ORIGIN=http://localhost:5173
     ```
   
   **WICHTIG:**
   - Ersetzen Sie `MONGODB_URI` mit Ihrem Connection String aus Schritt 1
   - Ändern Sie `JWT_SECRET` zu einem langen, zufälligen String (mindestens 32 Zeichen)
   - Nutzen Sie z.B. einen Password Generator für JWT_SECRET

5. **Starten Sie den Backend-Server**
   ```powershell
   npm run dev
   ```
   
   Sie sollten sehen:
   ```
   🚀 Server läuft auf Port 5000
   ✅ MongoDB verbunden: <Ihre DB Info>
   ```

---

## Schritt 3: Frontend einrichten

1. **Öffnen Sie ein NEUES Terminal** (lassen Sie das Backend-Terminal laufen!)

2. **Wechseln Sie zurück zum Hauptverzeichnis**
   ```powershell
   cd ..
   ```

3. **Installieren Sie die Frontend-Abhängigkeiten** (falls nicht bereits geschehen)
   ```powershell
   npm install
   ```

4. **Überprüfen Sie die Frontend-Konfiguration**
   - Öffnen Sie die Datei `.env` im Hauptverzeichnis
   - Sollte enthalten:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

5. **Starten Sie das Frontend**
   ```powershell
   npm run dev
   ```
   
   Sie sollten sehen:
   ```
   VITE v5.4.21  ready in XXX ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

---

## Schritt 4: Testen Sie die Anwendung

1. **Öffnen Sie Ihren Browser**
   - Gehen Sie zu: http://localhost:5173

2. **Registrieren Sie einen Account**
   - Klicken Sie auf "Registrieren"
   - Füllen Sie das Formular aus
   - Klicken Sie "Registrieren"

3. **Erstellen Sie Ihr Dashboard**
   - Nach erfolgreicher Registrierung werden Sie eingeloggt
   - Fügen Sie Widgets hinzu
   - Ändern Sie Einstellungen
   - Ihre Änderungen werden automatisch gespeichert!

4. **Testen Sie öffentliche Profile**
   - Gehen Sie zu Ihren Einstellungen
   - Aktivieren Sie "Öffentliches Dashboard"
   - Loggen Sie sich aus
   - Gehen Sie zu "Entdecken" - Sie sollten Ihr Profil sehen

---

## Schritt 5: Troubleshooting

### Backend startet nicht
- **Problem**: `Error: connect ECONNREFUSED`
  - **Lösung**: MongoDB läuft nicht. Starten Sie MongoDB Service oder prüfen Sie Atlas Connection String

- **Problem**: `MongooseError: The `uri` parameter to `openUri()` must be a string`
  - **Lösung**: Prüfen Sie `MONGODB_URI` in `.env` - muss ein gültiger Connection String sein

- **Problem**: `JWT_SECRET is required`
  - **Lösung**: Fügen Sie `JWT_SECRET` in `backend/.env` hinzu

### Frontend kann nicht mit Backend kommunizieren
- **Problem**: Netzwerkfehler in Browser Console
  - **Lösung**: 
    1. Prüfen Sie, ob Backend läuft (http://localhost:5000/api/)
    2. Prüfen Sie CORS-Einstellungen in `backend/server.js`
    3. Prüfen Sie `VITE_API_URL` in `.env`

### Registrierung funktioniert nicht
- **Problem**: "Email already exists"
  - **Lösung**: Diese Email ist bereits registriert - nutzen Sie eine andere oder loggen Sie sich ein

- **Problem**: "Validation failed"
  - **Lösung**: Prüfen Sie, ob alle Felder korrekt ausgefüllt sind (Email-Format, Passwort mind. 6 Zeichen)

### Dashboard wird nicht geladen
- **Problem**: Dashboard bleibt bei "Lädt..."
  - **Lösung**: 
    1. Prüfen Sie Browser Console auf Fehler
    2. Prüfen Sie Backend Terminal auf Fehler
    3. Loggen Sie sich aus und wieder ein

---

## Produktionsbereitstellung

Wenn Sie die Anwendung öffentlich bereitstellen möchten:

1. **Backend auf einem Server hosten** (z.B. Heroku, DigitalOcean, Railway)
2. **Frontend builden und hosten** (z.B. Vercel, Netlify)
3. **Umgebungsvariablen aktualisieren**:
   - `CORS_ORIGIN` auf Ihre Frontend-URL setzen
   - `VITE_API_URL` auf Ihre Backend-URL setzen
   - `NODE_ENV=production` setzen
4. **JWT_SECRET ändern** zu einem neuen, sicheren Wert
5. **MongoDB Atlas nutzen** (empfohlen für Produktion)

---

## Hilfreiche Befehle

### Backend
```powershell
cd backend
npm run dev      # Entwicklungsserver mit Nodemon
npm start        # Produktionsserver
```

### Frontend
```powershell
npm run dev      # Entwicklungsserver
npm run build    # Production Build
npm run preview  # Preview des Production Builds
```

### Beide gleichzeitig (Optional - erfordert zusätzliches Setup)
```powershell
# In einem Terminal:
npm run dev

# In einem anderen Terminal:
cd backend && npm run dev
```

---

## Weiterführende Ressourcen

- [MongoDB Atlas Dokumentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Dokumentation](https://react.dev/)
- [Vite Dokumentation](https://vitejs.dev/)
- [JWT Best Practices](https://jwt.io/introduction)

---

## Support

Bei Problemen:
1. Überprüfen Sie die Browser Console (F12)
2. Überprüfen Sie die Terminal-Ausgaben (Frontend & Backend)
3. Überprüfen Sie die `.env` Dateien
4. Lesen Sie die Fehlermeldungen sorgfältig

---

**Viel Erfolg mit Who.Me 2.0! 🚀**
