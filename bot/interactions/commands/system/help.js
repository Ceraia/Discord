const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  slashcommand: new SlashCommandBuilder()
    .setName("help")
    .setDMPermission(false)
    .setDescription("Get help with the commands"),
  category: "system",
  textcommand: false,
  /**
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeText(client, message, args) {
    let response = await execute(client);
    message.channel.send(response);
  },
  /**
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
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
    command.category
      ? embed.addFields({
          name: `${command.slashcommand.name} ${
            command.textcommand
              ? "(" +
                command.name +
                `${command.aliases ? " | " + command.aliases.join(" | ") : ""})`
              : ""
          }`,
          value: `${command.slashcommand.description}`,
        })
      : null;
  });

  return { embeds: [embed] };
}
