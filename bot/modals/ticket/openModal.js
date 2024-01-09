const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const { handleTicket } = require("../../functions/ticketSystem");

module.exports = {
  name: "ticket",
  async executeModal(interaction, client) {
    handleTicket(interaction, client);
  },
};
