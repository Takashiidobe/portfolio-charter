import { updateChart, dateRanges, replaceState } from "./utils.js";

let selectedTime = document.querySelector("#time");
let params = new URLSearchParams(document.location.search);

let plusLink = document.querySelector("#addField");
let portfolio = document.querySelector("#portfolio");
let fetchPrices = document.querySelector("#fetchPrices");

selectedTime.addEventListener("change", () => {
  params.set("time", selectedTime.value);
  replaceState(params);
});

function addRow([ticker, amount]) {
  let div = document.createElement("div");
  let input1 = document.createElement("input");
  input1.type = "text";
  input1.className = "ticker";
  input1.value = ticker;
  let input2 = document.createElement("input");
  input2.className = "amount";
  input2.type = "text";
  input2.value = amount;
  let label1 = document.createElement("label");
  label1.textContent = "Ticker:";
  let label2 = document.createElement("label");
  label2.textContent = "Amount:";
  div.appendChild(label1);
  div.appendChild(input1);
  div.appendChild(label2);
  div.appendChild(input2);
  portfolio.appendChild(div);
}

plusLink.addEventListener("click", () => {
  addRow(["", ""]);
});

let assets = Object.fromEntries(params);

fetchPrices.addEventListener("click", () => {
  let assets = { time: selectedTime.value };
  Array.from(portfolio.children).forEach((child) => {
    let pair = [];
    Array.from(child.children).forEach((asset) => {
      if (asset.className == "ticker") {
        if (asset.value) {
          pair.push(asset.value);
        }
      }
      if (asset.className == "amount") {
        if (asset.value) {
          pair.push(asset.value);
        }
      }
    });
    if (pair.some((x) => x)) {
      let [ticker, amount] = pair;
      assets[ticker] = amount;
    }
  });

  let params = new URLSearchParams(assets).toString();
  replaceState(params);
  updateChart(assets, selectedTime.value);
});

// parse params on startup

if (Array.from(params).length > 1) {
  selectedTime.value = params.get("time") || "oneDay";
  for (const asset in assets) {
    if (asset != "time") {
      const amount = assets[asset];
      addRow([asset, amount]);
    }
  }

  replaceState(params);
  updateChart(assets, selectedTime.value);
}
