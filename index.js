// Create an expense object from an array.
const expenseFromArray = ([name, amount, for_]) =>
  ({ name, amount, for: for_ })

// If expense is an array, convert it to the object format.
const unifyExpenseType = expense =>
  Array.isArray(expense) ? expenseFromArray(expense) : expense

// If expense doesn't have a `for` array, set it to the whole group.
const unifyExpenseFor = group => expense =>
  expense.for ? expense : Object.assign({}, expense, { for: group })

// For a given group and expenses list, unify the expense format to
// be an object with all explicit properties.
const unifyExpenses = group => expenses =>
  expenses
    .map(unifyExpenseType)
    .map(unifyExpenseFor(group))

// Update a member debt with given amount.
const updateMember = amount => (debts, name) =>
  Object.assign({}, debts, { [name]: (debts[name] || 0) + amount })

// Return updated debts of each group member according to an expense
// object.
const aggregateExpense = (debts, expense) =>
  expense.for.reduce(
    updateMember(Math.round(expense.amount / expense.for.length)), // Update the debtor balances.
    updateMember(-1 * expense.amount)(debts, expense.name)) // Update the creditor balance.

// For a given group and expenses list, aggregate the balance of each
// group member.
const aggregateExpenses = group => expenses =>
  expenses.reduce(aggregateExpense, {})

// Convert a balances object to a list of users with a name and a
// balance.
const balancesToMembers = balances =>
  Object.keys(balances).map(name => ({ name, balance: balances[name] }))

// Pay back given amount to first creditor, return updated debtor,
// creditors and transactions.
const doPayBack = (amount, debtor, creditors, transactions) =>
  [
    // Update debtor balance.
    Object.assign({}, debtor, { balance: debtor.balance - amount }),

    // If credit is cancelled, remove creditor, otherwise update his
    // balance.
    creditors[0].balance + amount === 0 ? creditors.slice(1) : [
      Object.assign({}, creditors[0], { balance: creditors[0].balance + amount }),
      ...creditors.slice(1)
    ],

    // Append transaction from debtor to creditor.
    transactions.concat({ from: debtor.name, to: creditors[0].name, amount })
  ]

// Get the amount to either cancel debtor debt or cancel first creditor
// credit and append the transaction.
const payBack = (debtor, creditors, transactions) =>
  doPayBack(Math.min(debtor.balance, -1 * creditors[0].balance), debtor, creditors, transactions)

// Cancel a debtor debt by adding transactions to creditors, and return
// updated creditors and transactions.
const cancelDebt = (debtor, creditors, transactions) =>
  (debtor.balance > 0 && creditors[0])
    // Recurse through each creditor to give them back money until
    // the debt is cancelled.
    ? cancelDebt(...payBack(debtor, creditors, transactions))
    : [creditors, transactions]

// Split expenses from a list of debtors and creditors.
const realExpenseSplit = (debtors, creditors, transactions = []) =>
  debtors.length
    // Recurse through each debtor to cancel his debt by adding
    // transactions to creditors until there's no more debtor.
    ? realExpenseSplit(debtors.slice(1), ...cancelDebt(debtors[0], creditors, transactions))
    : transactions

// Split expenses from an aggregated object of balances.
const doExpenseSplit = members =>
  realExpenseSplit(
    members.filter(m => m.balance > 0).sort((a, b) => b.balance - a.balance),
    members.filter(m => m.balance < 0).sort((a, b) => a.balance - b.balance))

// Get final balances by users (negative if creditor, positive if debtor).
const getBalances = (group, expenses) =>
  aggregateExpenses(group)(unifyExpenses(group)(expenses))

const fromBalances = balances =>
  doExpenseSplit(balancesToMembers(balances))

// Main export function, formatting input and auto currying.
const expenseSplit = (group, expenses) =>
  expenses
    ? fromBalances(getBalances(group, expenses))
    : expenses => expenseSplit(group, expenses)

expenseSplit.getBalances = getBalances
expenseSplit.fromBalances = fromBalances

module.exports = expenseSplit
