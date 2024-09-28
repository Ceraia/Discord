const { ActivityType } = require("discord.js");

module.exports = {
    name: "onReady",
    once: true,
    /**
     * @param {import("discord.js").AnySelectMenuInteraction} interaction
     * @param {import("@client").BotClient} client
     */
    async execute(interaction, client) {
        client.user.setActivity("with the API", { type: ActivityType.Playing });
    },
};
