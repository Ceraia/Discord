const {
  SlashCommandBuilder,
  PermissionsBitField,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "mod",
  guild: "750209335841390642",
  category: "moderation",
  slashcommand: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderator related commands.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to kick.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the kick.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to ban.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the ban.")
            .setRequired(true)
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommand() === "kick") {
      let member = interaction.options.getMember("user");
      let reason = interaction.options.getString("reason");
      if (!member.kickable) {
        return interaction.editReply({
          content: "I cannot kick this user.",
          ephemeral: true,
        });
      }
      member
        .send(
          `You have been kicked from ${interaction.guild.name} for ${reason}.`
        )
        .then(() => {
          member
            .kick(reason)
            .then(() => {
              interaction.editReply({
                content: "User kicked.",
                ephemeral: true,
              });
            })
            .catch(() => {
              interaction.editReply({
                content: "I cannot kick this user.",
                ephemeral: true,
              });
            });
        })
        .catch(() => {
          interaction.editReply({
            content:
              "I cannot send a message to this user. Are you sure you want to kick them?",
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId(`kick-${member.id}`)
                  .setLabel("Kick")
                  .setStyle(ButtonStyle.Danger)
                  .setEmoji("👢")
              ),
            ],
            ephemeral: true,
          });
        });
    }
  },
};
