const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ChannelSelectMenuBuilder,
  ActionRowBuilder,
  ChannelType,
  TextInputStyle,
} = require("discord.js");
const path = require("path");
const { ticketSetupModal } = require("../../functions/ticketSystem");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

let command = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Ticket setup commands.")
  .addSubcommand((subcommand) =>
    subcommand.setName("ticket").setDescription("Setup the ticket system.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("add").setDescription("Add more tickets.")
  );

module.exports = {
  name: "ticket",
  slashcommand: command,
  ephemeral: false,
  defer: false,
  category: parentDirectoryName,
  textcommand: false,
  async executeText(client, message, args) {},
  async executeSlash(interaction, client) {
    await execute(interaction, client);
  },
};

async function execute(interaction, client) {
  let subcommand = interaction.options.getSubcommand();
  if (subcommand === "setup") {
    if (interaction.member.permissions.has("MANAGE_GUILD")) {
      await ticketSetupModal(interaction, client);
    } else
      return {
        content: "You're missing the `MANAGE_GUILD` permission to do this.",
      };
  } else if (subcommand === "config") {
    // Config stuff.
  } else if (subcommand === "open") {
    // Open a ticket.
  }
}




