const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { webhook } = require("../../../settings");
const crypto = require("crypto");

// Generate SHA256 hash of this file
var hash = crypto.createHash("sha256");

const fs = require("fs");

const file = fs.ReadStream(__filename);
file.on("data", (data) => hash.update(data));
file.on("end", () => {
  hash = hash.digest("hex");
});

module.exports = {
  name: "suggest",
  category: "community",
  guild: "324195889977622530",
  hash: hash,
  slashcommand: new SlashCommandBuilder()
    .setName("suggest")
    .setDMPermission(false)
    .setDescription(`Suggestions & related commands. (${hash})`)
    .addSubcommandGroup((group) =>
      group
        .setName("bot")
        .setDescription("Suggest something for the bot.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("feature")
            .setDescription("Suggest a feature for the bot.")
            .addStringOption((option) =>
              option
                .setName("suggestion")
                .setDescription("The feature you want to suggest.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("community")
        .setDescription("Suggest something for the community.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("feature")
            .setDescription("Suggest a feature for the community.")
            .addStringOption((option) =>
              option
                .setName("suggestion")
                .setDescription("The feature you want to suggest.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("event")
            .setDescription("Suggest an event for the community.")
            .addStringOption((option) =>
              option
                .setName("suggestion")
                .setDescription("The event you want to suggest.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("other")
            .setDescription("Suggest something else for the community.")
            .addStringOption((option) =>
              option
                .setName("suggestion")
                .setDescription("The thing you want to suggest.")
                .setRequired(true)
            )
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommandGroup() == "bot") {
      webhook(
        client.settings.suggestions,
        `**${
          interaction.user.tag
        }** suggested a feature for the bot:\n${interaction.options.getString(
          "suggestion"
        )}`
      );
    }

    if (interaction.options.getSubcommandGroup() == "community") {
      let suggestions = interaction.guild.channels.cache.find(
        (channel) => channel.name === "suggestions"
      );

      if (suggestions) {
        suggestions
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Suggestion")
                .setColor(0x2b2d31)
                .setDescription(
                  `**${
                    interaction.user.tag
                  }** suggested a feature for the community:\n${interaction.options.getString(
                    "suggestion"
                  )}`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("suggestion-approve")
                  .setLabel("Approve")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("suggestion-deny")
                  .setLabel("Deny")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          })
          .then((message) => {
            message.react("👍");
            message.react("👎");
            // Open thread on the message
            message.startThread({
              name: "Suggestion",
              autoArchiveDuration: 1440,
              reason: "Discussions for the suggestion.",
            });

            interaction.editReply({
              content: "Your suggestion has been sent.",
              ephemeral: true,
            });
          })
          .catch((error) => {
            interaction.editReply({
              content:
                "Your suggestion could not be sent, please try again later.",
              ephemeral: true,
            });
            client.error(error.stack);
          });
      } else {
        interaction.editReply({
          content: "This server doesn't seem to have suggestions enabled.",
          ephemeral: true,
        });
      }
    }
  },
};
