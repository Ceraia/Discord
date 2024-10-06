const { ChannelType, PermissionsBitField, VoiceState } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  /**
   * @param {import("discord.js").VoiceState} oldState
   * @param {import("discord.js").VoiceState} newState
   */
  async execute(oldState, newState) {
    // if (newState.channel)
    //   if (newState.channel.guild.id !== "750209335841390642") return;
    // if (oldState.channel)
    //   if (oldState.channel.guild.id !== "750209335841390642") return;
    // Check if the user joined the join to create channel by
    // checking if the channel permission overrides include priority speaker
    // for the oldState.client user

    if (newState.channel) {
      // User joined a channel
      if (
        newState.channel.permissionOverwrites.resolve(
          oldState.client.user.id
        ) &&
        newState.channel.permissionOverwrites
          .resolve(oldState.client.user.id)
          .allow.has(PermissionsBitField.Flags.PrioritySpeaker) // Bot has priority speaker in the channel so it is a lobby
      ) {
        const channel = newState.guild.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildVoice &&
            c.permissionOverwrites.resolve(newState.member.id) &&
            c.permissionOverwrites
              .resolve(newState.member.id)
              .allow.has(PermissionsBitField.Flags.AddReactions) &&
            c.permissionOverwrites.resolve(oldState.client.user.id) &&
            c.permissionOverwrites
              .resolve(oldState.client.user.id)
              .allow.has(PermissionsBitField.Flags.AddReactions)
        ); // Channel has perm overrides for add reactions for the user and bot so the vc is a dynamic vc

        if (channel) {
          // Drag the user to the channel they own
          newState.member.voice.setChannel(channel);
        } else {
          // Create a new channel for the user with the same permissions as the
          // category if the channel they joined has a category

          // Make the name the first 25 characters of the next string

          let name =
            //newState.client.db.guilds.get(newState.guild.id).dynvcs.prefix +
            (newState.member.nickname || newState.member.user.username);
          if (name.length > 25) name = name.slice(0, 25);

          newState.guild.channels
            .create({
              name: name,
              type: ChannelType.GuildVoice,
              parent: newState.channel.parent ? newState.channel.parent : null,
            })
            .catch(() => {
              newState.member.send(
                `<@!${newState.member.id}> I don't have permission to create a channel in the category you are in. Please make sure I have the correct permissions and try again.\nContact your server administrator if you need help.`
              ).catch(() => { });

              newState.guild.fetchOwner().then((owner) => {
                owner.send(
                  `I don't have permission to send messages in any channel in ${newState.guild.name}. Please give me permission to send messages in a channel and try again.`
                ).catch(() => { });
              });


              client.log(`${newState.guild.name}, incorrectly configured permissions.`);
            })
            .then((channel) => {
              // Add the permission overrides for the user
              channel
                .lockPermissions()
                .then((channel) => {
                  channel.permissionOverwrites
                    .create(newState.member.id, {
                      AddReactions: true,
                      Connect: true,
                    })
                    .catch(() => { });
                  channel.permissionOverwrites
                    .create(oldState.client.user.id, {
                      AddReactions: true,
                    })
                    .catch(() => { });

                  // Add override roles
                  // newState.client.db.guilds
                  //   .get(newState.guild.id)
                  //   .dynvcs.overrides.forEach((role) => {
                  //     channel.permissionOverwrites
                  //       .create(role, {
                  //         Connect: true,
                  //         ViewChannel: true,
                  //       })
                  //       .catch(() => {});
                  //   });

                  // Move the user to the channel
                  newState.member.voice.setChannel(channel).catch(() => { });

                  // Wait 60 seconds and attempt to do the same thing as above
                  setTimeout(() => {
                    channel.permissionOverwrites
                      .create(newState.member.id, {
                        AddReactions: true,
                        Connect: true,
                      })
                      .catch(() => { });
                    channel.permissionOverwrites
                      .create(oldState.client.user.id, {
                        AddReactions: true,
                      })
                      .catch(() => { });

                    // // Add override roles
                    // newState.client.db.guilds
                    //   .get(newState.guild.id)
                    //   .dynvcs.overrides.forEach((role) => {
                    //     channel.permissionOverwrites
                    //       .create(role, {
                    //         Connect: true,
                    //         ViewChannel: true,
                    //       })
                    //       .catch(() => {});
                    //   });
                  }, 60000);
                })
                .catch(() => {
                  channel.permissionOverwrites
                    .create(newState.member.id, {
                      AddReactions: true,
                      Connect: true,
                    })
                    .catch(() => { });
                  channel.permissionOverwrites
                    .create(oldState.client.user.id, {
                      AddReactions: true,
                    })
                    .catch(() => { });

                  // Add override roles
                  // newState.client.db.guilds
                  //   .get(newState.guild.id)
                  //   .dynvcs.overrides.forEach((role) => {
                  //     channel.permissionOverwrites
                  //       .create(role, {
                  //         Connect: true,
                  //         ViewChannel: true,
                  //       })
                  //       .catch(() => {});
                  //   });

                  // Move the user to the channel
                  newState.member.voice.setChannel(channel).catch(() => { });

                  // Wait 60 seconds and attempt to do the same thing as above
                  setTimeout(() => {
                    channel.permissionOverwrites
                      .create(newState.member.id, {
                        AddReactions: true,
                        Connect: true,
                      })
                      .catch(() => { });
                    channel.permissionOverwrites
                      .create(oldState.client.user.id, {
                        AddReactions: true,
                      })
                      .catch(() => { });

                    // Add override roles
                    // newState.client.db.guilds
                    //   .get(newState.guild.id)
                    //   .dynvcs.overrides.forEach((role) => {
                    //     channel.permissionOverwrites
                    //       .create(role, {
                    //         Connect: true,
                    //         ViewChannel: true,
                    //       })
                    //       .catch(() => {});
                    //   });
                  }, 60000);
                });
            });
        }
      }
    }
    if (oldState.channel) {
      // User left a channel
      oldState.guild.channels.cache.forEach((channel) => {
        if (
          channel.type === ChannelType.GuildVoice &&
          channel.permissionOverwrites.resolve(oldState.client.user.id) &&
          channel.permissionOverwrites
            .resolve(oldState.client.user.id)
            .allow.has(PermissionsBitField.Flags.AddReactions) &&
          channel.members.size === 0
        ) {
          // Delete the channel
          channel.delete().catch(() => { });
        }
      });
    }
  },
};
