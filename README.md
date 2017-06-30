# Expense split [![npm version](http://img.shields.io/npm/v/expense-split.svg?style=flat-square)](https://www.npmjs.org/package/expense-split)

> Group expense splitting library.

## Usage

```js
const expenseSplit = require('expense-split')

const group = ['Michael', 'Trevor', 'Franklin']

const transactions = expenseSplit(group, [
  { name: 'Michael', amount: 7920 }, // Ammu-Nation
  { name: 'Trevor', amount: 2880 }, // Plane "rental"
  { name: 'Trevor', amount: 300 }, // Parachutes
  { name: 'Franklin', amount: 8000, for: ['Michael', 'Franklin'] }, // Sanchez
  { name: 'Franklin', amount: 50, for: ['Michael', 'Franklin'] } // Gas
])
```

Will output:

```js
[
  { from: 'Trevor', to: 'Franklin', amount: 325 },
  { from: 'Trevor', to: 'Michael', amount: 195 }
]
```

Can also work with the light syntax:

```js
const transactions = expenseSplit(group, [
  ['Michael', 7920], // Ammu-Nation
  ['Trevor', 2880], // Plane "rental"
  ['Trevor', 300], // Parachutes
  ['Franklin', 8000, ['Michael', 'Franklin']], // Sanchez
  ['Franklin', 50, ['Michael', 'Franklin']] // Gas
])
```

Also comes with a function to get aggregated balances for all users:

```js
const balances = expenseSplit.getBalances(group, [
  { name: 'Michael', amount: 7920 }, // Ammu-Nation
  { name: 'Trevor', amount: 2880 }, // Plane "rental"
  { name: 'Trevor', amount: 300 }, // Parachutes
  { name: 'Franklin', amount: 8000, for: ['Michael', 'Franklin'] }, // Sanchez
  { name: 'Franklin', amount: 50, for: ['Michael', 'Franklin'] } // Gas
])
```

Will output:

```js
{
  Michael: -195,
  Trevor: 520,
  Franklin: -325
}
```

If you have a balances object, you can also compute the split directly:

```js
const transactions = expenseSplit.fromBalances(balances)
```

## CLI

```sh
# Init a split
expense-split init 2015-04-20-heist

# Define the group (only needed if some people in the group didn't have any expense)
expense-split group Michael Trevor Franklin

# Add expenses
expense-split add Michael 7920 Ammu-Nation
expense-split add Trevor 2880 'Plane "rental"'
expense-split add Trevor 300 Parachutes
expense-split add Franklin 8000 Sanchez --for Michael --for Franklin
expense-split add Franklin 50 Gas --for Michael --for Franklin'

# Get balances
expense-split balances

# Get transactions
expense-split split
```
