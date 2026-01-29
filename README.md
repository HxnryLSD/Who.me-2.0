# Who.Me Dashboard

Ein modernes, personalisiertes Dashboard für Browser, das als Ersatz für die Standard-Startseite dient.

## Features

- 📌 **Widget-basierte Organisation**: Lesezeichen, To-Do-Listen, Notizen, RSS-Feeds und mehr
- 🎨 **Vollständig anpassbar**: Hintergründe, Farben, Dark Mode
- 🔄 **Drag & Drop**: Intuitive Anordnung aller Widgets
- 📱 **Responsive**: Funktioniert auf Desktop, Tablet und Mobile
- 💾 **LocalStorage**: Alle Daten werden lokal im Browser gespeichert
- 📥 **Import/Export**: Backup und Migration Ihrer Daten
- 🌐 **Browser-Lesezeichen Import**: Importieren Sie Ihre Lesezeichen aus Chrome, Firefox, Edge

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build
```

## Verwendung

1. Öffnen Sie `http://localhost:3000` nach dem Start des Dev-Servers
2. Klicken Sie auf das **+** Icon, um ein neues Widget hinzuzufügen
3. Wählen Sie einen Widget-Typ und konfigurieren Sie es
4. Verschieben Sie Widgets per Drag & Drop
5. Ändern Sie die Größe durch Ziehen an den Ecken

## Widget-Typen

- **Lesezeichen-Liste**: Verwalten Sie Ihre wichtigsten Links
- **Aufgabenliste**: To-Do-Listen mit Checkboxen
- **Notizen**: Haftnotizen für schnelle Gedanken
- **Uhr**: Weltzeituhr für verschiedene Zeitzonen
- **Wetter**: Wettervorhersage (Demo-Daten)
- **RSS-Feed**: Nachrichten-Feed Reader (Demo)

## Technologien

- React 18
- Vite
- Tailwind CSS
- react-grid-layout
- lucide-react (Icons)
- date-fns (Datums-Formatierung)

## Browser als Startseite einrichten

### Chrome
1. Einstellungen → Beim Start → Bestimmte Seite öffnen
2. URL eingeben: `http://localhost:3000` (Dev) oder Ihre gehostete URL

### Firefox
1. Einstellungen → Startseite → Benutzerdefinierte Adressen
2. URL eingeben: `http://localhost:3000` (Dev) oder Ihre gehostete URL

### Edge
1. Einstellungen → Start, Startseite und neue Tabs → Diese Seiten öffnen
2. URL eingeben: `http://localhost:3000` (Dev) oder Ihre gehostete URL

## Lizenz

MIT
