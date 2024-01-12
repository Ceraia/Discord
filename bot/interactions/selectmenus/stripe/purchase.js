const { EmbedBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { activePurchases } = require("../../commands/platter/stripe");

module.exports = {
  name: "purchase",
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

    purchase.user = interaction.values[0];

    await client.users
      .fetch(purchase.user)
      .then((user) => {
        user
          .send({ content: "Incoming purchase..." })
          .then(async (msg) => {
            let line_items = purchase.products.map((p) => {
              return {
                price: client.products.get(p.product).price_id,
                quantity: p.quantity,
              };
            });

            let link = await client.stripe.paymentLinks.create({
              line_items: line_items,
            });

            msg
              .edit({
                content: null,
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Purchase")
                    .setDescription(
                      `Please click the button below to complete your purchase.\n\n[Click here to complete your purchase](${link.url})`
                    )
                    .setColor(0x2b2d31),
                ],
                components: [],
              })
              .then(() => {
                interaction.update({
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
  },
};

/**
 * @param {import("discord.js").AnySelectMenuInteraction} interaction
 */
async function messageIssue(interaction) {
  interaction.update({
    content: "There was an issue getting the user.",
    components: [],
    embeds: [],
  });
}
