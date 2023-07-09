async function handleXDBL(interaction) {
  interaction.followUp({
    content: "Welcome ",
    ephemeral: true, //components: [row]
  });
}

module.exports = {
  handleXDBL,
};
