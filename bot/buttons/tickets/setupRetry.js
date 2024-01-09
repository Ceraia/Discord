const { ticketSetupModal } = require("../../functions/ticketSystem");

module.exports = {
  ephemeral: false,
  name: "tSetupRetry",
  async executeButton(interaction, client) {
    await ticketSetupModal(interaction, client);
    interaction.editReply({ components: [] });
  },
};
