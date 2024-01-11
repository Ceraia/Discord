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
    .setDescription("Stripe related commands")
    .addSubcommand((subcommand) =>
      subcommand.setName("products").setDescription("Get all products")
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  category: "stripe",
  textcommand: false,
  async executeText(client, message, args) {},
  /**
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: false });
    try {
      interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Products")
              .setDescription(
                "Please select the products you want to purchase."
              )
              .setColor(0x2b2d31),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setMinValues(1)
                .setMaxValues(10)
                .setPlaceholder("Products to purchase.")
                .setCustomId("products")
                .addOptions(
                  Array.from(client.products.values()).map((product) => {
                    return {
                      label: `€${product.price} - ${product.name}`,
                      value: product.id,
                    };
                  })
                )
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setDisabled(false)
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        })
        .then((msg) => {
          this.activePurchases.set(msg.id, {
            products: [],
          });
        });
    } catch (error) {
      // Handle errors appropriately
      client.error(error);
      interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
