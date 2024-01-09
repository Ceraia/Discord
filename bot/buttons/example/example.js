module.exports = {
  ephemeral: false,
  name: "example",
  async executeButton(interaction, client) {
    interaction.reply({
      content: "You clicked the button!",
      ephemeral: true,
    });
  },
};
