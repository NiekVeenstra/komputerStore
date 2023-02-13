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
    alert("You may not have two loans at once. The initial loan should be paid back in full.");
    return;
  }

  const loanInput = prompt("Please enter the amount you want to loan:", "100");
  const loanBalanceInput = parseInt(loanInput);

  if (isNaN(loanBalanceInput)) {
    alert("Please give a valid number");
    return;
  }

  if (loanBalanceInput >= 2 * balance) {
    alert("You cannot get a loan more than double of your bank balance");
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
    alert("You first need to work.");
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
let selectedComputerTitle = "";
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
  selectedComputerTitle = computers[0].title;
  computerInfoElement.innerText = computers[0].description;
  selectedComputerPriceElement.innerText = formatCurrency(computers[0].price);
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
  
  imageElement.addEventListener("error", function () {
    console.log("error");
    imageElement.src = `data:image/jpeg;base64,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`;
  });

  computerTitleElement.innerText = selectedComputer.title;
  selectedComputerTitle = selectedComputer.title;
  computerInfoElement.innerText = selectedComputer.description;
  selectedComputerPriceElement.innerText = formatCurrency(selectedComputer.price);
};

const handleBuyNow = () => {
  if (balance >= computerPrice) {
    balance -= computerPrice;
    alert(`have fun with your new ${selectedComputerTitle}`);
  } else {
    alert("You do not have enough money sorry");
  }
  updateData();
};

// const image = new Image();
// image.src = "https://example.com/api/image.png";

// image.addEventListener("load", function () {
//   // The image has loaded successfully, do something here
//   console.log("load");
// });

// image.addEventListener("error", function () {
//   // The image could not be loaded, handle the error here
//   console.log("error");
//   imageElement.src = `https://hickory-quilled-actress.glitch.me/assets/images/1.png`;
// });
