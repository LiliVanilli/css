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

// Optional: Add real-time toggle change listener
toggleSwitch.addEventListener('change', function() {
    console.log('Toggle switched:', this.checked ? 'ON' : 'OFF');
});
