const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getStock } = require("../../functions/stockMarket");
const path = require("path");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

let command = new SlashCommandBuilder()
  .setName("search")
  .setDMPermission(false)
  .setDescription("Search for a stock in the stock market")
  .addStringOption((option) =>
    option
      .setName("stock")
      .setDescription("The stock to search for")
      .setRequired(true)
  );

module.exports = {
  name: "search",
  aliases: ["s"],
  slashcommand: command,
  ephemeral: false,
  textcommand: true,
  category: parentDirectoryName,
  async executeText(client, message, args) {
    let response = await execute(client, args[0]);
    message.channel.send(response);
  },
  async executeSlash(interaction, client) {
    let response = await execute(
      client,
      interaction.options.getString("stock")
    );
    interaction.followUp(response);
  },
};

async function execute(client, stock) {
  if (!stock)
    return {
      content: `Invalid usage. Correct usage: \`${
        client.database.get("guilds").get(message.guild.id).prefix
      }${module.exports.name} ${module.exports.slashcommand.options
        .filter((option) => option.required)
        .map((option) => `<${option.name}>`)
        .join(" ")}\``,
    };

  let stockData = await getStock(client, stock.toUpperCase());

  if (stockData.response) {
    return stockData.response;
  }

  let embed24Hours = new EmbedBuilder()
    .setTitle("Past 24 Hours")
    .setColor("#0d94ee")
    .setDescription(stockData.fluctuations.f24h)
    .setImage("attachment:" + "//t_stock_graphs_24.png");
  let embed7Days = new EmbedBuilder()
    .setTitle("Past 7 Days")
    .setColor("#0d94ee")
    .setDescription(stockData.fluctuations.f7d)
    .setImage("attachment:" + "//t_stock_graphs_168.png");
  let embed30Days = new EmbedBuilder()
    .setTitle("Past 30 Days")
    .setColor("#0d94ee")
    .setDescription(stockData.fluctuations.f30d)
    .setImage("attachment:" + "//t_stock_graphs_720.png");

  return {
    content: null,
    embeds: [embed24Hours, embed7Days, embed30Days],
    files: stockData.images,
  };
}
