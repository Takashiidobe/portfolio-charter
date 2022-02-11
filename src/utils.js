export let dateRanges = {
  oneDay: "1d",
  fiveDays: "5d",
  oneMonth: "1mo",
  threeMonths: "3mo",
  sixMonths: "6mo",
  oneYear: "1y",
  twoYears: "2y",
  fiveYears: "5y",
  tenYears: "10y",
  yearToDay: "ytd",
  max: "max",
};

export async function updateChart(portfolio, time) {
  let values = [];
  let dates = [];

  for (const key in portfolio) {
    if (key == "time") {
      continue;
    }
    let data = await fetchData(key, dateRanges[time]);
    let timestamps = data.chart.result[0].timestamp.sort();
    dates = timestamps.map((x) => {
      if (dateRanges[time] == "1d") {
        return new Date(x * 1000).toLocaleTimeString();
      } else if (dateRanges[time] == "5d") {
        return new Date(x * 1000).toLocaleString();
      } else {
        return new Date(x * 1000).toLocaleDateString();
      }
    });

    const prices = data.chart.result[0].indicators.quote[0].close;

    for (let i = 0; i < dates.length; i++) {
      if (values.length <= i) {
        values.push(prices[i] * portfolio[key]);
      } else {
        values[i] += prices[i] * portfolio[key];
      }
    }
  }

  document.getElementById("myChart").remove();
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "myChart");
  document.body.appendChild(canvas);

  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Portfolio value`,
          data: values,
          pointRadius: 4,
          borderWidth: 5,
        },
      ],
    },
  });
}

export function replaceState(params) {
  if (window.history.replaceState) {
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      params.toString();

    window.history.replaceState(
      {
        path: url,
      },
      "",
      url
    );
  }
}

export async function fetchData(name, time) {
  let interval = "1d";
  switch (time) {
    case "1d":
      interval = "5m";
      break;
    case "5d":
      interval = "15m";
      break;
    case "1mo":
      interval = "1d";
      break;
    case "3mo":
      interval = "1d";
      break;
    case "6mo":
      interval = "5d";
      break;
    case "ytd":
      interval = "1h";
      break;
    case "1y":
      interval = "5d";
      break;
    case "2y":
      interval = "5d";
      break;
    case "5y":
      interval = "3mo";
      break;
    case "10y":
      interval = "3mo";
      break;
    case "max":
      interval = "3mo";
      break;
  }
  try {
    let str = `https://cors-anywhere.takashiidobe.com/https://query1.finance.yahoo.com/v8/finance/chart/${name}?region=US&lang=en-US&includePrePost=false&interval=${interval}&useYfid=true&range=${time}&corsDomain=finance.yahoo.com&.tsrc=finance`;
    const response = await fetch(str);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
