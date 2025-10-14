# Form with Device Orientation Tracking & EdgeML Integration

A web application that collects device orientation data and sends it to EdgeML platform for analysis.

## 🌟 Features

- **Form Input**: Text field for context and toggle switch
- **Device Orientation Tracking**: Real-time alpha, beta, gamma measurements
- **EdgeML Integration**: Automatic data upload to beta.edgeml.org
- **Responsive Design**: Beautiful gradient UI that works on all devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- NPM (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for EdgeML data upload

## 🚀 Installation

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

**Option B: Using a local server (recommended for development)**
```bash
# Install a simple HTTP server globally (only needed once)
npm install -g http-server

# Start the server
http-server

# Then open http://localhost:8080 in your browser
```

**Option C: Live on GitHub Pages**
Visit: https://lilivanilli.github.io/css/

## 🔧 Configuration

The EdgeML connection is configured with the following credentials:
- **Server**: beta.edgeml.org
- **Username**: css25
- **Password**: css25
- **Write Key**: `5fe6e50c3fb5001531bbd8e03a8c591f`

These are hardcoded in `script.js` for the demo. For production, consider using environment variables.

## 📱 How to Use

1. **Open the webpage** in your browser
2. **Enter context** in the text field (optional)
3. **Toggle the switch ON** to start device orientation tracking
4. **Tilt your device** (or use Chrome DevTools Sensors to simulate)
5. **Watch the real-time data** display alpha, beta, gamma values
6. **Submit the form** to see your input summary

### Testing in Chrome DevTools

1. Open DevTools: `Cmd + Option + I` (Mac) or `F12` (Windows/Linux)
2. Click **⋮** (three dots) → **More tools** → **Sensors**
3. In the Sensors panel, select "Orientation"
4. Toggle your switch ON and manipulate the 3D phone model
5. Watch the values update in real-time!

## 📁 Project Structure

```
css/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # JavaScript logic and EdgeML integration
├── package.json        # NPM dependencies and project info
├── package-lock.json   # Locked versions of dependencies
├── node_modules/       # Installed NPM packages (auto-generated)
└── README.md          # This file
```

## 🔐 HTTPS Deployment

This project is deployed on GitHub Pages with automatic HTTPS:
- URL: https://lilivanilli.github.io/css/
- Certificate: Automatically provided by GitHub (Let's Encrypt)

## 📚 Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, gradients, animations
- **JavaScript (ES6+)**: Device APIs and data handling
- **EdgeML**: Data collection and analysis platform
- **GitHub Pages**: Free HTTPS hosting

## 🔍 Device Orientation Explained

- **Alpha (Z-axis)**: Compass direction (0° to 360°)
  - 0° = North, 90° = East, 180° = South, 270° = West
  
- **Beta (X-axis)**: Front-to-back tilt (-180° to 180°)
  - 0° = Flat, 90° = Standing up, -90° = Upside down
  
- **Gamma (Y-axis)**: Left-to-right tilt (-90° to 90°)
  - 0° = Flat, 90° = Tilted right, -90° = Tilted left

## 🐛 Troubleshooting

**Device orientation not working?**
- Ensure you're using HTTPS (required for sensor access)
- Check browser console for errors
- On iOS, you may need to grant permission for motion sensors

**npm install fails?**
- Check your Node.js version: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and try again

**Page not updating on GitHub Pages?**
- Wait 1-2 minutes after pushing changes
- Clear browser cache or use incognito mode

## 📄 License

MIT License - Feel free to use this project for learning or personal projects.

## 👤 Author

LiliVanilli

## 🤝 Contributing

Feel free to fork this project and submit pull requests!
