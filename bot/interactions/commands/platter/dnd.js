const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "dnd",
  guild: "750209335841390642",
  slashcommand: new SlashCommandBuilder()
    .setName("dnd")
    .setDMPermission(false)
    .setDescription("DnD related commands.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dice")
        .setDescription("Roll a dice.")
        .addIntegerOption((option) =>
          option
            .setName("sides")
            .setDescription("The amount of sides the dice has.")
            .setRequired(true)
        )
    ),
  /**
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommand() === "roll") {
      await interaction.editReply(
        `You rolled a ${
          Math.floor(Math.random() * interaction.options.getInteger("sides")) +
          1
        } on a ${interaction.options.getInteger("sides")}-sided dice.`
      );
    }
  },
};
