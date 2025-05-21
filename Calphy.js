/* This snipped code is used to dynamically load a navigation bar
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
'id': used to uniquely identify the input element.
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
calcBtn.onclick = calculateImpulseAndMomentum; // Meaning, when we click the button, it will calculate all the set formulas in the function called calcuImpulseAnd Momentum
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

  let hasError = false;
  let resultHtml = `
    <ul style="text-align: left; padding-left: 20px; color: black;">
  `;

  // Check and calculate Impulse
  if (!isNaN(force) && !isNaN(time)) {
  //IMPULSE
    const impulse = force * time;
    resultHtml += `<li><strong>Impulse:</strong> ${impulse.toFixed(2)} N·s</li>`;

  //IMPULSE ALTERVATIVE FORMULA
  } else if (!isNaN(mass) && !isNaN(initialVelocity) && !isNaN(finalVelocity)) {
    const impulseAlt = mass * (finalVelocity - initialVelocity);
    resultHtml += `<li><strong>Impulse (alt):</strong> ${impulseAlt.toFixed(2)} N·s</li>`;
  
  //IF INVALID YUNG ININPUT NI USER
  } else {
    hasError = true;
    resultHtml += `<li style="color: red;">Impulse: Missing required inputs</li>`;
  }

  // Check and calculate Momentum
  if (!isNaN(mass) && !isNaN(finalVelocity)) {
    const finalMomentum = mass * finalVelocity;
    resultHtml += `<li><strong>Final Momentum:</strong> ${finalMomentum.toFixed(2)} kg·m/s</li>`;
  } else {
    hasError = true;
    resultHtml += `<li style="color: red;">Final Momentum: Missing required inputs</li>`;
  }

  // Check and calculate Initial Momentum
  if (!isNaN(mass) && !isNaN(initialVelocity)) {
    const initialMomentum = mass * initialVelocity;
    resultHtml += `<li><strong>Initial Momentum:</strong> ${initialMomentum.toFixed(2)} kg·m/s</li>`;
  }

  // Change in Momentum (if both are available)
  if (!isNaN(mass) && !isNaN(initialVelocity) && !isNaN(finalVelocity)) {
    const changeInMomentum = mass * (finalVelocity - initialVelocity);
    resultHtml += `<li><strong>Change in Momentum:</strong> ${changeInMomentum.toFixed(2)} kg·m/s</li>`;
  }

  resultHtml += `</ul>`;

  if (hasError) {
    displayMessage("Some values are missing. Calculated only available results.", 'error');
  }

  // Save only available values
  const savedData = {};
  if (!isNaN(force)) savedData.force = force;
  if (!isNaN(time)) savedData.time = time;
  if (!isNaN(mass)) savedData.mass = mass;
  if (!isNaN(initialVelocity)) savedData.initialVelocity = initialVelocity;
  if (!isNaN(finalVelocity)) savedData.finalVelocity = finalVelocity;

  localStorage.setItem("impulseCalcData", JSON.stringify(savedData));
  displayMessage(resultHtml, 'info', true);
  document.getElementById('clearBtn').style.display = 'inline-block';
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

  if (!lastCalcDiv || !button) {
    displayMessage("Missing display section or button.", 'error');
    return;
  }

  if (lastCalcDiv.style.display === "none" || lastCalcDiv.style.display === "") {
    const saved = localStorage.getItem("impulseCalcData");
    if (!saved) {
      displayMessage("No saved data found.", 'error');
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      let output = "";
      for (const key in parsed) {
        output += `${key}: ${parsed[key]}\n`;
      }

      document.getElementById("lastCalcData").textContent = output;
      lastCalcDiv.style.display = "block";
      button.textContent = "Hide Last Calculation";
    } catch (error) {
      displayMessage("Error loading saved calculation.", 'error');
    }
  } else {
    lastCalcDiv.style.display = "none";
    button.textContent = "View Last Calculation";
  }
}

// After creating and appending the Calculate button
container.appendChild(calcBtn);

// After creating and appending the View Last Calculation button
container.appendChild(toggleBtn);

//Clear button code.
const clearBtn = document.createElement("button");
clearBtn.textContent = "Clear Results";
clearBtn.id = "clearBtn";
clearBtn.style.display = "none"; // hidden initially
clearBtn.onclick = () => {
  document.getElementById('resultMessages').innerHTML = '';
  clearBtn.style.display = "none";
};
container.appendChild(clearBtn);

// Displaying the messages
function displayMessage(message, type = 'info', isHtml = false) {
  const container = document.getElementById('resultMessages');
  const msgBox = document.createElement('div');

  // Add CSS class based on type (info or error)
  msgBox.classList.add(type === 'error' ? 'error-message' : 'info-message');

  if (isHtml) {
    msgBox.innerHTML = message;
  } else {
    msgBox.textContent = message;
  }

  container.appendChild(msgBox);
}





