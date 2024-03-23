const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "dnd",
  guild: "750209335841390642",
  slashcommand: new SlashCommandBuilder()
    .setName("dnd")
    .setDMPermission(false)
    .setDescription("DnD related commands.")
    .addSubcommandGroup((group) =>
      group
        .setName("generate")
        .setDescription("Generate different things.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("area")
            .setDescription("Generate an area.")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("The name of the area.")
                .setRequired(false)
            )
            .addStringOption(
              (option) =>
                option
                  .setName("size")
                  .setDescription("The size of the city.")
                  .setRequired(false)
              // .setChoices([
              //   ["Outpost", "outpost"],
              //   ["Settlement", "settlement"],
              //   ["Village", "Village"],
              //   ["Town", "town"],
              //   ["City", "city"],
              //   ["Metropolis", "metropolis"],
              // ])
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dice")
        .setDescription("Roll a dice.")
        .addIntegerOption((option) =>
          option
            .setName("sides")
            .setDescription("The amount of sides the dice has.")
            .setRequired(true)
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommand() === "dice") {
      await interaction.editReply(
        `You rolled a ${
          Math.floor(Math.random() * interaction.options.getInteger("sides")) +
          1
        } on a ${interaction.options.getInteger("sides")}-sided dice.`
      );
    }
  },
};

// Helper functions
function generateLargeName() {
  let comboNames = [
    "bear",
    "night",
    "cot",
    "co",
    "new",
    "ca",
    "ber",
    "fam",
    "pop",
    "wit",
    "on",
    "gar",
    "ton",
    "ham",
    "bur",
    "leel",
    "ing",
  ];

  let descriptors = [
    "stead",
    "ville",
    "port",
    "ford",
    "field",
    "wharf",
    "pool",
    "land",
  ];

  // Take a random number between 2 and 4 and add that many combo names to the name
  let name = "";

  for (let i = 0; i < Math.floor(Math.random() * (4 - 2 + 1) + 2); i++) {
    name += comboNames[Math.floor(Math.random() * comboNames.length)];
  }

  // Add a descriptor to the name
  name += descriptors[Math.floor(Math.random() * descriptors.length)];

  return name;
}

function generateNpcName() {}

// Classes for all different types of generated things
