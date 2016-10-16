# Expense split

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
