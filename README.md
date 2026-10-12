# SpendWise — Interactive Budget Tracker

SpendWise is a beginner-friendly budgeting application built with HTML, CSS, and JavaScript. It helps a user set a monthly budget, add expenses, see the total spent and remaining balance, and receive feedback when spending approaches or exceeds the budget.

## Files in this project

- `index.html` — the page structure, budget form, expense form, dashboard summary, progress bar, and expense table.
- `style.css` — the color palette, Google Fonts, responsive layout, cards, forms, table, buttons, and budget status styles.
- `script.js` — input validation, expense records, calculations, conditional feedback, DOM updates, event listeners, and browser storage.

## Improvements made this week

- Added a form to save a monthly budget.
- Added an expense form with name, amount, and category fields.
- Added a dashboard showing the monthly budget, total expenses, remaining balance, and spending percentage.
- Added an expense table with a Delete button for each record.
- Added a Clear all expenses action with a confirmation prompt.
- Added conditional messages for being within budget, using at least 80% of the budget, reaching the limit, and exceeding the budget.
- Added local storage so the budget and expense records remain after a page refresh in the same browser.
- Added input validation and responsive styling for smaller screens.

## How conditionals are used

The project uses `if`, `else if`, and `else` statements to make decisions based on the user's data. For example:

- If the budget is zero or has not been set, the dashboard asks the user to set one.
- If total expenses are greater than the budget, the dashboard warns that the budget has been exceeded.
- If spending equals the budget, the dashboard reports that the limit has been reached.
- If spending reaches 80% of the budget, the dashboard shows a caution message.
- Otherwise, the dashboard confirms that spending is within budget.

Conditionals also validate the forms so blank names, missing categories, and amounts that are zero or negative are rejected.

## How arrays store data

The `expenses` array stores multiple expense objects. Each object contains an `id`, `name`, `amount`, and `category`. The `push()` method adds a new record. The `filter()` method removes a selected record without changing unrelated records. The full array is converted to JSON and saved in browser local storage.

## How loops process records

The `for...of` loop in `calculateTotalExpenses()` visits each expense and adds its amount to the total. Another `for...of` loop in `renderExpenses()` creates a table row for every expense in the array. This means the app can handle many records without creating separate variables for each expense.

## How the DOM is updated

JavaScript selects dashboard elements with methods such as `document.querySelector()`. The `textContent` property updates the budget, spent amount, remaining balance, percentage, and feedback messages. The `document.createElement()` method builds table rows and category labels. `append()`, `appendChild()`, and `replaceChildren()` update the expense table whenever data changes. The progress bar's width and accessible status are also updated dynamically.

## How user interactions use events

- The budget form listens for the `submit` event to validate and save the monthly budget.
- The expense form listens for `submit` to validate input, create an expense object, add it to the array, and refresh the dashboard.
- Each Delete button listens for a `click` event to remove its expense.
- The Clear all expenses button listens for a `click` event and asks for confirmation before clearing the records.

The form submit handlers use `event.preventDefault()` so the page does not reload when a form is submitted.

## Challenges and solutions

- **Keeping the summary and table in sync:** I solved this by calling `renderExpenses()` after every change to the budget or expense array.
- **Handling incorrect input:** I added validation for empty names, missing categories, and invalid or non-positive numbers.
- **Checking different budget situations:** I used conditional statements to show different messages for normal, caution, limit, and over-budget cases.
- **Keeping records after refresh:** I used `localStorage` with `JSON.stringify()` and `JSON.parse()`, and added error handling in case browser storage is unavailable.
- **Preventing unsafe text from becoming HTML:** Expense names are inserted with `textContent` instead of treating user input as HTML.

## How to run and test

1. Open the repository and ensure `index.html`, `style.css`, `script.js`, and `README.md` are present.
2. Open `index.html` in a modern web browser. You can also use the VS Code Live Server extension.
3. Set a monthly budget, such as **KSh 10,000**.
4. Add Food for **KSh 1,500** and Transport for **KSh 500**. The dashboard should show **KSh 2,000** spent and **KSh 8,000** remaining.
5. Add expenses until you reach 80% of your budget, reach the exact limit, and exceed the limit. Check the feedback and progress bar.
6. Delete one expense and confirm that the totals update.
7. Refresh the page and confirm that the budget and records remain saved.
8. Try invalid values such as an empty expense name or a zero amount and confirm that the form rejects them.
9. Use Clear all expenses and confirm the action in the dialog.

## Technologies

- HTML5
- CSS3
- JavaScript (conditionals, arrays, loops, functions, DOM manipulation, event listeners, and local storage)
- Google Fonts: DM Sans and Manrope

## Repository

https://github.com/jinarabdalla/plp_week6
