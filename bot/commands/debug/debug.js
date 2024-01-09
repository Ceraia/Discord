const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { generateTranscript } = require("../../functions/ticketSystem");
const {
  loadCommands,
  loadButtons,
  loadEvents,
} = require("../../system/interactions");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

let command = new SlashCommandBuilder()
  .setName("debug")
  .setDescription("Debug stuff")
  .addSubcommand((subcommand) =>
    subcommand.setName("transcript").setDescription("Generate a transcript")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("reload")
      .setDescription("Reload all commands, buttons, and events")
  );

module.exports = {
  name: "debug",
  aliases: [],
  slashcommand: command,
  ephemeral: true,
  category: parentDirectoryName,
  textcommand: false,
  async executeText(client, message, args) {},
  async executeSlash(interaction, client) {
    let response = await execute(client, interaction);
    interaction.editReply(response);
  },
};

async function execute(client, interaction) {
  if (interaction.options.getSubcommand() === "reload") {
    // reload all commands, buttons, and events
    client.log("Reloading all commands, buttons, and events.");
    await loadCommands(client, true);
    await loadButtons(client, true);
    await loadEvents(client, true);
    return "Reloaded all commands, buttons, and events.";
  }
  if (interaction.options.getSubcommand() === "transcript") {
    let transcript = await generateTranscript(
      client.channels.cache.get(interaction.channel.id)
    );
    // write the transcript to the debug.html file
    fs.writeFileSync("debug.html", transcript);
    return "Debug file written.";
  }
}
