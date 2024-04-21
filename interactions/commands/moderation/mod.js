// @ts-check
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
      // @ts-ignore
      invite = await interaction.channel.createInvite({
        maxAge: 0,
        maxUses: 0,
      });
    }

    if (interaction.options.getSubcommand() === "kick") {
      let target = interaction.guild.members.cache.get(
        // @ts-ignore
        interaction.options.getMember("user").id
      );
      let reason = interaction.options.getString("reason");
      if (!target)
        return interaction.editReply({
          content: "User not found.",
        });
      if (!target.kickable) {
        return interaction.editReply({
          content: "I cannot kick this user.",
        });
      }

      if (
        target.roles.highest.position >=
        // @ts-ignore
        interaction.guild.members.cache.get(interaction.member.id).roles.highest
          .position
      ) {
        return interaction.editReply({
          content: "You cannot kick this user.",
        });
      }

      target
        .send(
          `You have been kicked from [${interaction.guild.name}](${invite}) for ${reason}.`
        )
        .then(() => {
          target
            .kick(reason)
            .then(() => {
              interaction.editReply({
                content: "User kicked.",
              });
            })
            .catch(() => {
              interaction.editReply({
                content: "I cannot kick this user.",
              });
            });
        })
        .catch(() => {
          interaction.editReply({
            content:
              "I cannot send a message to this user. Are you sure you want to kick them?",
            components: [
              // @ts-ignore
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId(`kick-${target.id}`)
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
