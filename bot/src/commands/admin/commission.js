const { Command } = require("@src/structures");
const { Message, CommandInteraction, MessageEmbed } = require("discord.js");
const { findMatchingRoles } = require("@utils/guildUtils");

module.exports = class Commission extends Command {
  constructor(client) {
    super(client, {
      name: "commission",
      description: "update commissions channel",
      category: "ADMIN",
      userPermissions: ["MANAGE_GUILD"],
      command: {
        enabled: false,
      },
      slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
          {
            name: "add",
            description: "setup the autorole",
            type: "SUB_COMMAND",
            options: [
              {
                name: "image_link",
                description: "the image link",
                type: "STRING",
                required: true,
              },
              {
                name: "string",
                description: "string",
                type: "STRING",
                required: true,
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   * @param {object} data
   */
  async messageRun(message, args, data) {}

  /**
   * @param {CommandInteraction} interaction
   * @param {object} data
   */
  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    if (sub === "add") {
      let link = interaction.options.getString("image_link");
      let string = interaction.options.getString("string");
      let embed = new MessageEmbed()
        .setDescription(`${string.replace("\\n", "\n")}`)
        .setImage(`${link}`)
        .setColor("9A9A9A");

      this.client.channels.cache.get("985666093332971520").send({ embeds: [embed] });
    }
  }
};
