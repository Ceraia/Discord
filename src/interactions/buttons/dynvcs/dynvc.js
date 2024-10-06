const {
  PermissionsBitField,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { panelmessage } = require("@src/interactions/commands/admin/dynamicVcs");

module.exports = {
  ephemeral: true,
  name: "dynvc",
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeButton(interaction, client) {
    const subcommand = interaction.customId;
    const action = subcommand.split("-")[1];

    if (action == "rename") {
    } else {
      await interaction.deferReply({ ephemeral: true }).catch((err) => {
        client.error("Interaction disappeared.")
        client.error(err.stack)
      })
    }

    await interaction.message.edit(panelmessage).catch(async () => {
      await interaction.editReply(panelmessage).catch();
    });

    // Get the vc the user is in
    const vc = interaction.member.voice.channel;

    if (!vc)
      return interaction
        .editReply({
          content: "You need to be in a voice channel to use this button!",
          ephemeral: true,
        })
        .catch(() =>
          interaction.editReply({
            content: "You need to be in a voice channel to use this button!",
            ephemeral: true,
          }).catch(() => interaction.reply({
            content: "You need to be in a voice channel to use this button!",
            ephemeral: true,
          }))
        );

    // Check if the vc is a dynamic vc
    if (
      !vc.permissionOverwrites.resolve(client.user.id) ||
      !vc.permissionOverwrites
        .resolve(client.user.id)
        .allow.has(PermissionsBitField.Flags.AddReactions)
    )
      return interaction.editReply({
        content: "This is not a dynamic vc!",
        ephemeral: true,
      }).catch(() => interaction.reply({
        content: "This is not a dynamic vc!",
        ephemeral: true,
      }))

    if (action == "claim") {
      // Claim the vc
      // Check if any of the members in the vc are the owner
      let owner = undefined;

      vc.members.forEach((member) => {
        if (
          vc.permissionOverwrites.resolve(member.id) &&
          vc.permissionOverwrites
            .resolve(member.id)
            .allow.has(PermissionsBitField.Flags.AddReactions)
        )
          owner = member;
      });

      if (owner)
        return interaction.editReply({
          content: "The owner is still in the vc!",
          ephemeral: true,
        });

      // Claim the vc
      vc.permissionOverwrites.edit(interaction.user.id, {
        AddReactions: true,
        Connect: true,
      });

      return interaction.editReply({
        content: "You have claimed the vc!",
        ephemeral: true,
      });
    }

    // Check if the user is the owner of the vc
    if (
      !vc.permissionOverwrites.resolve(interaction.user.id) ||
      !vc.permissionOverwrites
        .resolve(interaction.user.id)
        .allow.has(PermissionsBitField.Flags.AddReactions)
    )
      return interaction
        .editReply({
          content:
            "You are not the owner of this dynamic vc, if the owner has left you can try to claim it.",
          ephemeral: true,
        })
        .catch(() => {
          return interaction.reply({
            content:
              "You are not the owner of this dynamic vc, if the owner has left you can try to claim it.",
            ephemeral: true,
          });
        });

    if (action == "lock") {
      // Lock  / Unlock the vc
      if (
        vc.permissionOverwrites.resolve(interaction.guild.id) &&
        vc.permissionOverwrites
          .resolve(interaction.guild.id)
          .deny.has(PermissionsBitField.Flags.Connect)
      ) {
        if (
          vc.parent &&
          vc.parent.permissionOverwrites.resolve(interaction.guild.id)
        ) {
          if (
            vc.parent.permissionOverwrites
              .resolve(interaction.guild.id)
              .allow.has(PermissionsBitField.Flags.Connect)
          ) {
            vc.permissionOverwrites.edit(interaction.guild.id, {
              Connect: true,
            });
          } else {
            vc.permissionOverwrites.edit(interaction.guild.id, {
              Connect: null,
            });
          }
        } else
          vc.permissionOverwrites.edit(interaction.guild.id, {
            Connect: null,
          });

        interaction.editReply({
          content: "Unlocked your vc!",
          ephemeral: true,
        });
      } else {
        vc.permissionOverwrites.edit(interaction.guild.id, {
          Connect: false,
        });
        interaction.editReply({
          content: "Locked your vc!",
          ephemeral: true,
        });
      }
    }

    if (action == "hide") {
      // Hide  / Unlock the vc
      if (
        vc.permissionOverwrites.resolve(interaction.guild.id) &&
        vc.permissionOverwrites
          .resolve(interaction.guild.id)
          .deny.has(PermissionsBitField.Flags.ViewChannel)
      ) {
        if (
          vc.parent &&
          vc.parent.permissionOverwrites.resolve(interaction.guild.id)
        ) {
          if (
            vc.parent.permissionOverwrites
              .resolve(interaction.guild.id)
              .allow.has(PermissionsBitField.Flags.ViewChannel)
          ) {
            vc.permissionOverwrites.edit(interaction.guild.id, {
              ViewChannel: true,
            });
          } else {
            vc.permissionOverwrites.edit(interaction.guild.id, {
              ViewChannel: null,
            });
          }
        } else
          vc.permissionOverwrites.edit(interaction.guild.id, {
            ViewChannel: null,
          });

        interaction.editReply({
          content: "Unhid your vc!",
          ephemeral: true,
        });
      } else {
        vc.permissionOverwrites.edit(interaction.guild.id, {
          ViewChannel: false,
        });
        interaction.editReply({
          content: "Hid your vc!",
          ephemeral: true,
        });
      }
    }

    if (action == "increase") {
      // Increase the user limit
      vc.edit({ userLimit: vc.userLimit + 1 });
      interaction.editReply({
        content: `Increased the user limit to ${vc.userLimit + 1}!`,
        ephemeral: true,
      });
    }

    if (action == "decrease") {
      // Decrease the user limit

      vc.edit({ userLimit: vc.userLimit - 1 }).catch(() => {});
      if (vc.userLimit !== 1 && vc.userLimit !== 0) {
        interaction.editReply({
          content: `Decreased the user limit to ${vc.userLimit - 1}!`,
          ephemeral: true,
        });
      } else if (vc.userLimit === 1) {
        interaction.editReply({
          content: `Disabled the user limit!`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `The user limit is already at 0!`,
          ephemeral: true,
        });
      }
    }

    if (action == "ban") {
      // Send a select menu with all the members
      interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
              .setCustomId("dynvc-ban")
              .setPlaceholder("Select member(s) to ban.")
              .setMaxValues(25)
              .setMinValues(1)
          ),
        ],
      });
    }

    if (action == "invite") {
      // Send a select menu with all the members
      interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
              .setCustomId("dynvc-invite")
              .setPlaceholder("Select member(s) to invite.")
              .setMaxValues(25)
              .setMinValues(1)
          ),
        ],
      });
    }

    if (action == "rename") {
      // Send a modal with a text input to choose the name.
      let maxLength =
        25 //- client.db.guilds.get(interaction.guild.id).dynvcs.prefix.length;
      interaction.showModal(
        new ModalBuilder()
          .setTitle("Rename the VC")
          .setCustomId(`dynvc-rename-${vc.id}`)
          .setComponents(
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setCustomId("dynvc-rename")
                .setPlaceholder("Cool VC!")
                .setMaxLength(maxLength)
                .setMinLength(1)
                .setRequired(true)
                .setLabel("New name for the VC.")
                .setStyle(TextInputStyle.Short)
            )
          )
      );
    }
  },
};
