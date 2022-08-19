'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-08-13T14:11:59.604Z',
    '2022-08-16T17:01:17.194Z',
    '2022-08-18T23:36:17.929Z',
    '2022-08-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// , account3, account4
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// FUNCTIONS

///// display movements
const displayMovements = function (accnt, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? accnt.movements.slice().sort((a, b) => a - b)
    : accnt.movements;

  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(accnt.movementsDates[i]);

    const html = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${formatMovementDate(date)}</div>
    <div class="movements__value">${movement.toFixed(2)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

///// display balance
const displayBalance = function (accnt) {
  accnt.balance = accnt.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${accnt.balance.toFixed(2)} EUR`;
};
// displayBalance(account1);

///// display summary
const displaySummary = function (accnt) {
  const inAmount = accnt.movements
    .filter(item => item > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const outAmount = accnt.movements
    .filter(item => item < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const interest = accnt.movements
    .filter(item => item > 0)
    .map(item => (item * accnt.interestRate) / 100)
    .filter(item => item >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${inAmount.toFixed(2)} EUR`;
  labelSumOut.textContent = `${Math.abs(outAmount).toFixed(2)} EUR`;
  labelSumInterest.textContent = `${interest} EUR`;
};

// displaySummary(account1);

const updateUI = function (account) {
  // display movements
  displayMovements(account);

  // display balance
  displayBalance(account);

  // display summary
  displaySummary(account);
};

///// generate username
const generateUsername = function (accnts) {
  accnts.forEach(accnt => {
    accnt.username = accnt.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};
generateUsername(accounts);

///// generate date
const generateDate = date => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = `${newDate.getMonth() + 1}`.padStart(2, 0);
  const day = `${newDate.getDate()}`.padStart(2, 0);
  return `${year}/${month}/${day}`;
};

///// generate date passed
// const generateDatePassed = (date1, date2) => {
//   Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
// };

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// Fake ALways log in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Generate now date
const now = new Date();
const nowDate = generateDate(now);
const hour = `${now.getHours() + 1}`.padStart(2, 0);
const min = `${now.getMinutes() + 1}`.padStart(2, 0);
labelDate.textContent = `${nowDate}, ${hour}: ${min}`;

/////// Login btn handler
btnLogin.addEventListener('click', event => {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer BTN handler
btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(generateDate(new Date()));
    receiverAcc.movementsDates.push(generateDate(new Date()));

    // Update UI
    updateUI(currentAccount);
  }
});

// Close BTN handler
btnClose.addEventListener('click', event => {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      accnt => accnt.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Loan BTN handler
btnLoan.addEventListener('click', event => {
  event.preventDefault();

  const loan = Number(inputLoanAmount.value);

  if (loan > 0 && currentAccount.movements.some(mov => mov >= 0.1 * loan)) {
    currentAccount.movements.push(loan);
    currentAccount.movementsDates.push(new Date().toISOString());
  }

  inputLoanAmount.value = '';

  updateUI(currentAccount);
});

// Sort BTN handler
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////Random Number
// const randomInt = (min, max) => {
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// };

// const generateDatePassed = (date1, date2) => {
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// };
