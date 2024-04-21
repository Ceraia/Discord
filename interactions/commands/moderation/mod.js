const {
  SlashCommandBuilder,
  PermissionsBitField,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "mod",
  category: "moderation",
  slashcommand: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderator related commands.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
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
   * @param {import("@client").BotClient} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    // Get the first invite from the guild
    let invite = await interaction.guild.invites.fetch().then((invites) => {
      return invites.first();
    });

    // If there is no invite, create one
    if (!invite) {
      invite = await interaction.channel.createInvite({
        maxAge: 0,
        maxUses: 0,
      });
    }

    if (interaction.options.getSubcommand() === "kick") {
      let member = interaction.options.getMember("user");
      let reason = interaction.options.getString("reason");
      if (!member.kickable) {
        return interaction.editReply({
          content: "I cannot kick this user.",
          ephemeral: true,
        });
      }

      if (
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        return interaction.editReply({
          content: "You cannot kick this user.",
          ephemeral: true,
        });
      }

      member
        .send(
          `You have been kicked from [${interaction.guild.name}](${invite}) for ${reason}.`
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
