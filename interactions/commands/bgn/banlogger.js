const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

const userMap = new Map();

module.exports = {
  
  name: "cs",
  category: "bgn",
  guild: "324195889977622530",
  slashcommand: new SlashCommandBuilder()
    .setName("cs")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Get staff activity of user. (In-Dev 1)"),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    return;
    await checkStaff(interaction);
  },
};

async function checkStaff(interaction) {
  // Connect to the SQL server
  // 156.236.84.193:3306
  // User: u4600_RRx4i6AtUk
  // Pass: Uz8rO.uh!KgJZ=9kSZe47S3R
  // DB: s4600_liferp
  // Table: StaffActivities

  // Connect to the SQL server
  const mysql = require("mysql");
  const con = mysql.createConnection({
    host: "156.236.84.193",
    user: "u4600_RRx4i6AtUk",
    password: "Uz8rO.uh!KgJZ=9kSZe47S3R",
    database: "s4600_liferp",
  });

  // Fetch all guild members that have the "Staff" role
  await interaction.guild.members.fetch();

  let staffMembers = [];

  await interaction.guild.members.cache
    .filter((member) => member.roles.cache.has("1160189054088921218"))
    .forEach((member) => {
      staffMembers.push(member);
    });

  // Go through the staff-ids channel and get the past 100 messages
  const channel = await interaction.guild.channels.cache.get(
    "1160189200839221278"
  );
  const messages = await channel.messages.fetch({ limit: 100 });

  // Go through all the messages and get the 64ID which will always start with 7656119 and doesn't have a / in front of it
  await messages.forEach(async (message) => {
    if (message.content.includes("7656119")) {
      // Get the 64 ID only if there isn't a / in front of it
      let id = message.content.match(/7656119\d+/)[0];
      if (id.includes("/")) {
        id = id.split("/")[1];
      }
      if (!message.member.roles.cache.has("1160189054088921218")) {
        return message.delete();
      }
      userMap.set(message.author.id, id);
      console.log(message.author.username + " " + id);
    }
  });

  // Get all the staffMembers who haven't posted their 64ID
  let missingStaff = [];
  staffMembers.forEach((member) => {
    if (!userMap.has(member.id)) {
      missingStaff.push(member);
    }
  });

  // Send a message in the staff-ids channel to remind the staff to post their 64ID
  // missingStaff.forEach(async (member) => {
  //   await channel.send({
  //     content: `${member}, please post your 64ID in this channel.`,
  //   });
  // });

  // Get how many hours ago last monday 1am was
  let lastMonday = new Date();
  lastMonday.setHours(1, 0, 0, 0);
  lastMonday.setDate(lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7));
  let hoursAgo = Math.floor(
    (Date.now() - lastMonday.getTime()) / 1000 / 60 / 60
  );

  // Get all rows from the StaffActivities table where the ConnectDate is within the last hoursAgo hours
  con.connect((err) => {
    if (err) {
      console.log("Error connecting to the database: " + err.stack);
      return;
    }
    console.log("Connected to the database.");

    con.query(
      "SELECT * FROM StaffActivities WHERE ConnectDate > DATE_SUB(NOW(), INTERVAL "+hoursAgo+" HOUR)",
      (err, rows) => {
        // Go through all the rows and get their respective DisconnectDate
        rows.forEach((row) => {
          con.query(
            "SELECT * FROM StaffActivities WHERE SteamId = ? AND DisconnectDate > DATE_SUB(NOW(), INTERVAL "+hoursAgo+" HOUR)",
            [row.SteamId],
            (err, disconnectRows) => {

            }
          );
        });
      }
    );
  });

  return;
  con.connect((err) => {
    if (err) {
      console.log("Error connecting to the database: " + err.stack);
      return;
    }
    console.log("Connected to the database.");

    // Get the last 1000 entries in the StaffActivities table and add them to the userMap
    con.query(
      "SELECT * FROM StaffActivities ORDER BY id DESC LIMIT 1000",
      (err, rows) => {
        // Go through the table and find a row where the "CharacterName" column closest matches the user's name
        let userRow;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].CharacterName.includes(user)) {
            userRow = rows[i];
            break;
          }
        }

        // If no row was found, return an error message
        if (!userRow) {
          interaction.reply({
            content: "No user found with that name.",
            ephemeral: true,
          });
          return;
        }

        // If a row was found, return the SteamId
        interaction.reply({
          content: `SteamId: ${userRow.SteamId}`,
          ephemeral: true,
        });
      }
    );
  });
}