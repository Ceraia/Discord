const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "role",
  category: "admin",
  slashcommand: new SlashCommandBuilder()
    .setName("role")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
    .setDMPermission(false)
    .setDescription("Role related commands.")
    .addSubcommandGroup((group) =>
      group
        .setName("give")
        .setDescription("Give roles to users")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("user")
            .setDescription("Add a role to a user.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to add.")
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user you want to add the role to.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("everyone")
            .setDescription("Add a role to everyone in the server.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to add.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("remove")
        .setDescription("Remove roles from users")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("user")
            .setDescription("Remove a role from a user.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to remove.")
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user you want to remove the role from.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("everyone")
            .setDescription("Remove a role from everyone in the server.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to remove.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("autorole")
        .setDescription("Set up autoroles.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Add an autorole.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to add.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Remove an autorole.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to remove.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand.setName("list").setDescription("List all autoroles.")
        )
    )
  ,
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeSlash(interaction, client) {
    if (interaction.options.getSubcommandGroup() === "give") {
      let role = interaction.options.getRole("role");
      let member = interaction.options.getMember("user");
      if (interaction.options.getSubcommand() === "user") {
        await member.roles
          .add(role)
          .then(() => {
            interaction.reply(`Added ${role} to ${member.user.tag}!`);
          })
          .catch((err) => {
            interaction.reply(
              `Error, couldn't add ${role} to ${member.user.tag}!`
            );
            client.error(err.stack);
          });
      } else if (interaction.options.getSubcommand() === "everyone") {
        await interaction.guild.members.fetch().then(async (members) => {
          interaction.reply({
            content:
              `Adding ${role} to everyone in the server... 0% complete.`, ephemeral: true
          });

          members.forEach(async (member) => {
            member.fetch();
          });

          members = members.filter(
            (member) => !member.user.bot && !member.roles.cache.has(role)
          );

          let totalMembers = members.size;
          let processedMembers = 0;

          let interval = setInterval(() => {
            let percentage = (processedMembers / totalMembers) * 100;
            interaction.editReply(
              `Adding ${role} to everyone in the server... ${Math.round(
                percentage
              )}% complete. Processed ${processedMembers} out of ${totalMembers}.`
            );
          }, 5000); // Update every 5 seconds

          await members.forEach(async (member) => {
            await member.roles.add(role);
            processedMembers++;

            if (processedMembers === totalMembers) {
              clearInterval(interval);
              interaction.editReply(`Added ${role} to everyone in the server!`);
            }
          });
        });
      }
    } else if (interaction.options.getSubcommandGroup() === "remove") {
      let role = interaction.options.getRole("role");
      let member = interaction.options.getMember("user");
      if (interaction.options.getSubcommand() === "user") {
        await member.roles
          .remove(role)
          .then(() => {
            interaction.reply(`Removed ${role} from ${member.user.tag}!`);
          })
          .catch((err) => {
            interaction.reply(
              `Error, couldn't remove ${role} from ${member.user.tag}!`
            );
            client.error(err.stack);
          });
      } else if (interaction.options.getSubcommand() === "everyone") {
        await interaction.guild.members.fetch().then(async (members) => {
          interaction.reply(
            `Removing ${role} from everyone in the server... 0% complete.`
          );
          members = members.filter(
            (member) => !member.user.bot && member.roles.cache.has(role)
          );
          let totalMembers = members.size;
          let processedMembers = 0;

          let startTime = Date.now();

          let interval = setInterval(() => {
            let elapsedTime = Date.now() - startTime;
            let estimatedRemainingTime =
              (elapsedTime / processedMembers) *
              (totalMembers - processedMembers);

            let percentage = (processedMembers / totalMembers) * 100;
            interaction.reply(
              `Removing ${role} from everyone in the server... ${Math.round(
                percentage
              )}% complete. Estimated to be done <t:${Math.round(
                Math.round((Date.now() + estimatedRemainingTime) / 1000) * 1.3
              )}:R>.`
            );
          }, 5000); // Update every 5 seconds

          await members.forEach(async (member) => {
            await member.roles.remove(role);
            processedMembers++;

            if (processedMembers === totalMembers) {
              clearInterval(interval);
              interaction.reply(
                `Removed ${role} from everyone in the server!`
              );
            }
          });
        });
      }
    } else if (interaction.options.getSubcommandGroup() === "autorole") {
      let role = interaction.options.getRole("role");
      if (interaction.options.getSubcommand() === "add") {
        let guild = await client.db.getGuild(interaction.guild.id);
        if (guild.autoroles.includes(role.id)) {
          interaction.reply("This role is already an autorole!");
        } else {
          guild.autoroles.push(role.id);
          await guild.save();
          interaction.reply(`Added ${role} as an autorole!`);
        }
      } else if (interaction.options.getSubcommand() === "remove") {
        let guild = await client.db.getGuild(interaction.guild.id);
        if (!guild.autoroles.includes(role.id)) {
          interaction.reply("This role is not an autorole!");
        } else {
          guild.autoroles = guild.autoroles.filter((r) => r !== role.id);
          await guild.save();
          interaction.reply(`Removed ${role} as an autorole!`);
        }
      } else if (interaction.options.getSubcommand() === "list") {
        let guild = await client.db.getGuild(interaction.guild.id);
        let roles = guild.autoroles.map((r) => `<@&${r}>`);
        interaction.reply(
          `Autoroles in this server: ${roles.join(", ") || "None"}`
        );
      }
    }
  },
};
