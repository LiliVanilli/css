# Sensor Data Analysis

Dieses Projekt sammelt und analysiert Sensor-Daten von mobilen Geräten.

## Daten sammeln

### Option 1: Lokale Datensammlung
Lokalen Modus:

1. Öffne https://lilivanilli.github.io/css/
2. Wähle **"Local Storage"** im Dropdown
3. Gib einen Context ein (z.B. "walking", "sitting", "running")
4. Aktiviere den Toggle-Switch
5. Bewege/drehe dein Handy
6. Deaktiviere den Toggle
7. Klicke **"Export CSV"** um die Daten herunterzuladen

### Option 2: EdgeML Cloud
- Server: app.edge-ml.org
- Status: SSL-Zertifikat abgelaufen (3. Juni 2025)
- Write Key: 5fe6e50c3fb5001531bbd8e03a8c591f
- Read Key: 02a4fad735d3308b68672ddb7593f047

## Daten analysieren

### Python-Analyse installieren

```bash
# Python-Pakete installieren
pip install pandas matplotlib numpy

# Oder mit requirements.txt:
pip install -r requirements.txt
```

### CSV-Daten analysieren

```bash
# Analyse durchführen
python analyze_sensors.py sensor_data_walking_2025-10-14.csv
```

Das Script erstellt:
- **Statistiken** (Mean, Std, Min, Max für alle Sensoren)
- **Plots** im `plots/` Ordner:
  - `orientation_*.png` - Alpha, Beta, Gamma über Zeit
  - `accelerometer_*.png` - X, Y, Z Beschleunigung
  - `gyroscope_*.png` - X, Y, Z Rotation
  - `magnitude_*.png` - Gesamtbeschleunigung

## Mobile Testing

### Debug-Seite für iOS/Android
https://lilivanilli.github.io/css/mobile-debug.html

Diese Seite zeigt:
- ✓ Welche Sensor-APIs unterstützt werden
- ✓ Ob Permissions erteilt wurden
- ✓ Live-Sensor-Werte
- ✓ Detailliertes Event-Logging

## Dateistruktur

```
.
├── index.html              # Hauptseite mit Formular
├── mobile-debug.html       # Debug-Seite für Mobile
├── script.js              # Sensor-Logik und Datensammlung
├── styles.css             # Styling
├── edge-ml.js             # EdgeML Library (lokal)
├── analyze_sensors.py     # Python Analyse-Script
└── requirements.txt       # Python Dependencies
```

## Features

- Device Orientation (Alpha, Beta, Gamma)
- Accelerometer (X, Y, Z)
- Gyroscope (X, Y, Z)
- Lokale Datenspeicherung
- CSV Export
- EdgeML Cloud Integration (wenn Server verfügbar)
- iOS 13+ Permission Handling
- HTTPS via GitHub Pages

## Verwendungszweck

Dieses Projekt wurde für das Sammeln von Sensor-Daten erstellt, um verschiedene Aktivitäten zu erkennen:
- Gehen (walking)
- Sitzen (sitting)
- Laufen (running)
- Treppensteigen (stairs)
- etc.

Die gesammelten Daten können für Machine Learning oder Datenanalyse verwendet werden.
