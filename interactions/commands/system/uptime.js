const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "uptime",
    slashcommand: new SlashCommandBuilder()
        .setName("uptime")
        .setDMPermission(true)
        .setDescription("Get the bot's uptime"),
    category: "system",
    textcommand: true,
    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     * @param {import("@client").BotClient} client
     */
    async executeText(client, message, args) {
        let response = await execute(client);
        message.channel.send(response);
    },
    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     * @param {import("@client").BotClient} client
     */
    async executeSlash(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        let response = await execute(client);
        interaction.editReply(response);
    },
};

async function execute(client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);
    return {
        content: `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`,
    }

}
