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

bankBalance.innerText = formatCurrency(balance);
payCheckValue.innerText = formatCurrency(payBalance);

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

  const table = document.createElement("TD");
  table.id = "loanBalanceId";
  const tableName = document.createTextNode("Outstanding loan");
  table.appendChild(tableName);
  const tableValue = document.createTextNode(formatCurrency(loanBalance));
  table.appendChild(tableValue);
  document.getElementById("deptTable").appendChild(table);
};

const handleWork = () => {
  payBalance += salary;
  payCheckValue.innerText = formatCurrency(payBalance);
};

const handleBank = () => {
  if (payBalance === 0) {
    console.log("You first need to work.");
    return;
  }

  if (loanBalance === 0) {
    balance += payBalance;
    payBalance = 0;
    bankBalance.innerText = formatCurrency(balance);
    payCheckValue.innerText = formatCurrency(payBalance);
    return;
  }

  loanBalance -= payBalance * deductLoanPercentage;
  balance += payBalance - payBalance * deductLoanPercentage;
  payBalance = 0;
  bankBalance.innerText = formatCurrency(balance);
  payCheckValue.innerText = formatCurrency(payBalance);

  const loanBalanceId = document.getElementById("loanBalanceId");
  loanBalanceId.innerText = formatCurrency(loanBalance);
};
