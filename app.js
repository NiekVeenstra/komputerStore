const getLoan = document.getElementById("getLoanButton");
const bankBalance = document.getElementById("bankBalance");

let balance = 2069;
let loanBalance = 0;
let totalBalance = 0;

bankBalance.innerText = formatCurrency(balance);

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
  const tableName = document.createTextNode("Outstanding loan");
  table.appendChild(tableName);
  const tableValue = document.createTextNode(formatCurrency(loanBalance));
  table.appendChild(tableValue);
  document.getElementById("deptTable").appendChild(table);
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
