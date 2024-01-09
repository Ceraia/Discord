const { EmbedBuilder } = require("discord.js");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const { createCanvas } = require("canvas");

// Get the current hash of this file
const hash = require("child_process")
  .execSync("git rev-parse HEAD")
  .toString()
  .trim();

async function generateGraphImage(
  jsonData,
  timeInput = "1d",
  temporary = false
) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");

  // Convert the input formats like 1d 1h 1m to hours
  var hoursAmount = 0;
  if (timeInput.includes("d")) {
    hoursAmount += parseInt(timeInput.split("d")[0]) * 24;
  }
  if (timeInput.includes("h")) {
    hoursAmount += parseInt(timeInput.split("h")[0]);
  }
  if (timeInput.includes("m")) {
    hoursAmount += parseInt(timeInput.split("m")[0]) / 60;
  }

  // Convert the input time in seconds
  const timeInSeconds = hoursAmount * 60 * 60;

  // Set the background color
  ctx.fillStyle = "#2b2d31";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Initialize to the first data point, then adjust through iteration
  var lowestValue = Infinity;
  var highestValue = -Infinity;

  for (let i = 0; i < Object.keys(jsonData.market_data).length; i++) {
    const marketEntry = Object.values(jsonData.market_data)[i];

    // Remove any values that are older than the specified time in seconds
    marketEntry.market.value = marketEntry.market.value.filter(
      (value) => value.timestamp + 900 > Date.now() / 1000 - timeInSeconds
    );

    // Find the lowest and highest values
    const values = marketEntry.market.value;

    for (let j = 0; j < values.length; j++) {
      const value = values[j];

      if (value.value < lowestValue) {
        lowestValue = value.value;
      }

      if (value.value > highestValue) {
        highestValue = value.value;
      }
    }
  }

  // Calculate the y axis reference value so the bottom of the graph is the lowest value and the top of the graph is the highest value
  const yRef = canvas.height / (highestValue - lowestValue);

  // Drawing dotted lines for the y-axis and adding labels for the value
  ctx.beginPath();
  ctx.strokeStyle = "#4f4f4f";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < 10; i++) {
    const y = canvas.height - i * (canvas.height / 10);
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Make the x axis divider lines for the amount of hours.
  ctx.beginPath();
  ctx.strokeStyle = "#4f4f4f";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < hoursAmount; i++) {
    const x =
      i *
      (canvas.width / (hoursAmount > 24 ? hoursAmount / 24 : hoursAmount / 2));
    // make dotted line
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  // Draw the lines on the canvas
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw the x axis labels for the amount of hours it is ago from right to left
  for (let i = 0; i <= hoursAmount; i++) {
    const x =
      canvas.width -
      i *
        (canvas.width /
          (hoursAmount > 24 ? hoursAmount / 24 : hoursAmount / 2)) -
      10;
    // add label
    ctx.fillStyle = "#4f4f4f";
    ctx.font = "12px Arial";
    ctx.fillText(
      // If greater than 24 hours, multiply by one day, otherwise multiply by 2 hours
      (hoursAmount > 24 ? i * 1 : i * 2) +
        `${hoursAmount > 24 ? (i > 1 ? " days" : " day") : "hrs"} ago`,
      x + 18,
      canvas.height - 10
    );
  }

  // Generate a graph of all the stock values
  for (let i = 0; i < Object.keys(jsonData.market_data).length; i++) {
    const marketEntry = Object.values(jsonData.market_data)[i];

    // Plot the values for the current market entry
    const values = marketEntry.market.value;

    // Flip the array so the oldest value is first
    values.reverse();

    // Get the appropriate color for the current market entry
    const color = marketEntry.appearance.color;

    // Plot the values
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let j = 0; j < values.length; j++) {
      const value = values[j];

      // Calculate the time difference in seconds
      const timeDifference = Date.now() / 1000 - value.timestamp;

      // Get the x coordinate for the point but with the x coordinate starting at the right of the canvas and going left
      const x =
        canvas.width -
        (timeDifference / (60 * 60 * hoursAmount)) * canvas.width;
      const y = canvas.height - (value.value - lowestValue) * yRef;

      // Plot the point
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Draw the lines on the canvas
    ctx.stroke();
  }

  // Add colored small square with the market entry and just the id for display in rows of 2 and then continue on the next row
  for (let i = 0; i < Object.keys(jsonData.market_data).length; i++) {
    const marketEntry = Object.values(jsonData.market_data)[i];

    // Get the appropriate color for the current market entry
    const color = marketEntry.appearance.color;

    // Add the colored square
    ctx.fillStyle = color;
    ctx.fillRect(
      (i % 16) * (canvas.width / 23) + 10,
      Math.floor(i / 16) * 20 + 10,
      33,
      10
    );

    // Check if the color is too white and if so change the text to black
    var textColor = "#ffffff";
    if (color == "#ffffff" || color == "#ffff00") {
      textColor = "#2b2d31";
    }

    // Add the market entry id
    ctx.fillStyle = textColor;
    ctx.font = "12px Arial"; // Adjusted font size
    ctx.fillText(
      marketEntry.id,
      (i % 16) * (canvas.width / 23) + 11,
      Math.floor(i / 16) * 20 + 20,
      30
    );
  }

  // Add in the price labels
  for (let i = 0; i < 10; i++) {
    const y = canvas.height - i * (canvas.height / 10);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(
      "  $" + Math.round(lowestValue + ((highestValue - lowestValue) / 10) * i),
      0,
      y - 5
    );
  }

  let path = `./generated/${temporary ? "t_" : ""}stock_graphs${(hoursAmount = 0
    ? ""
    : "_" + hoursAmount)}`;

  // Save the canvas as a PNG file
  const buffer = canvas.toBuffer("image/png");
  return await fs.writeFile(`${path}.png`, buffer);
}

async function getFluctuations(client, timeInput = "24h", stockId = null) {
  // Initialize an empty string for market status
  let marketStatus = "";

  // Convert the input formats like 1d 1h 1m to seconds
  let timeInSeconds = 0;
  if (timeInput.includes("d")) {
    timeInSeconds += parseInt(timeInput.split("d")[0]) * 24 * 60 * 60;
  }
  if (timeInput.includes("h")) {
    timeInSeconds += parseInt(timeInput.split("h")[0]) * 60 * 60;
  }
  if (timeInput.includes("m")) {
    timeInSeconds += parseInt(timeInput.split("m")[0]) * 60;
  }

  try {
    // Fetch JSON data from the specified URL
    const response = await fetch(
      `https://xdbl.dev/api/stocks/v4/?instance=${client.settings.instance}`
    );
    const jsonData = await response.json();

    // Loop through the market data
    for (const marketEntry of Object.values(jsonData.market_data)) {
      const values = marketEntry.market.value;

      // Filter values based on timeInput
      const filteredValues = values.filter(
        (value) => value.timestamp > Date.now() / 1000 - timeInSeconds
      );

      // Remove the stock if it is not the specified stock
      if (stockId !== null && marketEntry.id !== stockId) {
        continue;
      }

      // Skip if less than two data points are available
      if (filteredValues.length < 2) {
        continue;
      }

      // Calculate the fluctuation
      const fluctuation =
        filteredValues[filteredValues.length - 1].value -
        filteredValues[0].value;

      // Calculate the percentage change
      const percentageChange = (
        (fluctuation / filteredValues[0].value) *
        100
      ).toFixed(2);

      // Update market status string
      marketStatus += `${marketEntry.name} (${marketEntry.id})  \`$${
        values[values.length - 1].value
      }\` ${fluctuation > 0 ? "`+" : "`"}${percentageChange}%\`\n`;
    }

    return marketStatus;
  } catch (error) {
    client.error(error.stack);
    return "Internal error.";
  }
}

async function getStock(client, stock) {
  try {
    // Fetch JSON data from the specified URL
    const response = await fetch(
      `https://xdbl.dev/api/stocks/v4/?instance=${client.settings.instance}&search=${stock}`
    );
    const jsonData = await response.json();

    // Check if the stock exists
    if (jsonData.market_data.length == 0) {
      return {
        response:
          "Stock not found, are you sure you entered the correct stock ID?",
      };
    }

    // Generate a string showcasing the fluctuation values of the past 24 hours, 7 days and 30 days.
    var fluctuation24h = "";
    var fluctuation7d = "";
    var fluctuation30d = "";

    for (let i = 0; i < Object.keys(jsonData.market_data).length; i++) {
      const marketEntry = Object.values(jsonData.market_data)[i];

      const values = marketEntry.market.value;

      // Get all the values in the last 24 hours
      const values24h = values.filter(
        (value) => value.timestamp > Date.now() / 1000 - 24 * 60 * 60
      );

      // Get all the values in the last 7 days
      const values7d = values.filter(
        (value) => value.timestamp > Date.now() / 1000 - 7 * 24 * 60 * 60
      );

      // Get all the values in the last 30 days
      const values30d = values.filter(
        (value) => value.timestamp > Date.now() / 1000 - 30 * 24 * 60 * 60
      );

      // Find the fluctuation in the last 24 hours from the earliest value to the latest value
      const fluctuation24hValue =
        values24h[values24h.length - 1].value - values24h[0].value;

      // Find the fluctuation in the last 7 days from the earliest value to the latest value
      const fluctuation7dValue =
        values7d[values7d.length - 1].value - values7d[0].value;

      // Find the fluctuation in the last 30 days from the earliest value to the latest value
      const fluctuation30dValue =
        values30d[values30d.length - 1].value - values30d[0].value;

      // Add the fluctuation values to the string
      fluctuation24h +=
        marketEntry.name +
        " (" +
        marketEntry.id +
        ")  " + // Add with how much percent the value has changed
        "`$" +
        values[values.length - 1].value +
        "` " +
        (fluctuation24hValue > 0 ? "`+" : "`") +
        Math.round((fluctuation24hValue / values24h[0].value) * 100) +
        "%`\n";
      fluctuation7d +=
        marketEntry.name +
        " (" +
        marketEntry.id +
        ")  " + // Add with how much percent the value has changed
        "`$" +
        values[values.length - 1].value +
        "` " +
        (fluctuation7dValue > 0 ? "`+" : "`") +
        Math.round((fluctuation7dValue / values7d[0].value) * 100) +
        "%`\n";
      fluctuation30d +=
        marketEntry.name +
        " (" +
        marketEntry.id +
        ")  " + // Add with how much percent the value has changed
        "`$" +
        values[values.length - 1].value +
        "` " +
        (fluctuation30dValue > 0 ? "`+" : "`") +
        Math.round((fluctuation30dValue / values30d[0].value) * 100) +
        "%`\n";

      const image30d = await generateGraphImage(jsonData, "30d", true);
      const image7d = await generateGraphImage(jsonData, "168h", true);
      const image24h = await generateGraphImage(jsonData, "24h", true);

      return await {
        fluctuations: {
          f24h: fluctuation24h,
          f7d: fluctuation7d,
          f30d: fluctuation30d,
        },
        images: [
          {
            attachment: "./generated/t_stock_graphs_24.png",
            name: "t_stock_graphs_24.png",
          },
          {
            attachment: "./generated/t_stock_graphs_168.png",
            name: "t_stock_graphs_168.png",
          },
          {
            attachment: "./generated/t_stock_graphs_720.png",
            name: "t_stock_graphs_720.png",
          },
        ],
      };
    }
  } catch (error) {
    client.log(error);
    return "Internal error.";
  }
}

async function updateWallboard(client) {
  try {
    let buildHash = "DEADBEEF";
    // Fetch JSON data from the specified URL
    const response = await fetch(
      `https://xdbl.dev/api/stocks/v4/?instance=${client.settings.instance}`
    );
    const jsonData = await response.json();

    // Set build hash
    buildHash = jsonData.public_data.build_hash.substring(0, 7);

    // Generate the graph images
    await generateGraphImage(jsonData, "168h", false);
    await generateGraphImage(jsonData, "24h", false);

    // Pick a random stock and remove all others from the JSON data
    const randomStock = Object.values(jsonData.market_data)[
      Math.floor(Math.random() * Object.keys(jsonData.market_data).length)
    ];
    jsonData.market_data = [randomStock];

    // Generate the graph image for the random stock
    await generateGraphImage(jsonData, "24h", true);

    // Create the wallboard message
    const embedHeader = new EmbedBuilder()
      .setTitle("UDark RP Stock Graphs")
      .setColor("#0d95ee");
    const embed24Hours = new EmbedBuilder()
      .setTitle("Stock graphs for the past 24 hours")
      .setDescription(await getFluctuations(client, "24h"))
      .setImage("attachment:" + "//stock_graphs_24.png")
      .setColor("#0d95ee");
    const embed168Hours = new EmbedBuilder()
      .setTitle("Stock graphs for the past week")
      .setDescription(await getFluctuations(client, "168h"))
      .setImage("attachment:" + "//stock_graphs_168.png")
      .setColor("#0d95ee");
    const embed24HoursRandom = new EmbedBuilder()
      .setTitle(`${randomStock.name} (${randomStock.id}) - past 24 hours`)
      .setDescription(await getFluctuations(client, "24h", randomStock.id))
      .setImage("attachment:" + "//t_stock_graphs_24.png")
      .setColor("#0d95ee");
    const embedFooter = new EmbedBuilder()
      .setDescription(
        "This message will automatically update every 30 seconds with the latest stock information.\nLast updated: <t:" +
          Math.floor(Date.now() / 1000) +
          ":R>"
      )
      .setFooter({
        text:
          "API-B : " + buildHash + " | BOT-B : " + hash.substring(0, 7) + "",
      })
      .setColor("#0d95ee");

    try {
      client.channels.cache
        .get("1150399269254213662")
        .messages.fetch("1150399691406704671")
        .then((msg) => {
          msg.edit({
            content: "** **",
            embeds: [
              embedHeader,
              embed24Hours,
              embed168Hours,
              embed24HoursRandom,
              embedFooter,
            ],
            files: [
              {
                attachment: "./generated/stock_graphs_24.png",
                name: "stock_graphs_24.png",
              },
              {
                attachment: "./generated/stock_graphs_168.png",
                name: "stock_graphs_168.png",
              },
              {
                attachment: "./generated/t_stock_graphs_24.png",
                name: "t_stock_graphs_24.png",
              },
            ],
          });
        });
    } catch (error) {
      client.error("Failure to edit wallboard message."); //client.error(error.stack);
      return "Internal error.";
    }
  } catch (error) {
    client.error("Failure while fetching market data.");
    return "Internal error.";
  }
}

module.exports = {
  updateWallboard,
  generateGraphImage,
  getStock,
};
