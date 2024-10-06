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
        //.setColor(0x2b2d31)
        .setColor(0x9a9a9a)
        .setDescription(
          "Create a new VC to use this.\n\n**Buttons**\n" +
            "<:Lock:1206326940324331531> Lock/Unlock the VC\n" +
            "<:Eye:1206326935303749722> Hide/Show the VC\n" +
            "<:Plus:1206326946586300476> Increase the VC limit\n" +
            "<:Minus:1206326944979877990> Decrease the VC limit\n" +
            "<:Hammer:1206326936612114472> Ban from the VC\n" +
            "<:Mail:1206667313609187330> Unban / Invite to the VC\n" +
            "<:I_:1206326937748905985> Rename the VC\n" +
            "<:Mic:1206326943201362060> Claim the VC\n"
        ),
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:Lock:1206326940324331531>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-lock"),
        new ButtonBuilder()
          .setEmoji("<:Eye:1206326935303749722>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-hide"),
        new ButtonBuilder()
          .setEmoji("<:Plus:1206326946586300476>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-increase"),
        new ButtonBuilder()
          .setEmoji("<:Minus:1206326944979877990>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-decrease")
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:Hammer:1206326936612114472>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-ban"),
        new ButtonBuilder()
          .setEmoji("<:Mail:1206667313609187330>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-invite"),
        new ButtonBuilder()
          .setEmoji("<:I_:1206326937748905985>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dynvc-rename"),
        new ButtonBuilder()
          .setEmoji("<:Mic:1206326943201362060>")
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
                .addChannelTypes(ChannelType.GuildVoice)
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
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
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
  },
};
