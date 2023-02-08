//bank
const getLoan = document.getElementById("getLoanButton");
const bankBalance = document.getElementById("bankBalance");

//work
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const payCheckValue = document.getElementById("payTableValue");

//bank variable(s)
let balance = 2069;
let loanBalance = 0;
let totalBalance = 0;
let hasLoan = false;

//work variable(s)
let payBalance = 0;
const deductLoanPercentage = 0.1;
const salary = 100;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const updateData = () => {
  bankBalance.innerText = formatCurrency(balance);
  payCheckValue.innerText = formatCurrency(payBalance);

  if (hasLoan) {
    const loanBalanceId = document.getElementById("loanBalanceId");
    loanBalanceId.innerText = formatCurrency(loanBalance);
  }
};

updateData();

const handleGetLoan = () => {
  if (loanBalance !== 0) {
    console.log(
      "You may not have two loans at once. The initial loan should be paid back in full."
    );
    return;
  }

  const loanInput = prompt("Please enter the amount you want to loan:", "100");
  const loanBalanceInput = parseInt(loanInput);

  if (isNaN(loanBalanceInput)) {
    console.log("Please give a valid number");
    return;
  }

  if (loanBalanceInput >= 2 * balance) {
    console.log("You cannot get a loan more than double of your bank balance");
    return;
  }

  loanBalance += loanBalanceInput;
  hasLoan = true;

  addLoanTable();
  addRepayButton();
};

const handleWork = () => {
  payBalance += salary;
  updateData();
};

const handleBank = () => {
  if (payBalance === 0) {
    console.log("You first need to work.");
    return;
  }

  if (loanBalance === 0) {
    updateBalances(payBalance, 0);
    return;
  }

  if (loanBalance < payBalance * deductLoanPercentage) {
    updateBalances(payBalance - loanBalance, 0);
    removeLoanTable();
    removeRepayButton();
    return;
  }

  updateBalances(
    payBalance - payBalance * deductLoanPercentage,
    loanBalance - payBalance * deductLoanPercentage
  );

  if (loanBalance <= 0) {
    removeLoanTable();
    removeRepayButton();
  }
};

const updateBalances = (updatedBalance, updatedLoanBalance) => {
  balance += updatedBalance;
  payBalance = 0;
  loanBalance = updatedLoanBalance;
  updateData();
};

const addLoanTable = () => {
  const table = document.createElement("TD");
  table.id = "loanBalanceId";
  const tableName = document.createTextNode("Outstanding loan");
  table.appendChild(tableName);
  const tableValue = document.createTextNode(formatCurrency(loanBalance));
  table.appendChild(tableValue);
  document.getElementById("deptTable").appendChild(table);
};

const removeLoanTable = () => {
  const parentNode = document.getElementById("deptTable");
  const table = document.getElementById("loanBalanceId");
  parentNode.removeChild(table);
  hasLoan = false;
};

const addRepayButton = () => {
  const button = document.createElement("button");
  button.id = "repayLoanButtonId";
  button.textContent = "Repay Loan";
  document.getElementById("buttonParent").appendChild(button);
};

const removeRepayButton = () => {
  const buttonParent = document.getElementById("buttonParent");
  const button = document.getElementById("repayLoanButtonId");
  buttonParent.removeChild(button);
};

// const handleBank = () => {
//   if (payBalance === 0) {
//     console.log("You first need to work.");
//     return;
//   }

//   if (loanBalance === 0) {
//     balance += payBalance;
//     payBalance = 0;
//     updateData();
//     return;
//   }

//   if (loanBalance < payBalance * deductLoanPercentage) {
//     balance += payBalance - loanBalance;
//     payBalance = 0;
//     loanBalance = 0;
//     updateData();

//     const parentNode = document.getElementById("deptTable");
//     const table = document.getElementById("loanBalanceId");
//     parentNode.removeChild(table);
//     hasLoan = false;
//     return;
//   }

//   loanBalance -= payBalance * deductLoanPercentage;
//   balance += payBalance - payBalance * deductLoanPercentage;
//   payBalance = 0;
//   updateData();

//   console.log(loanBalance);
//   if (loanBalance <= 0) {
//     const parentNode = document.getElementById("deptTable");
//     const table = document.getElementById("loanBalanceId");
//     parentNode.removeChild(table);
//     hasLoan = false;
//   }
// };
