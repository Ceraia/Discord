const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "tSetupModal",
  async executeModal(interaction, client) {
    const embedTitle = interaction.fields.getTextInputValue("embedTitle");
    const embedDescription =
      interaction.fields.getTextInputValue("embedDescription");
    const embedColor = interaction.fields.getTextInputValue("embedColor");

    let retryButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("tSetupRetry")
      .setLabel("Retry");

    let row = new ActionRowBuilder().addComponents(retryButton);

    // Check if embed color is a valid hex code
    if (!embedColor.match(/^#([0-9a-f]{6})$/i)) {
      return interaction.reply({
        content: "Please provide a valid hex code for the embed color.",
        components: [row],
        ephemeral: true,
      });
    }

    // Create the category channel
    let category = await interaction.guild.channels.create({
      name: "Tickets",
      type: ChannelType.GuildCategory,
    });
    // Create the ticket channel
    let channel = await interaction.guild.channels.create({
      name: "support",
      type: ChannelType.GuildText,
      parent: category,
    });

    // Make the embed
    let embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(embedDescription)
      .setColor(embedColor);

    await channel.send({ embeds: [embed] }).then((message) => {
      // Setup the default tickets setup
      let guildSettings = client.database
        .get("guilds")
        .get(interaction.guild.id);
      if (guildSettings === undefined || !guildSettings.tickets) {
        guildSettings = {
          tickets: {},
        };
      }
      guildSettings.tickets.panels = {
        default: {
          panel: {
            embed: {
              title: embedTitle,
              description: embedDescription,
              color: embedColor,
            },
            channel: channel.id,
            message: message.id,
          },
          types: {
            default: {
              messages: [
                {
                  content: "Thank you for opening a ticket!",
                  embeds: [],
                },
              ],
              questions: [
                { question: "What is your ticket for?", required: false },
              ],
              label: { name: "Open a ticket", emoji: "📩" },
              style: ButtonStyle.Secondary,
              category: category.id,
              transcript: null,
              roles: [],
            },
          },
        },
      };

      let openTicketButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`ticket-open-default-default`)
        .setLabel("Open a ticket")
        .setEmoji("📩");

      let row = new ActionRowBuilder().addComponents(openTicketButton);

      // Edit the message to have the row
      message.edit({ components: [row] });

      // Save the guild settings
      client.database.get("guilds").set(interaction.guild.id, guildSettings);

      // Respond to the interaction with the message.
      interaction.reply({
        content: `Ticket system setup successfully. [Click here to view the ticket channel!](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${message.id})`,
        components: [],
        ephemeral: true,
      });
    });
  },
};
