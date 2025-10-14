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
// EDGEML CONFIGURATION
// ========================================

// EdgeML connection settings
const EDGEML_CONFIG = {
    backendUrl: 'https://app.edge-ml.org',     // EdgeML server
    // NOTE: SSL certificate expired June 3, 2025 - this is an EdgeML server issue, not our code
    deviceApiKey: '5fe6e50c3fb5001531bbd8e03a8c591f',  // Your write key
    username: 'css25',                         // Username
    password: 'css25'                          // Password
};

// Variable to hold the EdgeML data collector
let edgeMLCollector = null;

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

// Variable to track if orientation listening is active
let isOrientationActive = false;

// Variables for additional sensors
let accelerometerData = { x: 0, y: 0, z: 0 };
let gyroscopeData = { x: 0, y: 0, z: 0 };
let dataPointCounter = 0;

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
    
    // Log to console for debugging
    console.log('Orientation:', { alpha, beta, gamma });
    
    // ========================================
    // Send data to EdgeML if collector is active
    // ========================================
    if (edgeMLCollector) {
        try {
            // Get current timestamp in milliseconds
            const timestamp = Date.now();
            
            // Send each orientation value as a separate data point
            // Format: addDataPoint(timestamp, sensorName, value)
            edgeMLCollector.addDataPoint(timestamp, 'alpha', parseFloat(alpha));
            edgeMLCollector.addDataPoint(timestamp, 'beta', parseFloat(beta));
            edgeMLCollector.addDataPoint(timestamp, 'gamma', parseFloat(gamma));
            
            dataPointCounter++;
            if (dataPointCounter % 50 === 0) {
                console.log('Data sent to EdgeML - ' + dataPointCounter + ' points collected');
            }
        } catch (error) {
            console.error('Error sending data to EdgeML:', error);
        }
    }
}

// Handle Device Motion events (accelerometer and gyroscope)
function handleMotion(event) {
    if (!isOrientationActive || !edgeMLCollector) return;
    
    const timestamp = Date.now();
    
    try {
        // Accelerometer data (linear acceleration without gravity)
        if (event.acceleration) {
            accelerometerData.x = event.acceleration.x || 0;
            accelerometerData.y = event.acceleration.y || 0;
            accelerometerData.z = event.acceleration.z || 0;
            
            edgeMLCollector.addDataPoint(timestamp, 'accel_x', accelerometerData.x);
            edgeMLCollector.addDataPoint(timestamp, 'accel_y', accelerometerData.y);
            edgeMLCollector.addDataPoint(timestamp, 'accel_z', accelerometerData.z);
        }
        
        // Gyroscope data (rotation rate)
        if (event.rotationRate) {
            gyroscopeData.x = event.rotationRate.alpha || 0;
            gyroscopeData.y = event.rotationRate.beta || 0;
            gyroscopeData.z = event.rotationRate.gamma || 0;
            
            edgeMLCollector.addDataPoint(timestamp, 'gyro_x', gyroscopeData.x);
            edgeMLCollector.addDataPoint(timestamp, 'gyro_y', gyroscopeData.y);
            edgeMLCollector.addDataPoint(timestamp, 'gyro_z', gyroscopeData.z);
        }
    } catch (error) {
        console.error('Error sending motion data to EdgeML:', error);
    }
}

// Function to start listening to device orientation
async function startOrientationTracking() {
    // Check if the browser supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        try {
            // ========================================
            // Check if EdgeML library is loaded
            // ========================================
            if (typeof edgeML === 'undefined') {
                throw new Error('EdgeML library not loaded. Check if CDN is accessible.');
            }
            
            if (typeof edgeML.datasetCollector === 'undefined') {
                throw new Error('EdgeML.datasetCollector function not found. Library may be outdated.');
            }
            
            console.log('EdgeML library loaded successfully');
            
            // ========================================
            // Initialize EdgeML Data Collector
            // ========================================
            
            // Get context value for dataset name
            const contextValue = contextInput.value || 'no-context';
            const datasetName = `orientation_${contextValue}_${Date.now()}`;
            
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
            
            // Create the data collector with all sensor channels
            // Parameters:
            // 1. Backend URL
            // 2. API Key (write key)
            // 3. Dataset name (unique identifier)
            // 4. Use custom timestamps (false = we provide timestamps)
            // 5. Time-series names (what we're measuring)
            // 6. Metadata (optional info about the dataset)
            edgeMLCollector = await edgeML.datasetCollector(
                EDGEML_CONFIG.backendUrl,
                EDGEML_CONFIG.deviceApiKey,
                datasetName,
                false,  // We'll provide our own timestamps
                ['alpha', 'beta', 'gamma', 'accel_x', 'accel_y', 'accel_z', 'gyro_x', 'gyro_y', 'gyro_z'],
                {
                    context: contextValue,
                    device: navigator.userAgent,
                    startTime: new Date().toISOString(),
                    sensors: 'orientation, accelerometer, gyroscope'
                }  // Metadata
            );
            
            console.log('Connected to EdgeML');
            console.log('Dataset name:', datasetName);
            dataPointCounter = 0;
            
        } catch (error) {
            console.error('Failed to connect to EdgeML:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                fullError: error
            });
            alert('Failed to connect to EdgeML. Check console for details.\n\nError: ' + error.message);
        }
        
        // Add event listeners for all sensors
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
        isOrientationActive = true;
        
        // Update status
        orientationStatus.textContent = 'Active (EdgeML Connected)';
        orientationStatus.className = 'active';
        
        console.log('Sensor tracking started - collecting orientation, accelerometer, gyroscope data');
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
    // Close EdgeML connection and upload remaining data
    // ========================================
    if (edgeMLCollector) {
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
    }
    
    // Reset displays
    alphaDisplay.textContent = '--';
    betaDisplay.textContent = '--';
    gammaDisplay.textContent = '--';
    
    // Update status
    orientationStatus.textContent = 'Stopped (Data uploaded)';
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
