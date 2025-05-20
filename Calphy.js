/* This JavaScript code is used to dynamically load a navigation bar
 (navbar) into a webpage without copying and pasting the same HTML code on every page.*/
fetch("../nav-bar/nav.html") 
      .then(response => response.text())
      .then(data => {
        document.getElementById("navbar-placeholder").innerHTML = data;
      })
      .catch(error => {
        console.error("Failed to load navbar:", error);
      });

/*This array holds the configuration for each input field in the form.
Each object contains:
'id': used to uniquely identify the input element (similar to HTML id).
'label': the text label that will be displayed beside the input field. */
const inputFields = [
  { id: "force", label: "Force (N)" }, // Input for Force in Newtons
  { id: "time", label: "Time (s)" }, // For Time in seconds
  { id: "mass", label: "Mass (kg)" }, // For Mass in Kilograms
  { id: "initialVelocity", label: "Initial Velocity (m/s)" }, // For Initial velocity in meters/second
  { id: "finalVelocity", label: "Final Velocity (m/s)" } // For Final velocity in meeters/second
];

/* This block dynamically generates input elements for each field defined in the inputFields array.
It creates a label and input element for each field, sets their attributes accordingly,
and appends them to the container with the ID 'inputContainer'. */
const container = document.getElementById("inputContainer"); // Get the container where inputs will be added

inputFields.forEach(field => {
  const label = document.createElement("label"); // Create a label element
  label.setAttribute("for", field.id); // Set the 'for' attribute to match the input's id
  label.textContent = field.label; // Set the visible text of the label

  const input = document.createElement("input"); // Create an input element
  input.type = "number"; // Set input type to number
  input.id = field.id; // Assign a unique id from the field object
  input.required = true; // Make the input required

  container.appendChild(label); // Add the label to the container
  container.appendChild(input); // Add the input field to the container
});

/* /* This code creates a button element for triggering the calculation.
It sets the button text to "Calculate" and assigns the function
`calculateImpulseAndMomentum` to run when the button is clicked. */
const calcBtn = document.createElement("button"); //Button element
calcBtn.textContent = "Calculate"; // Setting the button text
calcBtn.onclick = calculateImpulseAndMomentum; // handler for calculation
container.appendChild(calcBtn); //Adding the button to the container

/* It sets the button text to "View Last Calculation". This code creates 
a button to toggle the display of the last calculation.  */
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "View Last Calculation";
toggleBtn.className = "T-button";
toggleBtn.id = "toggleLastBtn";
toggleBtn.onclick = toggleLastCalculation;
container.appendChild(toggleBtn);

/* This function calculates impulse and momentum based on user inputs.
It retrieves values from the input fields, converts them to numbers,
and checks if all inputs are valid before proceeding with calculations.
parseFloat is used to convert the input value from a string to a decimal number 
Getting the numeric values entered for force, time, mass, Initial Velocity, and Final Velocity*/
function calculateImpulseAndMomentum() {
  const force = parseFloat(document.getElementById("force").value);
  const time = parseFloat(document.getElementById("time").value);
  const mass = parseFloat(document.getElementById("mass").value);
  const initialVelocity = parseFloat(document.getElementById("initialVelocity").value);
  const finalVelocity = parseFloat(document.getElementById("finalVelocity").value);

/* Check if any input values are not valid numbers (NaN).
   If so, this triggers the pop-up alert we see in the browser. */
  if ([force, time, mass, initialVelocity, finalVelocity].some(isNaN)) {
    displayMessage("Please fill in all fields with valid numbers.");
    return;
  }

// Setting up the conditions 
  const impulse = force * time;
  const initialMomentum = mass * initialVelocity;
  const finalMomentum = mass * finalVelocity;

  const resultData = { force, time, mass, initialVelocity, finalVelocity };
  localStorage.setItem("impulseCalcData", JSON.stringify(resultData));

displayMessage(`Impulse: ${impulse.toFixed(2)} N·s`);
displayMessage(`Initial Momentum: ${initialMomentum.toFixed(2)} kg·m/s`);
displayMessage(`Final Momentum: ${finalMomentum.toFixed(2)} kg·m/s`);
}

/* This function resets the form to its initial state.
It makes the input fields container visible again,
hides the results section, and clears all input values. */
function restart() {
  document.querySelector(".step").style.display = "block";
  document.getElementById("results").style.display = "none";

  // Clearing all the inputted values
  inputFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) input.value = "";
  });
}

// To view all the saved calculations
function toggleLastCalculation() {
  const lastCalcDiv = document.getElementById("lastCalc");
  const button = document.getElementById("toggleLastBtn");

  if (lastCalcDiv.style.display === "none") {
    const saved = localStorage.getItem("impulseCalcData");
    if (!saved) {
      displayMessage("No saved data found.");
      return;
    }

    const parsed = JSON.parse(saved);
    let output = "";
    for (const key in parsed) {
      output += `${key}: ${parsed[key]}\n`;
    }

    document.getElementById("lastCalcData").textContent = output;
    lastCalcDiv.style.display = "block";
    button.textContent = "Hide Last Calculation";
  } else {
    lastCalcDiv.style.display = "none";
    button.textContent = "View Last Calculation";
  }
}

function displayMessage(message, type = 'info') {
  const container = document.getElementById('resultMessages');
  const msgBox = document.createElement('div');
  msgBox.style.padding = '10px';
  msgBox.style.marginBottom = '10px';
  msgBox.style.borderRadius = '8px';

  if (type === 'error') {
    msgBox.style.backgroundColor = '#f8d7da';
    msgBox.style.color = '#721c24';
  } else {
    msgBox.style.backgroundColor = '#d1ecf1';
    msgBox.style.color = '#0c5460';
  }

  msgBox.textContent = message;
  container.appendChild(msgBox);
}

