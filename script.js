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
// DEVICE ORIENTATION FEATURE
// ========================================

// Get orientation display elements
const orientationStatus = document.getElementById('orientation-status');
const alphaDisplay = document.getElementById('alpha');
const betaDisplay = document.getElementById('beta');
const gammaDisplay = document.getElementById('gamma');

// Variable to track if orientation listening is active
let isOrientationActive = false;

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
}

// Function to start listening to device orientation
function startOrientationTracking() {
    // Check if the browser supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Add the event listener
        window.addEventListener('deviceorientation', handleOrientation);
        isOrientationActive = true;
        
        // Update status
        orientationStatus.textContent = 'Active ✓';
        orientationStatus.className = 'active';
        
        console.log('✓ Device orientation tracking started');
    } else {
        // Browser doesn't support this feature
        orientationStatus.textContent = 'Not supported by browser';
        orientationStatus.className = 'error';
        
        console.error('✗ DeviceOrientationEvent not supported');
    }
}

// Function to stop listening to device orientation
function stopOrientationTracking() {
    // Remove the event listener
    window.removeEventListener('deviceorientation', handleOrientation);
    isOrientationActive = false;
    
    // Reset displays
    alphaDisplay.textContent = '--';
    betaDisplay.textContent = '--';
    gammaDisplay.textContent = '--';
    
    // Update status
    orientationStatus.textContent = 'Stopped';
    orientationStatus.className = '';
    
    console.log('✓ Device orientation tracking stopped');
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
