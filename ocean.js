// Arrays to store the total amounts for By Ocean calculators
let totalAmountsOcean = [];

// Function to calculate values and update the total amounts for By Ocean calculators
function calculateAllOcean() {
  totalAmountsOcean.length = 0; // Clear previous totals (this resets the array)
  
  const calculators = document.querySelectorAll(`#newcalcOcean .calculator-instance`);
  const rate = 4.50; // Rate is constant at 4.50

  calculators.forEach((calc, index) => {
    const weightInput = calc.querySelector('.weightInput');
    const invendproInput = calc.querySelector('.invendproInput'); // Fetch the Invendpro Receipt value
    const warehouseInput = calc.querySelector('.warehouseInput'); // Fetch the Warehouse Number

    const weight = parseFloat(weightInput.value) || 0; // Handle invalid numbers
    const invendproReceipt = invendproInput.value;
    const warehouseNumber = warehouseInput.value;

    // Ensure the weight is a valid number before proceeding
    if (isNaN(weight) || weight <= 0) {
      alert(`Please enter a valid weight for calculator ${index + 1}`);
      return;
    }

    // Calculate the amount (weight * rate)
    const amount = weight * rate;
    calc.querySelector('.amount .value').innerHTML = amount.toFixed(2);

    // Calculate the BTW (10% of (weight * rate))
    const btw = (10 / 100) * amount;
    const amountWithBtw = amount + btw;
    calc.querySelector('.btw .value').innerHTML = btw.toFixed(2);

    // Warehouse fee is fixed at 3.50
    const warehouse = 3.50;

    // Final total amount (amountWithBtw + warehouse)
    const totalamount = amountWithBtw + warehouse;
    calc.querySelector('.totalamount .value').innerHTML = totalamount.toFixed(2);

    // Store the total amount for this calculator
    totalAmountsOcean.push(totalamount);
  });

  // Update the combined total after calculating all individual totals
  updateCombinedTotalOcean();
}

// Function to update the combined total of all total amounts for By Ocean
function updateCombinedTotalOcean() {
  const combinedTotal = totalAmountsOcean.reduce((acc, cur) => acc + cur, 0);
  
  // Update the combined total element for By Ocean
  document.getElementById(`combinedTotalOcean`).innerHTML = combinedTotal.toFixed(2);
}

// Add new calculator instances for By Ocean based on the selected dropdown value
document.getElementById('addCalcOcean').addEventListener('click', () => {
  const numCalculators = parseInt(document.getElementById('numCalculatorsOcean').value, 10);
  for (let i = 0; i < numCalculators; i++) {
    addCalculatorOcean();
  }
});

// Function to add a single calculator instance for By Ocean
function addCalculatorOcean() {
  // Generate a unique identifier for each new calculator instance
  const uniqueId = Math.random().toString(36).substr(2, 9);

  // Generate the HTML for the calculator
  const addCalcHTML = `
    <div class="calculator-instance" id="calc-${uniqueId}">
      <input type="text" class="weightInput" placeholder="Weight">
      <input type="text" class="invendproInput" placeholder="Invendpro Receipt Number">
      <input type="text" class="warehouseInput" placeholder="Warehouse Number">
      <div class="results">
        <div class="rate">Rate/p = 4.50</div>
        <div class="btw">BTW = <span class="value"></span></div>
        <div class="warehouse">Warehouse = 3.50</div>
        <div class="amount">Freight = <span class="value"></span></div>
        <div class="totalamount">Total amount = <span class="value"></span></div>
      </div>
      <button class="deleteCalc" onclick="deleteCalculatorOcean('${uniqueId}')">Delete</button>
    </div>
  `;

  // Append the new calculator to the DOM
  document.getElementById(`newcalcOcean`).innerHTML += addCalcHTML;
}

// Function to delete a specific calculator for By Ocean and recalculate total
function deleteCalculatorOcean(calcId) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    calculator.remove(); 
    calculateAllOcean(); // Recalculate the combined total after deletion
  }
}

// Function to download By Ocean calculators as an Excel file
function downloadExcelOcean() {
  const calculators = document.querySelectorAll(`#newcalcOcean .calculator-instance`);
  const invoiceNumber = document.getElementById(`invoiceNumberOcean`).value; // Fetch the global invoice number
  const ratePerPound = 4.50; // Rate/p is constant
  const warehouseFee = 3.50; // Warehouse fee is constant
  const data = [];
  
  // Header row for the Excel file
  data.push(["Invendpro Receipt", "Warehouse Number", "Invoice Number", "Weight", "Rate/p", "Freight", "BTW", "Warehouse Fee", "Total Amount"]);

  // Collect data from each calculator
  calculators.forEach((calc) => {
    const invendproReceipt = calc.querySelector('.invendproInput').value;
    const warehouseNumber = calc.querySelector('.warehouseInput').value;
    const weight = calc.querySelector('.weightInput').value;
    const freight = calc.querySelector('.amount .value').innerHTML;
    const btw = calc.querySelector('.btw .value').innerHTML;
    const totalAmount = calc.querySelector('.totalamount .value').innerHTML;

    // Add a row for each calculator
    data.push([invendproReceipt, warehouseNumber, invoiceNumber, weight, ratePerPound, freight, btw, warehouseFee, totalAmount]);
  });

  // Add a row for the combined total
  const combinedTotal = totalAmountsOcean.reduce((acc, cur) => acc + cur, 0);
  data.push([]);
  data.push(["Combined Total of All Calculators:", "", "", "", "", "", "", "", combinedTotal.toFixed(2)]);

  // Create a new workbook and add the data
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Calculators");

  // Download the Excel file
  XLSX.writeFile(wb, `calculators_ocean.xlsx`);
}

// Event listener for downloading By Ocean calculators as an Excel file
document.getElementById('downloadExcelOcean').addEventListener('click', downloadExcelOcean);
