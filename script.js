// constants & elements
const demandInput = document.querySelector("#select-demand");
const pressureInput = document.querySelector("#select-pressure");
const resultFrame = document.querySelector("#result-frame");
const projectInput = document.querySelector("#pname");
const tnumberInput = document.querySelector("#tnumber");
const addressInput = document.querySelector("#address");
const selectedLabel = document.querySelector("#selected-label");

var demandFilterLow;
var demandFilterHigh;
var pressureFilter;
project = "";
tnumber = "";
address = "";
selected = "";

demandInput.addEventListener("keyup", handleDemandChange);
pressureInput.addEventListener("keyup", handlePressureChange);
projectInput.addEventListener("change", updateProject);
tnumberInput.addEventListener("change", updateProject);
addressInput.addEventListener("change", updateProject);

fetch(
  "https://res.cloudinary.com/cloudstash/raw/upload/v1665401302/data_nc6aip.json"
)
  .then((response) => response.json())
  .then((json) => renderData(json));

// first render function
function renderData(data) {
  // constants & elements
  products = data;

  // loop through data to populate filters and load initial product list
  data.forEach((model) => {
    // populate results window with unfiltered list of models
    let element = document.createElement("li");
    element.innerHTML = model.model;
    resultFrame.appendChild(element);
  });
}

// update product list when air demand is chosen
function handleDemandChange(e) {
  // accessing air demand range bounfaries
  demandFilterLow = parseFloat(e.target.value);
  demandFilterHigh = demandFilterLow * 1.1;

  // update products according to chosen filters
  filterAndUpdate();
}

// update product list when air pressure is chosen
function handlePressureChange(e) {
  // accessing air demand range bounfaries
  pressureFilter = parseFloat(e.target.value);
  // update products according to chosen filters
  filterAndUpdate();
}

function filterAndUpdate() {
  // empty product list
  resultFrame.innerHTML = "";

  // create temp list to filter
  let filteredList = !demandFilterLow && !pressureFilter ? [] : products;

  // apply air demand filter
  if (demandFilterLow) {
    filteredList = filteredList.filter((item) => {
      return (
        (item.airDemandLow <= demandFilterLow &&
          item.airDemandHigh >= demandFilterLow) ||
        (item.airDemandLow <= demandFilterHigh &&
          item.airDemandHigh >= demandFilterHigh)
      );
    });
  }

  // apply air pressure filter
  if (pressureFilter) {
    filteredList = filteredList.filter((item) => {
      return (
        item.airPressure >= pressureFilter &&
        item.airPressure < pressureFilter * 1.2
      );
    });
  }

  // update the suggested list
  filteredList.forEach((model) => {
    let element = document.createElement("li");
    element.classList.add("choice");
    element.innerHTML = model.model;
    element.style.backgroundColor = "#28642844";
    element.style.fontWeight = "550";
    element.style.cursor = "pointer";
    element.addEventListener("click", updateSelectedLabel);
    resultFrame.appendChild(element);
  });

  // create a list of, and add unwanted products
  let suggestedIDs = [];
  filteredList.forEach((model) => {
    suggestedIDs.push(model.id);
  });
  products.forEach((model) => {
    if (!suggestedIDs.includes(model.id)) {
      let element = document.createElement("li");
      element.innerHTML = model.model;
      resultFrame.appendChild(element);
    }
  });
}

// update user inputs
function updateProject(e) {
  switch (e.target.id) {
    case "pname":
      project = e.target.value;
      break;
    case "tnumber":
      tnumber = e.target.value;
      break;
    case "address":
      address = e.target.value;
      break;
  }
}

// select the model that user clicks on, and update label
function updateSelectedLabel(e) {
  selected = e.target.innerText;
  selectedLabel.innerText = selected;
}

// check for required inputs
function pdfReq() {
  console.log(project, tnumber, address, selected);
  project && tnumber && address && selected ? generatePDF() : pdfFail();
}

// alert the user to provide required inputs
function pdfFail() {
  alert("Fill all fields and select a model!");
}

// generate pdf report
function generatePDF() {
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a5",
    putOnlyUsedFonts: true,
  });
  pdf.text("MICAS INDUSTRIAL & TRADING ASSOCIATION", 12, 20);
  pdf.text("Customer Order", 12, 30);
  pdf.text(`Project Name: ${project}`, 12, 50);
  pdf.text(`Phone Number: ${tnumber}`, 12, 60);
  pdf.text(`Address: ${address}`, 12, 70);
  pdf.text(`Compressor Model: ${selected}`, 12, 80);
  pdf.save("jsPDF_2Pages.pdf");
}
