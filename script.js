// ========================================
// WAIT FOR EDGEML LIBRARY TO LOAD
// ========================================
console.log('Checking EdgeML library...');
if (typeof edgeML !== 'undefined') {
    console.log('EdgeML library is available');
    console.log('EdgeML object:', edgeML);
} else {
    console.warn('EdgeML library not yet loaded. It should load from CDN.');
}

// Get form and output elements
// Purpose: Makes the form interactive
const form = document.getElementById('myForm');
const output = document.getElementById('output');
const contextInput = document.getElementById('context');
const toggleSwitch = document.getElementById('toggleSwitch');
const storageModeSelect = document.getElementById('storageMode');
const storageModeDisplay = document.getElementById('storage-mode-display');
const dataCountDisplay = document.getElementById('data-count');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

// Add event listener for form submission
form.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the values from the form
    const contextValue = contextInput.value;
    const toggleValue = toggleSwitch.checked;
    
    // Display the form data
    displayFormData(contextValue, toggleValue);
});

// Function to display the submitted form data
function displayFormData(context, toggleState) {
    // Create the HTML to display
    const toggleText = toggleState ? 'ON' : 'OFF';
    const toggleColor = toggleState ? '#4CAF50' : '#f44336';
    
    output.innerHTML = `
        <h3>Form Submitted!</h3>
        <p><strong>Context:</strong> ${context || '(empty)'}</p>
        <p><strong>Toggle Status:</strong> <span style="color: ${toggleColor}; font-weight: bold;">${toggleText}</span></p>
    `;
    
    // Show the output area
    output.classList.add('show');
    
    // Log to console as well
    console.log('Form Data:', {
        context: context,
        toggleSwitch: toggleState
    });
}

// ========================================
// DATA COLLECTION CONFIGURATION
// ========================================

// Local data storage
let sensorDataBuffer = [];
let collectionStartTime = null;
let currentContext = '';
let storageMode = 'local';  // 'local' or 'edgeml'

// EdgeML connection settings
const EDGEML_CONFIG = {
    backendUrl: 'https://app.edge-ml.org',
    deviceApiKey: '5fe6e50c3fb5001531bbd8e03a8c591f',
    username: 'css25',
    password: 'css25'
};

let edgeMLCollector = null;

// Update storage mode when user changes selection
storageModeSelect.addEventListener('change', function() {
    storageMode = this.value;
    storageModeDisplay.textContent = storageMode === 'local' ? 'Local Storage' : 'EdgeML Cloud';
    console.log('Storage mode changed to:', storageMode);
});

// ========================================
// DEVICE ORIENTATION FEATURE
// Measures device tilt/rotation (like a compass)
// Returns angles: alpha (compass), beta (front-to-back), gamma (left-to-right)
// Easier to test in Chrome DevTools (can be simulated)
// Good for: detecting how phone is tilted
// ========================================

// Get orientation display elements
const orientationStatus = document.getElementById('orientation-status');
const alphaDisplay = document.getElementById('alpha');
const betaDisplay = document.getElementById('beta');
const gammaDisplay = document.getElementById('gamma');
const accelXDisplay = document.getElementById('accel-x');
const accelYDisplay = document.getElementById('accel-y');
const accelZDisplay = document.getElementById('accel-z');
const gyroXDisplay = document.getElementById('gyro-x');
const gyroYDisplay = document.getElementById('gyro-y');
const gyroZDisplay = document.getElementById('gyro-z');

// Variable to track if orientation listening is active
let isOrientationActive = false;

// Variables for additional sensors
let accelerometerData = { x: 0, y: 0, z: 0 };
let gyroscopeData = { x: 0, y: 0, z: 0 };
let dataPointCounter = 0;

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================

function saveDataPointLocally(timestamp, sensorType, x, y, z) {
    sensorDataBuffer.push({
        timestamp: timestamp,
        relativeTime: collectionStartTime ? (timestamp - collectionStartTime) / 1000 : 0,
        sensorType: sensorType,
        x: x,
        y: y,
        z: z,
        context: currentContext
    });
    
    dataCountDisplay.textContent = sensorDataBuffer.length;
    
    if (sensorDataBuffer.length === 1) {
        exportBtn.style.display = 'inline-block';
        clearBtn.style.display = 'inline-block';
    }
}

function exportToCSV() {
    if (sensorDataBuffer.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Create CSV header
    let csv = 'Timestamp,Relative Time (s),Sensor Type,X,Y,Z,Context\n';
    
    // Add data rows
    sensorDataBuffer.forEach(point => {
        csv += `${point.timestamp},${point.relativeTime.toFixed(3)},${point.sensorType},${point.x},${point.y},${point.z},"${point.context}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_data_${currentContext}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`Exported ${sensorDataBuffer.length} data points to CSV`);
}

function clearLocalData() {
    if (confirm(`Delete ${sensorDataBuffer.length} data points?`)) {
        sensorDataBuffer = [];
        dataCountDisplay.textContent = '0';
        exportBtn.style.display = 'none';
        clearBtn.style.display = 'none';
        console.log('Local data cleared');
    }
}

// Add event listeners for export and clear buttons
exportBtn.addEventListener('click', exportToCSV);
clearBtn.addEventListener('click', clearLocalData);

// The actual event handler function that processes orientation data
function handleOrientation(event) {
    // event.alpha: rotation around z-axis (0-360 degrees) - like a compass
    // event.beta: rotation around x-axis (-180 to 180 degrees) - front to back tilt
    // event.gamma: rotation around y-axis (-90 to 90 degrees) - left to right tilt
    
    // Round to 2 decimal places for cleaner display
    const alpha = event.alpha ? event.alpha.toFixed(2) : '0';
    const beta = event.beta ? event.beta.toFixed(2) : '0';
    const gamma = event.gamma ? event.gamma.toFixed(2) : '0';
    
    // Update the display
    alphaDisplay.textContent = alpha;
    betaDisplay.textContent = beta;
    gammaDisplay.textContent = gamma;
    
    // Log to console for debugging (throttled)
    if (dataPointCounter % 50 === 0) {
        console.log('Orientation:', { alpha, beta, gamma });
    }
    
    // ========================================
    // Send data based on storage mode
    // ========================================
    const timestamp = Date.now();
    
    if (storageMode === 'local') {
        // Save to local storage
        saveDataPointLocally(timestamp, 'orientation', parseFloat(alpha), parseFloat(beta), parseFloat(gamma));
    } else if (edgeMLCollector) {
        // Send to EdgeML
        try {
            edgeMLCollector.addDataPoint(timestamp, 'alpha', parseFloat(alpha));
            edgeMLCollector.addDataPoint(timestamp, 'beta', parseFloat(beta));
            edgeMLCollector.addDataPoint(timestamp, 'gamma', parseFloat(gamma));
            
            dataPointCounter++;
            if (dataPointCounter % 50 === 0) {
                console.log('Data sent to EdgeML - ' + dataPointCounter + ' points collected');
                dataCountDisplay.textContent = dataPointCounter;
            }
        } catch (error) {
            console.error('Error sending data to EdgeML:', error);
        }
    }
}

// Handle Device Motion events (accelerometer and gyroscope)
function handleMotion(event) {
    if (!isOrientationActive) return;
    
    const timestamp = Date.now();
    
    try {
        // Accelerometer data (linear acceleration without gravity)
        if (event.acceleration) {
            accelerometerData.x = event.acceleration.x || 0;
            accelerometerData.y = event.acceleration.y || 0;
            accelerometerData.z = event.acceleration.z || 0;
            
            // Update display
            accelXDisplay.textContent = accelerometerData.x.toFixed(2);
            accelYDisplay.textContent = accelerometerData.y.toFixed(2);
            accelZDisplay.textContent = accelerometerData.z.toFixed(2);
            
            if (storageMode === 'local') {
                saveDataPointLocally(timestamp, 'accelerometer', accelerometerData.x, accelerometerData.y, accelerometerData.z);
            } else if (edgeMLCollector) {
                edgeMLCollector.addDataPoint(timestamp, 'accel_x', accelerometerData.x);
                edgeMLCollector.addDataPoint(timestamp, 'accel_y', accelerometerData.y);
                edgeMLCollector.addDataPoint(timestamp, 'accel_z', accelerometerData.z);
            }
        }
        
        // Gyroscope data (rotation rate)
        if (event.rotationRate) {
            gyroscopeData.x = event.rotationRate.alpha || 0;
            gyroscopeData.y = event.rotationRate.beta || 0;
            gyroscopeData.z = event.rotationRate.gamma || 0;
            
            // Update display
            gyroXDisplay.textContent = gyroscopeData.x.toFixed(2);
            gyroYDisplay.textContent = gyroscopeData.y.toFixed(2);
            gyroZDisplay.textContent = gyroscopeData.z.toFixed(2);
            
            if (storageMode === 'local') {
                saveDataPointLocally(timestamp, 'gyroscope', gyroscopeData.x, gyroscopeData.y, gyroscopeData.z);
            } else if (edgeMLCollector) {
                edgeMLCollector.addDataPoint(timestamp, 'gyro_x', gyroscopeData.x);
                edgeMLCollector.addDataPoint(timestamp, 'gyro_y', gyroscopeData.y);
                edgeMLCollector.addDataPoint(timestamp, 'gyro_z', gyroscopeData.z);
            }
        }
    } catch (error) {
        console.error('Error processing motion data:', error);
    }
}

// Function to start listening to device orientation
async function startOrientationTracking() {
    // Check if the browser supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Get context value
        currentContext = contextInput.value || 'no-context';
        collectionStartTime = Date.now();
        dataPointCounter = 0;
        
        // ========================================
        // Initialize based on storage mode
        // ========================================
        if (storageMode === 'edgeml') {
            try {
                // Check if EdgeML library is loaded
                if (typeof edgeML === 'undefined') {
                    throw new Error('EdgeML library not loaded. Check if CDN is accessible.');
                }
                
                if (typeof edgeML.datasetCollector === 'undefined') {
                    throw new Error('EdgeML.datasetCollector function not found. Library may be outdated.');
                }
                
                console.log('EdgeML library loaded successfully');
                
                // Create dataset name
                const datasetName = `sensor_data_${currentContext}_${Date.now()}`;
                
                console.log('Connecting to EdgeML...');
                console.log('Configuration:', {
                    backendUrl: EDGEML_CONFIG.backendUrl,
                    apiKeyLength: EDGEML_CONFIG.deviceApiKey.length,
                    datasetName: datasetName,
                    sensors: ['orientation', 'accelerometer', 'gyroscope']
                });
                
                // Request permission for motion sensors on iOS 13+
                if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                    try {
                        const permission = await DeviceMotionEvent.requestPermission();
                        if (permission !== 'granted') {
                            alert('Permission to access motion sensors was denied');
                            return;
                        }
                    } catch (permError) {
                        console.error('Error requesting motion permission:', permError);
                    }
                }
                
                // Create the EdgeML data collector
                edgeMLCollector = await edgeML.datasetCollector(
                    EDGEML_CONFIG.backendUrl,
                    EDGEML_CONFIG.deviceApiKey,
                    datasetName,
                    false,
                    ['alpha', 'beta', 'gamma', 'accel_x', 'accel_y', 'accel_z', 'gyro_x', 'gyro_y', 'gyro_z'],
                    {
                        context: currentContext,
                        device: navigator.userAgent,
                        startTime: new Date().toISOString(),
                        sensors: 'orientation, accelerometer, gyroscope'
                    }
                );
                
                console.log('Connected to EdgeML');
                console.log('Dataset name:', datasetName);
                
            } catch (error) {
                console.error('Failed to connect to EdgeML:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                alert('Failed to connect to EdgeML. Check console for details.\n\nError: ' + error.message);
                return;
            }
        } else {
            // Local storage mode
            console.log('Using local storage mode');
            sensorDataBuffer = [];
        }
        
        // Add event listeners for all sensors
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
        isOrientationActive = true;
        
        // Update status
        const statusText = storageMode === 'edgeml' ? 'Active (EdgeML Connected)' : 'Active (Local Storage)';
        orientationStatus.textContent = statusText;
        orientationStatus.className = 'active';
        
        console.log(`Sensor tracking started - Mode: ${storageMode}`);
    } else {
        // Browser doesn't support this feature
        orientationStatus.textContent = 'Not supported by browser';
        orientationStatus.className = 'error';
        
        console.error('DeviceOrientationEvent not supported');
    }
}

// Function to stop listening to device sensors
async function stopOrientationTracking() {
    // Remove all event listeners
    window.removeEventListener('deviceorientation', handleOrientation);
    window.removeEventListener('devicemotion', handleMotion);
    isOrientationActive = false;
    
    // ========================================
    // Handle data based on storage mode
    // ========================================
    if (storageMode === 'edgeml' && edgeMLCollector) {
        try {
            console.log('Uploading remaining data to EdgeML...');
            console.log('Total data points collected: ' + dataPointCounter);
            
            // Tell EdgeML we're done - this uploads all buffered data
            await edgeMLCollector.onComplete();
            
            console.log('All data uploaded to EdgeML successfully');
            console.log('View your data at: ' + EDGEML_CONFIG.backendUrl);
            
            // Clear the collector
            edgeMLCollector = null;
        } catch (error) {
            console.error('Error completing EdgeML upload:', error);
        }
    } else if (storageMode === 'local') {
        console.log(`Data collection stopped. ${sensorDataBuffer.length} points in local storage.`);
        console.log('Click "Export CSV" to download your data.');
    }
    
    // Reset displays
    alphaDisplay.textContent = '--';
    betaDisplay.textContent = '--';
    gammaDisplay.textContent = '--';
    accelXDisplay.textContent = '--';
    accelYDisplay.textContent = '--';
    accelZDisplay.textContent = '--';
    gyroXDisplay.textContent = '--';
    gyroYDisplay.textContent = '--';
    gyroZDisplay.textContent = '--';
    
    // Update status
    const statusText = storageMode === 'edgeml' ? 'Stopped (Data uploaded)' : `Stopped (${sensorDataBuffer.length} points collected)`;
    orientationStatus.textContent = statusText;
    orientationStatus.className = '';
    
    console.log('Sensor tracking stopped');
}

// Add event listener to toggle switch for orientation control
toggleSwitch.addEventListener('change', function() {
    const isChecked = this.checked;
    
    console.log('Toggle switched:', isChecked ? 'ON' : 'OFF');
    
    // Start or stop orientation tracking based on toggle state
    if (isChecked) {
        startOrientationTracking();
    } else {
        stopOrientationTracking();
    }
});
