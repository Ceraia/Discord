const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const path = require("path");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

module.exports = {
  name: "send",
  aliases: [],
  slashcommand: new SlashCommandBuilder()
    .setName("send")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        .setName("channel")
        .setDescription("The channel to send the message in")
    )
    .setDescription("Send a message as the bot"),
  ephemeral: true,
  category: parentDirectoryName,
  textcommand: false,
  async executeText(client, message, args) {},
  async executeSlash(interaction, client) {
    let response = await execute(client);
    interaction.editReply(response);
  },
};

async function execute(client, channel) {
  // Get all commands registered in the client and add them to the embed
  let embed = new EmbedBuilder()
    .setTitle("Help")
    .setColor(0x2b2d31)
    .setDescription("Help Menu");

  client.slashcommands.forEach((command) => {
    embed.addFields({
      name: `${command.slashcommand.name} ${
        command.textcommand
          ? "(" +
            command.name +
            `${command.aliases ? " | " + command.aliases.join(" | ") : ""})`
          : ""
      }`,
      value: `${command.slashcommand.description}`,
    });
  });

  return { embeds: [embed] };
}
