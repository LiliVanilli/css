# Device Sensor Data Collection Web Application

A web application that collects device sensor data including orientation, accelerometer, and gyroscope measurements with support for both local storage and cloud-based data collection.

## Features

- **Form Input**: Text field for context and toggle switch for data collection
- **Multi-Sensor Tracking**: Real-time data from orientation, accelerometer, and gyroscope sensors
- **Dual Storage Mode**: Choose between local storage with CSV export or EdgeML cloud integration
- **Data Export**: Download collected data as CSV files for offline analysis
- **Python Analysis Tools**: Included scripts for statistical analysis and visualization
- **Mobile Optimized**: Full iOS and Android support with permission handling
- **Responsive Design**: Clean gradient UI that works on all devices
- **HTTPS Deployment**: Secure hosting via GitHub Pages

## Prerequisites

- Node.js (v14 or higher)
- NPM (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for EdgeML data upload

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/LiliVanilli/css.git
cd css
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`, including:
- `edge-ml`: Library for connecting to EdgeML platform

### 3. Open the webpage

You can open the webpage in several ways:

**Option A: Direct file opening**
```bash
open index.html
```

**Option B: Using a local server**
```bash
# Install a simple HTTP server globally (only needed once)
npm install -g http-server

# Start the server
http-server

# Then open http://localhost:8080 in your browser
```

**Option C: Live on GitHub Pages**
Visit: https://lilivanilli.github.io/css/


## How to Use

### Web Interface

1. **Open the webpage** at https://lilivanilli.github.io/css/
2. **Select storage mode**: Choose between "Local Storage" or "EdgeML Cloud"
3. **Enter context** in the text field (e.g., "walking", "sitting", "running")
4. **Toggle the switch ON** to start sensor data collection
5. **Move your device** - tilt, rotate, walk around
6. **Watch real-time data** showing all sensor values:
   - Orientation: Alpha, Beta, Gamma
   - Accelerometer: X, Y, Z acceleration
   - Gyroscope: X, Y, Z rotation rates
7. **Toggle OFF** to stop collection
8. **Export CSV** (local mode only) to download your data

### Mobile Testing

For detailed sensor debugging on mobile devices, visit:
https://lilivanilli.github.io/css/mobile-debug.html

This page provides:
- Sensor API support detection
- Permission status monitoring
- Live event logging
- Troubleshooting information

### Testing in Chrome DevTools

1. Open DevTools: `Cmd + Option + I` (Mac) or `F12` (Windows/Linux)
2. Click **⋮** (three dots) → **More tools** → **Sensors**
3. In the Sensors panel, select "Orientation"
4. Toggle your switch ON and manipulate the 3D phone model
5. Watch the values update in real-time!

## Project Structure

```
css/
├── index.html              # Main HTML structure with sensor display
├── mobile-debug.html       # Mobile sensor debugging interface
├── styles.css              # All styling and animations
├── script.js               # JavaScript logic and sensor handling
├── edge-ml.js             # EdgeML library (local copy)
├── analyze_sensors.py      # Python data analysis script
├── test_data.csv          # Sample sensor data for testing
├── requirements.txt        # Python dependencies
├── package.json           # NPM dependencies and project info
├── package-lock.json      # Locked versions of dependencies
├── node_modules/          # Installed NPM packages (auto-generated)
└── README.md             # This file
```

## HTTPS Deployment

This project is deployed on GitHub Pages with automatic HTTPS:
- URL: https://lilivanilli.github.io/css/
- Certificate: Automatically provided by GitHub (Let's Encrypt)

## Technologies Used

### Frontend
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, gradients, animations
- **JavaScript (ES6+)**: Device APIs and sensor event handling
- **Device Orientation API**: Compass and tilt measurements
- **Device Motion API**: Accelerometer and gyroscope data
- **EdgeML Library**: Optional cloud data collection

### Backend & Analysis
- **Python 3**: Data analysis and visualization
- **Pandas**: Data manipulation and statistics
- **Matplotlib**: Plot generation
- **NumPy**: Mathematical operations

### Deployment
- **GitHub Pages**: HTTPS hosting with automatic SSL
- **Git**: Version control

## Sensor Data Explained

### Device Orientation

Measures the device's rotation in 3D space:

- **Alpha (Z-axis)**: Compass direction (0 to 360 degrees)
  - 0 = North
  - 90 = East
  - 180 = South
  - 270 = West

- **Beta (X-axis)**: Front-to-back tilt (-180 to 180 degrees)
  - 0 = Flat on surface
  - 90 = Standing upright (screen facing you)
  - -90 = Upside down

- **Gamma (Y-axis)**: Left-to-right tilt (-90 to 90 degrees)
  - 0 = Flat on surface
  - 90 = Tilted to the right
  - -90 = Tilted to the left

### Accelerometer

Measures linear acceleration along each axis (m/s²):

- **X-axis**: Side-to-side movement
  - Positive = Acceleration to the right
  - Negative = Acceleration to the left

- **Y-axis**: Forward-backward movement
  - Positive = Acceleration forward
  - Negative = Acceleration backward

- **Z-axis**: Up-down movement
  - Positive = Acceleration upward
  - Negative = Acceleration downward
  - At rest: approximately 9.81 m/s² (gravity)

### Gyroscope

Measures rotation rate around each axis (degrees/second):

- **X-axis (Alpha)**: Rotation around the X-axis
  - Rolling motion (tilting screen forward/backward)

- **Y-axis (Beta)**: Rotation around the Y-axis
  - Pitching motion (tilting screen left/right)

- **Z-axis (Gamma)**: Rotation around the Z-axis
  - Yawing motion (spinning like a compass)

## Data Analysis

### Using Python Analysis Script

```bash
# Install dependencies
pip install -r requirements.txt

# Analyze your collected data
python analyze_sensors.py your_sensor_data.csv

# Test with sample data
python analyze_sensors.py test_data.csv
```

The analysis script generates:
- Statistical summaries (mean, std, min, max)
- Time-series plots for each sensor
- Magnitude plots for accelerometer data
- All plots saved to `plots/` directory

See `ANALYSIS.md` for detailed documentation.

## Troubleshooting

**Sensors not working on mobile?**
- HTTPS is required for sensor access (automatically provided by GitHub Pages)
- On iOS 13+, you must grant permission when prompted
- Check if your browser supports the sensor APIs
- Use the mobile debug page for detailed diagnostics

**No data being collected?**
- Ensure the toggle switch is ON
- Check browser console for error messages
- Verify sensor permissions are granted
- Try the mobile-debug.html page to test sensor availability

**CSV export not working?**
- Make sure you're using "Local Storage" mode
- Collect some data before clicking export
- Check if pop-up blockers are interfering

**Python analysis fails?**
- Verify Python 3 is installed: `python3 --version`
- Install dependencies: `pip install -r requirements.txt`
- Check CSV file format matches expected structure
- Ensure pandas, matplotlib, and numpy are installed

**npm install fails?**
- Check Node.js version: `node --version` (need v14+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry

**Page not updating on GitHub Pages?**
- Wait 1-2 minutes after pushing changes
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Try incognito/private browsing mode

## License

MIT License

## Author

LiliVanilli
