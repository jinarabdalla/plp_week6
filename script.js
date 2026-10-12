"use strict";

// SpendWise stores every expense as an object inside this array.
const STORAGE_KEY = "spendwise-week6-data";
const currency = "KSh";
let monthlyBudget = 0;
let expenses = [];

// Get the HTML elements that JavaScript will update.
const budgetForm = document.querySelector("#budget-form");
const budgetInput = document.querySelector("#budget-input");
const expenseForm = document.querySelector("#expense-form");
const expenseNameInput = document.querySelector("#expense-name");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseList = document.querySelector("#expense-list");
const formFeedback = document.querySelector("#form-feedback");
const clearExpensesButton = document.querySelector("#clear-expenses");

function formatMoney(amount) {
  return `${currency} ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function saveData() {
  // Keep the budget and expense array after the page is refreshed.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ monthlyBudget, expenses }));
  } catch (error) {
    console.warn("SpendWise could not save data in this browser.", error);
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);
    if (data && typeof data.monthlyBudget === "number" && Array.isArray(data.expenses)) {
      monthlyBudget = data.monthlyBudget;
      // Validate saved records before using them.
      expenses = data.expenses.filter((item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.category === "string"
      );
    }
  } catch (error) {
    console.warn("Saved SpendWise data could not be read.", error);
    monthlyBudget = 0;
    expenses = [];
  }
}

function calculateTotalExpenses() {
  let total = 0;
  // A loop processes every expense record in the array.
  for (const expense of expenses) {
    total += expense.amount;
  }
  return total;
}

function updateBudgetMessage(totalSpent, remaining) {
  const message = document.querySelector("#budget-message");
  const remainingNote = document.querySelector("#remaining-note");
  const progressFill = document.querySelector("#progress-fill");

  message.className = "status-message";
  progressFill.style.background = "var(--green)";

  // Conditional statements give feedback for different budgeting scenarios.
  if (monthlyBudget <= 0) {
    message.textContent = "Set a monthly budget and add your first expense.";
    remainingNote.textContent = "Set a budget to get started";
  } else if (totalSpent > monthlyBudget) {
    message.textContent = `Budget exceeded by ${formatMoney(Math.abs(remaining))}. Review your spending.`;
    message.classList.add("danger");
    remainingNote.textContent = "You are over budget";
    progressFill.style.background = "var(--danger)";
  } else if (totalSpent === monthlyBudget) {
    message.textContent = "You have reached your budget limit. Avoid extra spending.";
    message.classList.add("warning");
    remainingNote.textContent = "Budget fully used";
    progressFill.style.background = "var(--warning)";
  } else if (totalSpent >= monthlyBudget * 0.8) {
    message.textContent = "Careful! You have used at least 80% of your budget.";
    message.classList.add("warning");
    remainingNote.textContent = "Almost at your limit";
    progressFill.style.background = "var(--warning)";
  } else {
    message.textContent = "You are within budget. Keep tracking your expenses!";
    remainingNote.textContent = "Available to spend";
  }
}

function renderExpenses() {
  // DOM manipulation: rebuild the table using the current array data.
  expenseList.replaceChildren();

  if (expenses.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No expenses yet. Add one using the form.";
    row.appendChild(cell);
    expenseList.appendChild(row);
  } else {
    // The loop creates a table row for every saved expense.
    for (const expense of expenses) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = expense.name;

      const categoryCell = document.createElement("td");
      const category = document.createElement("span");
      category.className = "category-pill";
      category.textContent = expense.category;
      categoryCell.appendChild(category);

      const amountCell = document.createElement("td");
      amountCell.textContent = formatMoney(expense.amount);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${expense.name}`);
      deleteButton.addEventListener("click", () => deleteExpense(expense.id));
      actionCell.appendChild(deleteButton);

      row.append(nameCell, categoryCell, amountCell, actionCell);
      expenseList.appendChild(row);
    }
  }

  const totalSpent = calculateTotalExpenses();
  const remaining = monthlyBudget - totalSpent;
  const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const visiblePercentage = Math.round(percentage);

  document.querySelector("#budget-total").textContent = formatMoney(monthlyBudget);
  document.querySelector("#spent-total").textContent = formatMoney(totalSpent);
  document.querySelector("#remaining-total").textContent = formatMoney(remaining);
  document.querySelector("#table-total").textContent = formatMoney(totalSpent);
  document.querySelector("#expense-count").textContent =
    `${expenses.length} ${expenses.length === 1 ? "record" : "records"}`;
  document.querySelector("#progress-percent").textContent = `${visiblePercentage}%`;

  const progressBar = document.querySelector("#progress-bar");
  progressBar.setAttribute("aria-valuenow", String(Math.min(100, Math.max(0, visiblePercentage))));
  // Keep the bar within 100% even when spending exceeds the budget.
  document.querySelector("#progress-fill").style.width =
    `${monthlyBudget > 0 ? Math.min(100, Math.max(0, percentage)) : 0}%`;

  updateBudgetMessage(totalSpent, remaining);
}

function showFeedback(message, isError = false) {
  formFeedback.textContent = message;
  formFeedback.classList.toggle("error", isError);
}

function deleteExpense(id) {
  const oldLength = expenses.length;
  expenses = expenses.filter((expense) => expense.id !== id);

  if (expenses.length !== oldLength) {
    saveData();
    renderExpenses();
    showFeedback("Expense deleted.");
  }
}

// Event listener: save a valid monthly budget when its form is submitted.
budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(budgetInput.value);

  if (!Number.isFinite(value) || value <= 0) {
    budgetInput.setCustomValidity("Please enter a budget greater than zero.");
    budgetInput.reportValidity();
    budgetInput.setCustomValidity("");
    return;
  }

  monthlyBudget = value;
  saveData();
  renderExpenses();
  showFeedback("Monthly budget saved successfully.");
});

// Event listener: validate the expense form and add an object to the array.
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const category = expenseCategoryInput.value;

  if (!name) {
    showFeedback("Please enter an expense name.", true);
    expenseNameInput.focus();
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showFeedback("Please enter an amount greater than zero.", true);
    expenseAmountInput.focus();
    return;
  }
  if (!category) {
    showFeedback("Please choose an expense category.", true);
    expenseCategoryInput.focus();
    return;
  }

  const newExpense = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    amount,
    category
  };
  expenses.push(newExpense);
  saveData();
  renderExpenses();
  expenseForm.reset();
  expenseNameInput.focus();

  const totalSpent = calculateTotalExpenses();
  if (monthlyBudget > 0 && totalSpent > monthlyBudget) {
    showFeedback("Expense added, but you are now over budget. Check the dashboard.", true);
  } else {
    showFeedback("Expense added successfully.");
  }
});

// Event listener: ask for confirmation before deleting all records.
clearExpensesButton.addEventListener("click", () => {
  if (expenses.length === 0) {
    showFeedback("There are no expenses to clear.", true);
    return;
  }

  const confirmed = window.confirm("Delete all expense records? This cannot be undone.");
  if (confirmed) {
    expenses = [];
    saveData();
    renderExpenses();
    showFeedback("All expenses have been cleared.");
  }
});

// Display today's date, restore saved information, and draw the initial dashboard.
document.querySelector("#today-date").textContent = new Date().toLocaleDateString("en-KE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric"
});

loadData();
if (monthlyBudget > 0) budgetInput.value = String(monthlyBudget);
renderExpenses();