const path = require("path");
const fs = require("fs");

// Command loader
async function loadCommands(client) {
  // Find all folders in the commands directory
  const commandFolders = fs
    .readdirSync("./interactions/commands")
    .filter((file) =>
      fs.statSync(path.join("./interactions/commands", file)).isDirectory()
    );

  // Register all commands in the folders
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./interactions/commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all slash commands
    for (const file of commandFiles) {
      const command = require(`../interactions/commands/${folder}/${file}`);
      if (command.slashcommand) {
        // Get current slash commands
        let commands = await client.application.commands.fetch();

        // Find a command with the same name in the commands
        const existingCommand = commands.find(
          (cmd) => cmd.name === command.slashcommand.name
        );

        if (existingCommand && !command.guild) {
          // If the command exists, compare it to the current command
          if (!commandsSame(existingCommand, command.slashcommand)) {
            // If the commands are different, update the command
            client.log(`Updating ${command.slashcommand.name} command.`);
            await existingCommand.edit(command.slashcommand);
          }
        } else if (!existingCommand && !command.guild) {
          // If the command doesn't exist, create it
          client.log(`Created ${command.slashcommand.name} command.`);
          await client.application.commands.create(command.slashcommand);
        } else if (command.guild) {
          // If the command is a guild command, register it as a guild command
          let guild = await client.guilds.cache.get(command.guild);

          if (!guild) {
            client.error(
              `Could not find guild with ID ${command.guild} for command ${command.slashcommand.name}.`
            );
            continue;
          }

          // Get current guild commands
          commands = await guild.commands.fetch();

          // Find a command with the same name in the commands
          const existingCommand = commands.find(
            (cmd) => cmd.name === command.slashcommand.name
          );

          if (existingCommand) {
            // If the command exists, compare it to the current command
            if (!commandsSame(existingCommand, command.slashcommand)) {
              // If the commands are different, update the command
              client.log(
                `Updating ${command.slashcommand.name} command in guild ${guild.name}.`
              );
              await existingCommand.edit(command.slashcommand);
            }
          } else {
            // If the command doesn't exist, create it
            client.log(
              `Created ${command.slashcommand.name} command in guild ${guild.name}.`
            );
            await guild.commands.create(command.slashcommand);
          }
        }

        client.slashcommands.set(command.name, command);
      }
      if (command.textcommand) {
        client.textcommands.set(command.name, command);
        if (command.aliases) {
          for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
          }
        }
      }
    }
  }

  client.log(`Loaded ${client.slashcommands.size} commands.`);
}

// Slash command comparer
/**
 * @param {import("discord.js").ApplicationCommand} command1
 * @param {import("discord.js").ApplicationCommand} command2
 */
function commandsSame(command1, command2) {
  if (command1.name !== command2.name) return false;
  if (command1.description !== command2.description) return false;
  if (command1.defaultPermission !== command2.defaultPermission) return false;
  if (command1.options.length !== command2.options.length) return false;

  return true;
}

// Context loader
async function loadContexts(client) {
  // Find all folders in the contexts directory
  const commandFolders = fs
    .readdirSync("./interactions/contexts")
    .filter((file) =>
      fs.statSync(path.join("./interactions/contexts", file)).isDirectory()
    );

  // Register all contexts in the folders
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./interactions/contexts/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all slash contexts
    for (const file of commandFiles) {
      const command = require(`../interactions/contexts/${folder}/${file}`);
      if (command.menu) {
        // Get current slash contexts
        const contexts = await client.application.commands.fetch();

        // Find a command with the same name in the contexts
        const existingContext = contexts.find(
          (cmd) => cmd.name === command.menu.name
        );

        // If the command doesn't exist, create it
        if (!existingContext) {
          client.log(`Created ${command.menu.name} context.`);
          client.application.commands.create(command.menu);
        }

        client.contexts.set(command.menu.name, command);
      }
    }
  }

  client.log(`Loaded ${client.contexts.size} contexts.`);
}

// Delete old contexts and commands
async function deleteInteractions(client) {
  // Get current slash commands
  const commands = await client.application.commands.fetch();

  // Find all commands that are registered on Discord but not in the bot
  commands.forEach((command) => {
    if (
      !client.slashcommands.has(command.name) &&
      !client.contexts.has(command.name)
    ) {
      client.log(`Deleting ${command.name} interaction.`);
      command.delete();
    }
  });

  const guilds = await client.guilds.fetch();

  // Find all guilds that have commands that are registered on Discord but not in the bot
  guilds.forEach(async (guild) => {
    // Get current guild commands
    if (!guild.commands) return;
    const commands = await guild.commands.fetch();

    // Find all commands that are registered on Discord but not in the bot
    commands.forEach((command) => {
      if (!client.slashcommands.has(command.name)) {
        client.log(
          `Deleting ${command.name} interaction in guild ${guild.name}.`
        );
        command.delete();
      }
    });
  });
}

// Button loader
async function loadButtons(client) {
  // Find all folders in the buttons directory
  const buttonFolders = fs
    .readdirSync("./interactions/buttons")
    .filter((file) =>
      fs.statSync(path.join("./interactions/buttons", file)).isDirectory()
    );

  // Register all buttons in the folders
  for (const folder of buttonFolders) {
    const buttonFiles = fs
      .readdirSync(`./interactions/buttons/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all buttons
    for (const file of buttonFiles) {
      const button = require(`../interactions/buttons/${folder}/${file}`);
      client.buttons.set(button.name, button);
    }
  }

  client.log(`Loaded ${client.buttons.size} buttons.`);
}

// Event loader
async function loadEvents(client) {
  // Find all folders in the events directory
  const eventFolders = await fs
    .readdirSync("./events")
    .filter((file) => fs.statSync(path.join("./events", file)).isDirectory());

  // Event Counter
  let eventCount = 0;

  // Register all events in the folders
  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all events
    for (const file of eventFiles) {
      eventCount++;
      const event = require(`../events/${folder}/${file}`);
      event.once
        ? client.once(event.name, (...args) => event.execute(...args, client))
        : client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  client.log(`Loaded ${eventCount} events.`);
}

// Modal loader
async function loadModals(client) {
  // Find all folders in the modals directory
  const modalFolders = fs
    .readdirSync("./interactions/modals")
    .filter((file) =>
      fs.statSync(path.join("./interactions/modals", file)).isDirectory()
    );

  // Register all modals in the folders
  for (const folder of modalFolders) {
    const modalFiles = fs
      .readdirSync(`./interactions/modals/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all modals
    for (const file of modalFiles) {
      const modal = require(`../interactions/modals/${folder}/${file}`);
      client.modals.set(modal.name, modal);
    }
  }

  client.log(`Loaded ${client.modals.size} modals.`);
}

// Select menu loader
async function loadSelectMenus(client) {
  // Find all folders in the select menus directory
  const selectMenuFolders = fs
    .readdirSync("./interactions/selectmenus")
    .filter((file) =>
      fs.statSync(path.join("./interactions/selectmenus", file)).isDirectory()
    );

  // Register all select menus in the folders
  for (const folder of selectMenuFolders) {
    const selectMenuFiles = fs
      .readdirSync(`./interactions/selectmenus/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all select menus
    for (const file of selectMenuFiles) {
      const selectMenu = require(`../interactions/selectmenus/${folder}/${file}`);
      client.selectmenus.set(selectMenu.name, selectMenu);
    }
  }

  client.log(`Loaded ${client.selectmenus.size} modals.`);
}

// Interaction loader
async function loadInteractions(client) {
  await loadCommands(client);
  await loadContexts(client);
  await loadButtons(client);
  await loadEvents(client);
  await loadModals(client);
  await loadSelectMenus(client);

  await deleteInteractions(client);
}

module.exports = {
  loadCommands,
  loadButtons,
  loadEvents,
  loadInteractions,
};
