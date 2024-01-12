const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { activePurchases } = require("../../commands/platter/stripe");

module.exports = {
  name: "products",
  /**
   * @param {import("discord.js").AnySelectMenuInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeMenu(interaction, client) {
    let purchase = activePurchases.get(interaction.message.id);

    if (!purchase)
      return interaction.message.deletable
        ? interaction.message.delete()
        : interaction.message.edit({
            content: "This message has expired.",
            components: [],
            embeds: [],
          });

    await interaction.values.forEach((value) => {
      // Convert value to the same type as product.id
      let product = purchase.products.find(
        (p) => p.product === value.toString()
      );

      if (product) {
        product.quantity++;
      } else {
        purchase.products.push({ product: value, quantity: 1 });
      }

      activePurchases.set(interaction.message.id, purchase);
    });

    interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle("Products")
          .setDescription(
            `Please select the products you want to purchase.\n${purchase.products
              .map((p) => {
                return `${p.quantity}x €${
                  client.products.get(p.product).price
                } ${client.products.get(p.product).name}`;
              })
              .join("\n")}\n\nTotal: €${purchase.products
              .map((p) => {
                return p.quantity * client.products.get(p.product).price;
              })
              .reduce((a, b) => a + b, 0)}`
          )
          .setColor(0x2b2d31),
      ],
      components: [
        interaction.message.components[0],
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setDisabled(false)
            .setCustomId("purchase")
            .setLabel("Purchase")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setDisabled(false)
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
  },
};
