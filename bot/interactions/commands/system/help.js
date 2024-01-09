const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const path = require("path");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

module.exports = {
  name: "help",
  aliases: ["h"],
  slashcommand: new SlashCommandBuilder()
    .setName("help")
    .setDMPermission(false)
    .setDescription("Get help with the commands"),
  ephemeral: false,
  category: parentDirectoryName,
  textcommand: false,
  async executeText(client, message, args) {
    let response = await execute(client);
    message.channel.send(response);
  },
  async executeSlash(interaction, client) {
    let response = await execute(client);
    interaction.editReply(response);
  },
};

async function execute(client) {
  // Get all commands registered in the client and add them to the embed
  let embed = new EmbedBuilder()
    .setTitle("Help")
    .setColor(0x2b2d31)
    .setDescription("Help Menu");

  client.slashcommands.forEach((command) => {
    embed.addFields({
      name: `${command.slashcommand.name} ${
        command.textcommand
          ? "(" +
            command.name +
            `${command.aliases ? " | " + command.aliases.join(" | ") : ""})`
          : ""
      }`,
      value: `${command.slashcommand.description}`,
    });
  });

  return { embeds: [embed] };
}
