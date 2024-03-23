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

module.exports = {
  name: "dnd",
  guild: "750209335841390642",
  activeduels: new Map(),
  // slashcommand: new SlashCommandBuilder()
  //   .setName("duel")
  //   .setDMPermission(false)
  //   .setDescription("Start the duel.")
  //   .addUserOption((option) =>
  //     option
  //       .setName("user")
  //       .setDescription("The user you want to duel.")
  //       .setRequired(true)
  //   )
  //   .addIntegerOption((option) =>
  //     option
  //       .setName("weight")
  //       .setDescription("The weight of the duel.")
  //       .setRequired(true)
  //   ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: false }).then((msg) => {
      msg.editReply("Setting up the duel...");

      // Get the weight of the duel, double it, and add every integer from 0 to the weight to an array
      let weight = interaction.options.getInteger("weight");
      let weightArray = [];
      for (let i = 0; i < weight * 2; i++) {
        weightArray.push(i);
      }

      // Randomly split the array into two equal arrays
      let array1 = weightArray.sort(() => Math.random() - 0.5);
      let array2 = array1.splice(0, array1.length / 2);

      // Set the duel in the activeduels map
      this.activeduels.set(interaction.user.id, {
        users: [interaction.user.id, interaction.options.getUser("user").id],
        deckBlue: array1,
        deckRed: array2,
      });
    });
  },
};
