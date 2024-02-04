const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "dynamicvcs",
  category: "admin",
  panelmessage: (panelmsg = {
    content: null,
    embeds: [
      new EmbedBuilder()
        .setTitle("Dynamic VCs")
        .setColor(0x2b2d31)
        .setDescription(
          "Create a new VC to use this.\n\n**Buttons**\n" +
            "🔒 Lock/Unlock the VC\n" +
            "👁️ Hide/Show the VC\n" +
            "➕ Increase the VC limit\n" +
            "➖ Decrease the VC limit\n" +
            "🔨 Ban from the VC\n" +
            "✉️ Unban / Invite to the VC\n" +
            "ℹ️ Rename the VC\n" +
            "🎙️ Claim the VC\n"
        ),
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-lock"),
        new ButtonBuilder()
          .setEmoji("👁️")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-hide"),
        new ButtonBuilder()
          .setEmoji("➕")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-increase"),
        new ButtonBuilder()
          .setEmoji("➖")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-decrease")
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("🔨")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-ban"),
        new ButtonBuilder()
          .setEmoji("✉️")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-invite"),
        new ButtonBuilder()
          .setEmoji("ℹ️")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-rename"),
        new ButtonBuilder()
          .setEmoji("🎙️")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-claim")
      ),
    ],
  }),
  slashcommand: new SlashCommandBuilder()
    .setName("dynamicvcs")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Dynamic VC Commands. (In-Dev 1)")
    .addSubcommandGroup((group) =>
      group
        .setName("create")
        .setDescription("Create a dynamic VC.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("vc")
            .setDescription("Create a dynamic VC.")
            .addChannelOption((option) =>
              option
                .setName("vc")
                .setDescription("The VC to let users join.")
                .setRequired(false)
            )
            .addChannelOption((option) =>
              option
                .setName("panel")
                .setDescription("The panel for users for the VCs")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("panel")
            .setDescription("(Re-)Create a panel for dynamic VCs.")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The channel to create the panel in.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("overrides")
        .setDescription("Add overrides for roles.")
        .addSubcommand((subcommand) =>
          subcommand
            .setDescription(
              "Add an override to always let this role join the VC."
            )
            .setName("add")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role to add the override for.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setDescription(
              "Add an override to always let this role join the VC."
            )
            .setName("remove")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role to remove the override for.")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("prefix")
        .setDescription("Set the prefix for dynamic VCs.")
        .addStringOption((option) =>
          option
            .setName("prefix")
            .setDescription("The prefix for dynamic VCs.")
            .setRequired(true)
            .setMaxLength(5)
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    if (subcommandGroup === "create") {
      if (subcommand === "vc") {
        let vc = interaction.options.getChannel("vc");

        let panelInfo = " ";
        let panel = interaction.options.getChannel("panel");
        if (panel)
          panel.send(this.panelmessage).then((msg) => {
            panelInfo = ` Panel: <#${msg.channel.id}>.`;
          });

        if (!vc)
          interaction.guild.channels
            .create({
              name: "Join to Create",
              type: ChannelType.GuildVoice,
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  allow: [PermissionsBitField.Flags.Connect],
                },
                {
                  id: client.user.id,
                  allow: [PermissionsBitField.Flags.PrioritySpeaker],
                },
              ],
            })
            .then((channel) => {
              interaction.editReply({
                content: `Created a dynamic VC in ${channel}, feel free to test it out!${panelInfo}`,
                ephemeral: true,
              });
            });
        else
          interaction.guild.channels.cache
            .get(vc.id)
            .permissionOverwrites.set([
              {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.Speak],
              },
              {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.PrioritySpeaker],
              },
            ])
            .then((channel) => {
              interaction.editReply({
                content: `Created a dynamic VC in ${channel}, feel free to test it out!${panelInfo}`,
                ephemeral: true,
              });
            });
      } else if (subcommand === "panel") {
        let channel = interaction.options.getChannel("channel");
        if (!channel) channel = interaction.channel;

        channel.send(this.panelmessage).then((msg) => {
          interaction.editReply({
            content: `Panel created in <#${msg.channel.id}>.`,
            ephemeral: true,
          });
        });
      }
    }
    if (subcommandGroup === "overrides") {
      let role = interaction.options.getRole("role");

      if (subcommand === "add") {
        client.db.guilds
          .get(interaction.guild.id)
          .dynvcs.overrides.push(role.id);
        client.db.guilds.saveData();
        interaction.editReply({
          content: `Added an override for the role ${role.name}.`,
          ephemeral: true,
        });
      }
      if (subcommand === "remove") {
        // Remove every instance of the role from the array
        client.db.guilds.get(interaction.guild.id).dynvcs.overrides =
          client.db.guilds
            .get(interaction.guild.id)
            .dynvcs.overrides.filter((id) => id !== role.id);
        client.db.guilds.saveData();
        interaction.editReply({
          content: `Removed the override for the role ${role.name}.`,
          ephemeral: true,
        });
      }
    }
    if (subcommand == "prefix") {
      let prefix = interaction.options.getString("prefix");
      client.db.guilds.get(interaction.guild.id).dynvcs.prefix = prefix;
      client.db.guilds.saveData();
      interaction.editReply({
        content: `Set the prefix for dynamic VCs to \`${prefix}\`.`,
        ephemeral: true,
      });
    }
  },
};
