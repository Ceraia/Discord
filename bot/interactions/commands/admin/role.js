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
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommandGroup() === "give") {
      let role = interaction.options.getRole("role");
      let member = interaction.options.getMember("user");
      if (interaction.options.getSubcommand() === "user") {
        await member.roles
          .add(role)
          .then(() => {
            interaction.editReply(`Added ${role} to ${member.user.tag}!`);
          })
          .catch((err) => {
            interaction.editReply(
              `Error, couldn't add ${role} to ${member.user.tag}!`
            );
            client.error(err.stack);
          });
      } else if (interaction.options.getSubcommand() === "everyone") {
        await interaction.guild.members.fetch().then(async (members) => {
          interaction.editReply(
            `Adding ${role} to everyone in the server... 0% complete.`
          );
          members = members.filter(
            (member) => !member.user.bot && !member.roles.cache.has(role)
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
            interaction.editReply(
              `Adding ${role} to everyone in the server... ${Math.round(
                percentage
              )}% complete. Estimated to be done <t:${Math.round(
                Math.round((Date.now() + estimatedRemainingTime) / 1000) * 1.3
              )}:R>.`
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
            interaction.editReply(`Removed ${role} from ${member.user.tag}!`);
          })
          .catch((err) => {
            interaction.editReply(
              `Error, couldn't remove ${role} from ${member.user.tag}!`
            );
            client.error(err.stack);
          });
      } else if (interaction.options.getSubcommand() === "everyone") {
        await interaction.guild.members.fetch().then(async (members) => {
          interaction.editReply(
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
            interaction.editReply(
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
              interaction.editReply(
                `Removed ${role} from everyone in the server!`
              );
            }
          });
        });
      }
    }
  },
};

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
