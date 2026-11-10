/**
 * Electricity Bill Calculator
 * Client-Side JavaScript Application Logic
 * Academic Mini Project - Department of Information Technology
 * SRM TRP Engineering College, Tiruchirappalli
 */

// Tariff Slab Configuration (Illustrative Demonstration Slabs)
const TARIFF_SLABS = [
  { min: 0, max: 100, rate: 1.50, label: 'First 100 units (0 - 100)' },
  { min: 100, max: 200, rate: 2.50, label: 'Next 100 units (101 - 200)' },
  { min: 200, max: 300, rate: 4.00, label: 'Next 100 units (201 - 300)' },
  { min: 300, max: Infinity, rate: 6.00, label: 'Above 300 units' }
];

// Current calculated record in memory
let currentBillRecord = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ebForm');
  const btnReset = document.getElementById('btnReset');
  const btnSaveHistory = document.getElementById('btnSaveHistory');
  const btnPrintBill = document.getElementById('btnPrintBill');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // Load calculation history on start
  renderHistoryTable();

  // Form Submission Event
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateAndCalculate()) {
      // Scroll smoothly to result container
      document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Reset Event
  btnReset.addEventListener('click', () => {
    form.reset();
    clearErrors();
    document.getElementById('resultContainer').style.display = 'none';
    currentBillRecord = null;
  });

  // Save to History Event
  btnSaveHistory.addEventListener('click', () => {
    if (currentBillRecord) {
      saveRecordToLocalStorage(currentBillRecord);
      renderHistoryTable();
      alert('Bill record saved to LocalStorage successfully!');
    }
  });

  // Print Bill Event
  btnPrintBill.addEventListener('click', () => {
    window.print();
  });

  // Clear All History Event
  btnClearHistory.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved calculation history?')) {
      localStorage.removeItem('eb_calc_history');
      renderHistoryTable();
    }
  });
});

/**
 * Validates inputs and calculates electricity bill
 * @returns {boolean} True if calculation succeeded, false otherwise
 */
function validateAndCalculate() {
  clearErrors();

  const nameInput = document.getElementById('consumerName');
  const numInput = document.getElementById('consumerNumber');
  const typeInput = document.getElementById('connectionType');
  const addrInput = document.getElementById('consumerAddress');
  const prevInput = document.getElementById('prevReading');
  const currInput = document.getElementById('currReading');

  const consumerName = nameInput.value.trim();
  const consumerNumber = numInput.value.trim();
  const connectionType = typeInput.value;
  const consumerAddress = addrInput.value.trim() || 'Not Specified';

  let isValid = true;

  // Validation: Consumer Name
  if (!consumerName) {
    showError('nameError', 'Please enter consumer name.');
    isValid = false;
  }

  // Validation: Consumer Number
  if (!consumerNumber) {
    showError('numberError', 'Please enter consumer ID / service number.');
    isValid = false;
  }

  // Validation: Previous Reading
  const prevVal = prevInput.value.trim();
  if (prevVal === '') {
    showError('prevError', 'Previous meter reading is required.');
    isValid = false;
  } else if (isNaN(prevVal) || Number(prevVal) < 0) {
    showError('prevError', 'Please enter a valid non-negative number.');
    isValid = false;
  }

  // Validation: Current Reading
  const currVal = currInput.value.trim();
  if (currVal === '') {
    showError('currError', 'Current meter reading is required.');
    isValid = false;
  } else if (isNaN(currVal) || Number(currVal) < 0) {
    showError('currError', 'Please enter a valid non-negative number.');
    isValid = false;
  }

  if (!isValid) return false;

  const previousReading = parseFloat(prevVal);
  const currentReading = parseFloat(currVal);

  // Logical Validation: Current >= Previous
  if (currentReading < previousReading) {
    showError('currError', 'Current reading cannot be less than previous reading.');
    return false;
  }

  // Formula 1: Energy Consumption Calculation
  const unitsConsumed = currentReading - previousReading;

  // Formula 2: Progressive Slab Charge Calculation
  const breakdown = calculateSlabCharges(unitsConsumed);

  // Formula 3: Total Estimated Bill
  const totalEnergyCharges = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const fixedCharges = 0.00; // Illustrative project configuration
  const grandTotal = totalEnergyCharges + fixedCharges;

  // Prepare Bill Record
  currentBillRecord = {
    id: 'BILL-' + Date.now(),
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    consumerName,
    consumerNumber,
    connectionType,
    consumerAddress,
    previousReading,
    currentReading,
    unitsConsumed,
    breakdown,
    totalEnergyCharges,
    fixedCharges,
    grandTotal
  };

  // Populate Bill Display UI
  displayBillResult(currentBillRecord);

  return true;
}

/**
 * Calculates progressive charges across tariff slabs
 * @param {number} totalUnits - Total units consumed
 * @returns {Array} Array of slab detail objects
 */
function calculateSlabCharges(totalUnits) {
  let remainingUnits = totalUnits;
  const breakdown = [];

  for (let i = 0; i < TARIFF_SLABS.length; i++) {
    const slab = TARIFF_SLABS[i];
    const slabCapacity = slab.max - slab.min;

    if (remainingUnits > 0) {
      const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);
      const amount = unitsInThisSlab * slab.rate;

      breakdown.push({
        label: slab.label,
        units: unitsInThisSlab,
        rate: slab.rate,
        amount: amount
      });

      remainingUnits -= unitsInThisSlab;
    } else {
      breakdown.push({
        label: slab.label,
        units: 0,
        rate: slab.rate,
        amount: 0.00
      });
    }
  }

  return breakdown;
}

/**
 * Renders the bill details on the UI
 * @param {Object} record - The bill record
 */
function displayBillResult(record) {
  document.getElementById('billDate').textContent = `Date & Time: ${record.date}`;
  document.getElementById('resName').textContent = record.consumerName;
  document.getElementById('resNumber').textContent = record.consumerNumber;
  document.getElementById('resType').textContent = record.connectionType;
  document.getElementById('resAddress').textContent = record.consumerAddress;
  document.getElementById('resPrev').textContent = record.previousReading.toLocaleString('en-IN');
  document.getElementById('resCurr').textContent = record.currentReading.toLocaleString('en-IN');
  document.getElementById('resUnits').textContent = `${record.unitsConsumed.toLocaleString('en-IN')} Units`;

  // Render Slab Table Body
  const tbody = document.getElementById('slabBreakdownBody');
  tbody.innerHTML = '';

  record.breakdown.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.label}</td>
      <td>${item.units}</td>
      <td>&#8377;${item.rate.toFixed(2)}</td>
      <td>&#8377;${item.amount.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('resEnergyCharges').innerHTML = `&#8377;${record.totalEnergyCharges.toFixed(2)}`;
  document.getElementById('resGrandTotal').innerHTML = `&#8377;${record.grandTotal.toFixed(2)}`;

  document.getElementById('resultContainer').style.display = 'block';
}

/**
 * Error display helper
 */
function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

/**
 * Clear all form errors
 */
function clearErrors() {
  const errors = document.querySelectorAll('.error-msg');
  errors.forEach(el => el.textContent = '');
}

/**
 * LocalStorage Helpers
 */
function getStoredHistory() {
  const data = localStorage.getItem('eb_calc_history');
  return data ? JSON.parse(data) : [];
}

function saveRecordToLocalStorage(record) {
  const history = getStoredHistory();
  // Prepend latest calculation
  history.unshift(record);
  localStorage.setItem('eb_calc_history', JSON.stringify(history));
}

function deleteHistoryRecord(id) {
  let history = getStoredHistory();
  history = history.filter(item => item.id !== id);
  localStorage.setItem('eb_calc_history', JSON.stringify(history));
  renderHistoryTable();
}

/**
 * Renders the history table from LocalStorage
 */
function renderHistoryTable() {
  const history = getStoredHistory();
  const tbody = document.getElementById('historyTableBody');
  const emptyMsg = document.getElementById('noHistoryMsg');
  const countEl = document.getElementById('historyCount');

  countEl.textContent = `${history.length} Record(s) Saved`;

  if (history.length === 0) {
    tbody.innerHTML = '';
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';
  tbody.innerHTML = '';

  history.forEach((rec) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.date}</td>
      <td><strong>${rec.consumerNumber}</strong></td>
      <td>${rec.consumerName}</td>
      <td>${rec.previousReading} &rarr; ${rec.currentReading}</td>
      <td><strong>${rec.unitsConsumed}</strong></td>
      <td><strong>&#8377;${rec.grandTotal.toFixed(2)}</strong></td>
      <td>
        <button class="btn-del" onclick="deleteHistoryRecord('${rec.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
