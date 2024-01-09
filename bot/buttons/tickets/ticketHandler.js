const { handleTicket } = require("../../functions/ticketSystem");

module.exports = {
  ephemeral: false,
  name: "ticket",
  async executeButton(interaction, client) {
    handleTicket(interaction, client);
  },
};
