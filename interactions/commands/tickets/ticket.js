const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "ticket",
  slashcommand: new SlashCommandBuilder()
    .setName("ticket")
    .setDMPermission(true)
    .setDescription("Ticket related commands. [C1.0]")
    .addSubcommandGroup((group) =>
      group
        .setName("manage")
        .setDescription("Manage ticket system.")
        .addSubcommand((subcommand) =>
          subcommand.setName("create").setDescription("Create a ticket.")
        )
    ),
  category: "tickets",
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../system/client").BotClient} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    let response = await execute(client);
    interaction.editReply(response);
  },
};

async function execute(client) {
  return {
    content: "Example",
    ephemeral: true,
  };
}
