const { handleTicketOpen, handleTicketClose } = require("@src/handlers/ticket");
const { approveSuggestion, rejectSuggestion } = require("@src/handlers/suggestion");
const { handleXDBL } = require("@src/handlers/xdbl");
const { MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const { Logger } = require("simple-node-logger");
/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.guild) {
    return interaction
      .reply({ content: "Command can only be executed in a discord server", ephemeral: true })
      .catch(() => {});
  }

  // Slash Command
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) await command.executeInteraction(interaction);
    else return interaction.reply({ content: "An error has occurred", ephemeral: true }).catch(() => {});
  }

  // Context Menu
  else if (interaction.isContextMenu()) {
    const context = client.contextMenus.get(interaction.commandName);
    if (context) await context.execute(interaction);
    else return interaction.reply({ content: "An error has occurred", ephemeral: true }).catch(() => {});
  }

  // Custom Buttons
  else if (interaction.isButton()) {
    // ticket create
    if (interaction.customId === "TICKET_CREATE") {
      await interaction.deferReply({ ephemeral: true });
      await handleTicketOpen(interaction);
    }

    // ticket close
    if (interaction.customId === "TICKET_CLOSE") {
      await interaction.deferReply({ ephemeral: true });
      await handleTicketClose(interaction);
    }

    // Suggestion
    if (interaction.customId === "SUGGEST_APPROVE") {
      await interaction.deferReply({ ephemeral: true });
      const response = await approveSuggestion(interaction.guild, interaction.member, interaction.message.id);
      if (typeof response !== "boolean") interaction.followUp(response);
      else interaction.followUp("Suggestion approved");
    }

    if (interaction.customId === "SUGGEST_REJECT") {
      await interaction.deferReply({ ephemeral: true });
      const response = await rejectSuggestion(interaction.guild, interaction.member, interaction.message.id);
      if (typeof response !== "boolean") interaction.followUp(response);
      else interaction.followUp("Suggestion rejected");
    }

    async function fetchJson(url) {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        Logger.error(error.message);
        throw error;
      }
    }

    // Other
    if (interaction.customId === "commissions") {
      await interaction.deferReply({ ephemeral: true });
      const component = new MessageActionRow();
      await fetchJson("https://xdbl.dev/y/commissions.json").then((data) => {
        data.commissions.forEach((c) => {
          component.addComponents(
            new MessageButton().setStyle(c.style).setLabel(c.name).setCustomId(c.id).setDisabled(c.disabled)
          );
        });
      });

      await interaction.followUp({
        components: [component],
        content:
          "Lovely to see you show interest in my commissions!\nYou can commission a lot of different things, such as custom clothing in unturned mods, custom mods themselves & discord bot's.\n\nWhat are you interested in?",
      });
    }

    await fetchJson("https://xdbl.dev/y/commissions.json").then((data) => {
      data.commissions.forEach(async (c) => {
        if (interaction.customId === c.id) {
          //find channel underneath category with the username, if it doesn't exist continue to create the channel.
          const channel = interaction.guild.channels.cache.find(
            (channel) => channel.name === `${interaction.user.username}` && channel.parentId === "1108868306896683009"
          );
          if (channel)
            await interaction.update({
              content:
                "You already have a commission open, please await your commission to be finished / accepted before opening a new one.",
              components: [],
            });
          else {
            let channel = await interaction.guild.channels.create(`${interaction.user.username}`, {
              parent: "1108868306896683009",
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone.id,
                  deny: ["VIEW_CHANNEL"],
                },
                {
                  id: interaction.user.id,
                  allow: [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "READ_MESSAGE_HISTORY",
                    "ATTACH_FILES",
                    "EMBED_LINKS",
                    "ADD_REACTIONS",
                  ],
                },
              ],
            });
            let component = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("LINK")
                .setLabel("Take me there!")
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
            );
            channel.send("<@244173330431737866>").then((m) => m.delete());
            channel.send({
              content: `${c.messages.channel.message}`,
              embeds: [c.messages.channel.embed],
            });
            await interaction.update({ content: c.messages.creationmessage, components: [component] });
          }
        }
      });
    });
  }
};
