//bank
const getLoan = document.getElementById("getLoanButton");
const bankBalance = document.getElementById("bankBalance");
const totalBalanceTable = document.getElementById("totalBalanceTable");

const tableRow = document.getElementById("deptTable");

//work
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const payCheckValue = document.getElementById("payTableValue");

//bank variable(s)
let balance = 2069;
let loanBalance = 0;
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
    const tableValueId = document.getElementById("tableValueId");
    tableValueId.innerText = formatCurrency(loanBalance);
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
  balance += loanBalanceInput;

  addLoanTable();
  addRepayButton();
  updateData();
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
  const nameCell = document.createElement("td");
  nameCell.id = "tableNameId";
  const tableName = document.createTextNode("Outstanding loan");
  nameCell.appendChild(tableName);

  const valueCell = document.createElement("td");
  valueCell.id = "tableValueId";
  const tableValue = document.createTextNode(formatCurrency(loanBalance));
  valueCell.appendChild(tableValue);

  tableRow.appendChild(nameCell);
  tableRow.appendChild(valueCell);
};

const removeLoanTable = () => {
  const nameCell = document.getElementById("tableNameId");
  const valueCell = document.getElementById("tableValueId");
  tableRow.removeChild(nameCell);
  tableRow.removeChild(valueCell);
  hasLoan = false;
};

const addRepayButton = () => {
  const button = document.createElement("button");
  button.id = "repayLoanButtonId";
  button.textContent = "Repay Loan";
  button.addEventListener("click", handleRepayLoan);
  document.getElementById("buttonParent").appendChild(button);
};

const removeRepayButton = () => {
  const buttonParent = document.getElementById("buttonParent");
  const button = document.getElementById("repayLoanButtonId");
  buttonParent.removeChild(button);
};

const handleRepayLoan = () => {
  if (loanBalance < payBalance) {
    updateBalances(payBalance - loanBalance, 0);
    removeLoanTable();
    removeRepayButton();
    return;
  }

  updateBalances(payBalance - payBalance, loanBalance - payBalance);

  if (loanBalance <= 0) {
    removeLoanTable();
    removeRepayButton();
  }
};

// api call
let computers = [];
const computersElement = document.getElementById("laptopDropdown");
const featureDataElement = document.getElementById("featureData");
const imageContainerElement = document.getElementById("imageContainer");
const infoContainerElement = document.getElementById("infoContainer");

const computerTitleElement = document.getElementById("computerTitle");
const computerInfoElement = document.getElementById("computerInfo");
const selectedComputerPriceElement = document.getElementById("selectedComputerPrice");

let computerPrice = 0;

fetch("https://hickory-quilled-actress.glitch.me/computers")
  .then((response) => response.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToMenu(computers))
  .catch((error) => {
    console.error("An error occurred:", error);
  });

const addComputersToMenu = (computers) => {
  computers.forEach((x) => addComputerToMenu(x));
  computers[0].specs.forEach((spec) => {
    const paragraph = document.createElement("p");
    paragraph.appendChild(document.createTextNode(spec));
    featureDataElement.appendChild(paragraph);
  });

  computerTitleElement.innerText = computers[0].title;
  computerInfoElement.innerText = computers[0].description;
  selectedComputerPriceElement.innerText = computers[0].price;
  computerPrice = computers[0].price;

  const selectedComputer = computers[0];
  let imageElement = imageContainerElement.querySelector("img");
  imageElement = document.createElement("img");
  imageContainerElement.appendChild(imageElement);
  imageElement.src = `https://hickory-quilled-actress.glitch.me/${selectedComputer.image}`;
};

const addComputerToMenu = (computer) => {
  const computerElement = document.createElement("option");
  computerElement.value = computer.id;
  computerElement.appendChild(document.createTextNode(computer.title));
  computersElement.appendChild(computerElement);
};

const handleComputerMenuChange = (e) => {
  console.log("menuChange");
  const selectedComputer = computers[e.target.selectedIndex];
  updateSelectionArea(selectedComputer);
  updateComputerInfoArea(selectedComputer);
};

computersElement.addEventListener("change", handleComputerMenuChange);

const updateSelectionArea = (selectedComputer) => {
  const specs = selectedComputer.specs;
  let featureData = "";
  specs.forEach((x) => {
    featureData += x + "\n";
  });
  featureDataElement.innerText = featureData;
  computerPrice = selectedComputer.price;
};

const updateComputerInfoArea = (selectedComputer) => {
  let imageElement = imageContainerElement.querySelector("img");

  if (!imageElement) {
    imageElement = document.createElement("img");
    imageContainerElement.appendChild(imageElement);
  }
  imageElement.src = `https://hickory-quilled-actress.glitch.me/${selectedComputer.image}`;

  computerTitleElement.innerText = selectedComputer.title;
  computerInfoElement.innerText = selectedComputer.description;
  selectedComputerPriceElement.innerText = formatCurrency(selectedComputer.price);
};

const handleBuyNow = () => {
  if (balance >= computerPrice) {
    balance -= computerPrice;
    console.log("have fun with your new laptop");
  } else {
    console.log("not enough money sorry");
  }
  updateData();
};
