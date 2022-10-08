// constants & elements
const demandList = document.querySelector("#select-demand");
const pressureList = document.querySelector("#select-pressure");
const resultFrame = document.querySelector("#result-frame");
demandFilterLow = 0;
demandFilterHigh = 0;
pressureFilter = 0;

fetch("https://sheetdb.io/api/v1/wr91xj5tiv7i0")
  .then((response) => response.json())
  .then((json) => renderData(json));

// first render function
function renderData(data) {
  // constants & elements
  products = data;
  let demandOptions = [];
  let pressureOptions = [];

  // add event listeners to filters
  demandList.addEventListener("change", (e) => handleDemandChange(e));
  pressureList.addEventListener("change", (e) => handlePressureChange(e));

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
    element.low = option.split("-")[0];
    element.high = option.split("-")[1];
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
    filteredList = filteredList
      .filter((item) => {
        return item.airDemandLow == demandFilterLow;
      })
      .filter((item) => {
        return item.airDemandHigh == demandFilterHigh;
      });
  }

  // apply air pressure filter
  if (pressureFilter != 0) {
    filteredList = filteredList.filter((item) => {
      return item.airPressure == pressureFilter;
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
      element.style.backgroundColor = "#28282822";
      resultFrame.appendChild(element);
    }
  });
}
