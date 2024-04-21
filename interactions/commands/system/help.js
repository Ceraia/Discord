const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  slashcommand: new SlashCommandBuilder()
    .setName("help")
    .setDMPermission(true)
    .setDescription("Get help with the commands."),
  category: "system",
  textcommand: true,
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeText(client, message, args) {
    let response = await execute(client);
    message.channel.send(response);
  },
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    let response = await execute(client);
    interaction.editReply(response);
  },
};

async function execute(client) {
  // Organize commands by category
  const commandsByCategory = {};
  client.slashcommands.forEach((command) => {
    if (command.category) {
      if (!commandsByCategory[command.category]) {
        commandsByCategory[command.category] = [];
      }

      commandsByCategory[command.category].push(command);
    }
  });

  // Create the embed
  let embed = new EmbedBuilder()
    .setTitle("Help")
    .setColor(0x2b2d31)
    .setDescription("Help Menu");

  // Add fields for each category
  for (const [category, commands] of Object.entries(commandsByCategory)) {
    const commandList = commands
      .map(
        (cmd) =>
          `/${cmd.slashcommand.name} ${
            cmd.textcommand
              ? "(" +
                cmd.name +
                `${cmd.aliases ? " | " + cmd.aliases.join(` | `) : ""})`
              : ""
          }`
      )
      .join("\n");

    embed.addFields({
      name: category,
      value: commandList,
    });
  }

  return { embeds: [embed] };
}
