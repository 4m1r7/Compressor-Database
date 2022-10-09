// constants & elements
const demandList = document.querySelector("#select-demand");
const pressureList = document.querySelector("#select-pressure");
const resultFrame = document.querySelector("#result-frame");
const projectInput = document.querySelector("#pname");
const tnumberInput = document.querySelector("#tnumber");
const addressInput = document.querySelector("#address");

demandFilterLow = 0;
demandFilterHigh = 0;
pressureFilter = 0;
project = "";
tnumber = "";
address = "";

demandList.addEventListener("change", handleDemandChange);
pressureList.addEventListener("change", handlePressureChange);
projectInput.addEventListener("change", updateProject);
tnumberInput.addEventListener("change", updateProject);
addressInput.addEventListener("change", updateProject);

fetch("https://sheetdb.io/api/v1/wr91xj5tiv7i0")
  .then((response) => response.json())
  .then((json) => renderData(json));

// first render function
function renderData(data) {
  // constants & elements
  products = data;
  let demandOptions = [];
  let pressureOptions = [];

  // loop through data to populate filters and load initial product list
  data.forEach((model) => {
    // create a list of air pressure unique options
    let range = `${model.airDemandLow}-${model.airDemandHigh}`;
    if (!demandOptions.includes(range)) {
      demandOptions.push(range);
    }

    // create a list of air pressure unique options
    if (!pressureOptions.includes(model.airPressure)) {
      pressureOptions.push(model.airPressure);
    }

    // populate results window with unfiltered list of models
    let element = document.createElement("li");
    element.innerHTML = model.model;
    resultFrame.appendChild(element);
  });

  // populate air pressure filters
  pressureOptions.forEach((option) => {
    let element = document.createElement("option");
    element.innerHTML = option;
    pressureList.appendChild(element);
  });
  // populate air demand filters
  demandOptions.forEach((option) => {
    let element = document.createElement("option");
    element.innerHTML = option;
    demandList.appendChild(element);
  });
}

// update product list when air demand is chosen
function handleDemandChange(e) {
  // accessing air demand range bounfaries
  demandFilterLow = parseFloat(e.target.value.split("-")[0]);
  demandFilterHigh = parseFloat(e.target.value.split("-")[1]);
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
  let filteredList = products;

  // apply air demand filter
  if (demandFilterLow != 0) {
    filteredList = filteredList.filter((item) => {
      return (
        item.airDemandLow >= demandFilterLow &&
        item.airDemandHigh <= demandFilterHigh * 1.1
      );
    });
  }

  // apply air pressure filter
  if (pressureFilter != 0) {
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
    element.innerHTML = model.model;
    element.style.backgroundColor = "#28642844";
    element.style.fontWeight = "550";
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

// check for required inputs
function pdfReq() {
  project && tnumber && address ? generatePDF() : pdfFail();
}

// alert the user to provide required inputs
function pdfFail() {
  console.log("fill all inputs!");
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
  pdf.save("jsPDF_2Pages.pdf");
}
