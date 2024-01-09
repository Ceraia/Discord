const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");

async function ticketSetupModal(interaction, client) {
  // Ask how they want the panel to look with modal
  let modal = new ModalBuilder()
    .setCustomId(`tSetupModal`)
    .setTitle("Tickets Setup");

  const titleInput = new TextInputBuilder()
    .setCustomId("embedTitle")
    .setLabel("Title of the embed")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(32);

  const descriptionInput = new TextInputBuilder()
    .setCustomId("embedDescription")
    .setLabel("Description of the embed")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const colorInput = new TextInputBuilder()
    .setCustomId("embedColor")
    .setLabel("Color of the embed")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("#FFFFFF")
    .setMinLength(7)
    .setMaxLength(7)
    .setRequired(true);

  const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
  const secondActionRow = new ActionRowBuilder().addComponents(
    descriptionInput
  );
  const thirdActionRow = new ActionRowBuilder().addComponents(colorInput);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

  await interaction.showModal(modal);
}

async function handleTicket(interaction, client) {
  if (interaction.isButton() || interaction.isModalSubmit()) {
    // Input customid: ticket-open-panel-type
    let action = interaction.customId.split("-")[1];
    let panel = interaction.customId.split("-")[2];
    let type = interaction.customId.split("-")[3];

    if (action == "open") {
      // Get the guild and check if there are questions to ask, if so start making the modal and return it, if not, open the ticket.
      let guildSettings = client.database
        .get("guilds")
        .get(interaction.guild.id);

      if (guildSettings === undefined || !guildSettings.tickets) {
        guildSettings = {
          tickets: {},
        };
      }

      // If there are questions and the interaction was a button, make a modal with all the questions and handle it later
      if (interaction.isButton())
        if (
          guildSettings.tickets.panels[panel].types[type].questions.length > 0
        ) {
          // Create the modal with every question
          let modal = new ModalBuilder()
            .setCustomId(`ticket-open-${panel}-${type}`)
            .setTitle("Open a ticket");

          let i = 0;
          guildSettings.tickets.panels[panel].types[type].questions.forEach(
            (question) => {
              let questionInput = new TextInputBuilder()
                .setCustomId(String(i))
                .setLabel(question.question)
                .setStyle(TextInputStyle.Short)
                .setRequired(question.required);
              modal.addComponents(
                new ActionRowBuilder().addComponents(questionInput)
              );
              i++;
            }
          );

          await interaction.showModal(modal);
        } else {
          // If there are no questions, open the ticket
          await openTicket(client, interaction);
        }

      // If the interaction was a modal, all questions should have been asked, so open the ticket
      if (interaction.isModalSubmit()) await openTicket(client, interaction);
    }
  }
}

async function addTicketType(client, channel, type) {}

async function openTicket(client, interaction) {
  // Get the guild settings
  let guildSettings = client.database.get("guilds").get(interaction.guild.id);

  // Get the specific panel and type
  let panel = interaction.customId.split("-")[2];
  let type = interaction.customId.split("-")[3];

  // Get the panel and type settings
  let panelSettings = guildSettings.tickets.panels[panel];
  let typeSettings = panelSettings.types[type];

  // Create close message
  let closeTicketButton = new ButtonBuilder()
    .setEmoji("🔒")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`ticket-close-${panel}-${type}`)
    .setLabel("Close Ticket");

  let closeTicketEmbed = new EmbedBuilder()
    .setTitle("Press the button below to close the ticket.")
    .setColor("#2b2d31");

  let embeds = [closeTicketEmbed];

  if (interaction.isModalSubmit()) {
    let questionsEmbed = new EmbedBuilder()
      // Get all questions that were answered and add them to the embed
      .setColor("#2b2d31");

    let i = 0;
    typeSettings.questions.forEach((question) => {
      questionsEmbed.addFields({
        name: question.question,
        value: interaction.fields.getTextInputValue(String(i)),
      });
      i++;
    });
    embeds.push(questionsEmbed);
  }

  // Create the ticket channel
  let ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: typeSettings.category,
    topic: `Ticket for ${interaction.user.username}`,
  });

  // Send the close message
  await ticketChannel
    .send({
      embeds: embeds,
      components: [new ActionRowBuilder().addComponents(closeTicketButton)],
    })
    .then((msg) => {
      // Pin the message to the channel
      msg.pin();
    });

  typeSettings.messages.forEach(async (message) => {
    // Send the message
    await ticketChannel.send({
      content: message.content,
      embeds: message.embeds,
    });
  });

  interaction.reply({
    content: `Your ticket has been opened in <#${ticketChannel.id}>.`,
    ephemeral: true,
  });
}

async function addTicketMember(client, channel, member) {}

async function removeTicketMember(client, channel, member) {}

async function generateTranscript(channel) {
  let messages = [];
  let message = await channel.messages
    .fetch({ limit: 1 })
    .then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null));
  messages.push(message);
  while (message) {
    await channel.messages
      .fetch({ limit: 100, before: message.id })
      .then((messagePage) => {
        messagePage.forEach((msg) => messages.push(msg));
        message =
          0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
      })
      .catch(() => {});
  }
  const reversed = Array.from(messages.values()).reverse();
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Transcript</title>
<style>
body {
background-color: #36393f;
color: #dcddde;
font-family: Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
font-size: 16px;
line-height: 1.5;
}
.container {
width: 100%;
max-width: 800px;
margin: 0 auto;
color: #dcddde;
}
.message {
margin-bottom: 8px;
}
.message .avatar {
float: left;
width: 32px;
height: 32px;
margin-right: 8px;
border-radius: 50%;
}
.message .text {
overflow-wrap: break-word;
word-wrap: break-word;
word-break: break-word;
}
.message .text pre {
white-space: pre-wrap;
white-space: -moz-pre-wrap;
white-space: -pre-wrap;
white-space: -o-pre-wrap;
word-wrap: break-word;
}
.message .text code {
background-color: #2f3136;
padding: 2px;
border-radius: 4px;
}
.message .text a {
color: #00b0f4;
text-decoration: none;
}
.message .text a:hover {
text-decoration: underline;
}
.message .text blockquote {
border-left: 4px solid #747f8d;
padding-left: 8px;
margin-left: 0;
}
.message .text blockquote p {
margin-top: 4px;
margin-bottom: 4px;
}
.message .text img {
max-width: 100%;
max-height: 400px;
}
.message .text .embed {
background-color: #2f3136;
border-radius: 4px;
padding: 8px;
}
.message .text .embed .title {
color: #fff;
font-weight: 600;
margin-bottom: 4px;
}
.message .text .embed .description {
color: #b9bbbe;
margin-bottom: 4px;
}
.message .text .embed .fields {
display: flex;
flex-wrap: wrap;
}
.message .text .embed .fields .field {
flex: 1;
margin-right: 8px;
}
.message .text .embed .fields .field .name {
color: #b9bbbe;
margin-bottom: 2px;
}
.message .text .embed .fields .field .value {
color: #dcddde;
}
.message .text .embed .footer {
margin-top: 4px;
display: flex;
justify-content: space-between;
}
.message .text .embed .footer .text {
color: #b9bbbe;
}
.message .text .embed .footer .icon {
color: #b9bbbe;
}
.message .text .embed .thumbnail {
float: right;
width: 80px;
height: 80px;
margin-left: 8px;
}
.message .text .embed .thumbnail img {
width: 100%;
height: 100%;
object-fit: cover;
}
.message .text .header time {
  color: #949ba4;
}
</style>
</head>
<body>
<div class="container">
${reversed
  .map((message) => {
    const date = new Date(message.createdTimestamp);
    const timestamp = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return `
<div class="message">
<img class="avatar" src="${message.author.displayAvatarURL({
      format: "png",
      dynamic: true,
    })}" />
<div class="text">
<div class="header">
<strong>${message.author.username}</strong>
<time>${timestamp}</time>
</div>
<div class="body">
${message.content}
</div>
</div>
</div>
`;
  })
  .join("")}
</div>
</body>
</html>
`;
  return html;
}

// openticketcustomid : t-ticket-parent-roleid-
// Database oriented as an object in a client function

module.exports = {
  generateTranscript,
  handleTicket,
  ticketSetupModal,
};
