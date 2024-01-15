const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  MentionableSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "stripe",
  activePurchases: new Map(),
  slashcommand: new SlashCommandBuilder()
    .setName("stripe")
    .setDMPermission(false)
    .setDescription("Stripe related commands.")
    // .addSubcommand((subcommand) =>
    //   subcommand.setName("shop").setDescription("Get all products.")
    // )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("url")
        .setDescription("Set custom purchase url")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to set the url for.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url to set.")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  guild: "750209335841390642",
  async executeText(client, message, args) {},
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    // if (interaction.options.getSubcommand() === "shop") {
    //   interaction
    //     .editReply({
    //       embeds: [
    //         new EmbedBuilder()
    //           .setTitle("Products")
    //           .setDescription(
    //             "Please select the products you want to purchase."
    //           )
    //           .setColor(0x2b2d31),
    //       ],
    //       components: [
    //         new ActionRowBuilder().addComponents(
    //           new StringSelectMenuBuilder()
    //             .setMinValues(1)
    //             .setMaxValues(10)
    //             .setPlaceholder("Products to purchase.")
    //             .setCustomId("products")
    //             .addOptions(
    //               Array.from(client.products.values()).map((product) => {
    //                 return {
    //                   label: `€${product.price} - ${product.name}`,
    //                   value: product.id,
    //                 };
    //               })
    //             )
    //         ),
    //         new ActionRowBuilder().addComponents(
    //           new ButtonBuilder()
    //             .setDisabled(false)
    //             .setCustomId("cancel")
    //             .setLabel("Cancel")
    //             .setStyle(ButtonStyle.Danger)
    //         ),
    //       ],
    //     })
    //     .then((msg) => {
    //       this.activePurchases.set(msg.id, {
    //         products: [],
    //       });
    //     });
    // }
    if (interaction.options.getSubcommand() === "url") {
      let user = interaction.options.getUser("user");
      await client.users
        .fetch(user.id)
        .then((user) => {
          user
            .send({ content: "Incoming purchase..." })
            .then(async (msg) => {
              msg
                .edit({
                  content: null,
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Purchase")
                      .setDescription(
                        `Please click the button below to complete your purchase.\n\n[Click here to complete your purchase](${interaction.options.getString(
                          "url"
                        )})`
                      )
                      .setColor(0x2b2d31),
                  ],
                  components: [],
                })
                .then(() => {
                  interaction.editReply({
                    content: "Purchase sent.",
                    components: [],
                    embeds: [],
                  });
                })
                .catch((err) => {
                  messageIssue(interaction);
                  client.error(err.stack);
                });
            })
            .catch((err) => {
              messageIssue(interaction);
              client.error(err.stack);
            });
        })
        .catch((err) => {
          messageIssue(interaction);
          client.error(err.stack);
        });
    }
  },
};

/**
 * @param {import("discord.js").AnySelectMenuInteraction} interaction
 */
async function messageIssue(interaction) {
  interaction
    .update({
      content: "There was an issue getting the user.",
      components: [],
      embeds: [],
    })
    .catch((err) => {
      client.error(err.stack);
      interaction.message.edit({
        content: "There was an issue getting the user.",
        components: [],
        embeds: [],
      });
    });
}
