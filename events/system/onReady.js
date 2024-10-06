const { ActivityType } = require("discord.js");

module.exports = {
    name: "onReady",
    once: true,
    /**
     * @param {import("@client").BotClient} client
     */
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setActivity("with the API", { type: ActivityType.Playing });
    },
};
