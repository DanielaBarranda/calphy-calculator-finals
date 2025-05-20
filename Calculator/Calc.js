/* Navigation */
fetch("../nav-bar/nav.html") 
      .then(response => response.text())
      .then(data => {
        document.getElementById("navbar-placeholder").innerHTML = data;
      })
      .catch(error => {
        console.error("Failed to load navbar:", error);
      });

// para syang html file pero nasa js(visbility ng input fields)
const inputFields = [
  { id: "force", label: "Force (N)" },
  { id: "time", label: "Time (s)" },
  { id: "mass", label: "Mass (kg)" },
  { id: "initialVelocity", label: "Initial Velocity (m/s)" },
  { id: "finalVelocity", label: "Final Velocity (m/s)" }
];

// Dynamically generate input elements(yung "Step" sa html file )
const container = document.getElementById("inputContainer");

inputFields.forEach(field => {
  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = "number";
  input.id = field.id;
  input.required = true;

  container.appendChild(label);
  container.appendChild(input);
});

// button for calculate
const calcBtn = document.createElement("button");
calcBtn.textContent = "Calculate";
calcBtn.onclick = calculateImpulseAndMomentum;
container.appendChild(calcBtn);

// button for last calculated
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "View Last Calculation";
toggleBtn.className = "T-button";
toggleBtn.id = "toggleLastBtn";
toggleBtn.onclick = toggleLastCalculation;
container.appendChild(toggleBtn);

// Calculation logic
function calculateImpulseAndMomentum() {
  const force = parseFloat(document.getElementById("force").value);
  const time = parseFloat(document.getElementById("time").value);
  const mass = parseFloat(document.getElementById("mass").value);
  const initialVelocity = parseFloat(document.getElementById("initialVelocity").value);
  const finalVelocity = parseFloat(document.getElementById("finalVelocity").value);

  if ([force, time, mass, initialVelocity, finalVelocity].some(isNaN)) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  const impulse = force * time;
  const initialMomentum = mass * initialVelocity;
  const finalMomentum = mass * finalVelocity;

  const resultData = { force, time, mass, initialVelocity, finalVelocity };
  localStorage.setItem("impulseCalcData", JSON.stringify(resultData));

  document.querySelector(".step").style.display = "none";
  document.getElementById("results").style.display = "block";
  document.getElementById("impulseOutput").textContent = `Impulse: ${impulse.toFixed(2)} N·s`;
  document.getElementById("initialMomentumOutput").textContent = `Initial Momentum: ${initialMomentum.toFixed(2)} kg·m/s`;
  document.getElementById("finalMomentumOutput").textContent = `Final Momentum: ${finalMomentum.toFixed(2)} kg·m/s`;
}

// Pang Restart 
function restart() {
  document.querySelector(".step").style.display = "block";
  document.getElementById("results").style.display = "none";

  // Pang Clear ng input values
  inputFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) input.value = "";
  });
}

// para makita yung saved values
function toggleLastCalculation() {
  const lastCalcDiv = document.getElementById("lastCalc");
  const button = document.getElementById("toggleLastBtn");

  if (lastCalcDiv.style.display === "none") {
    const saved = localStorage.getItem("impulseCalcData");
    if (!saved) {
      alert("No saved data found.");
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