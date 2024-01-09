const path = require("path");
const fs = require("fs");

// Command loader
async function loadCommands(client, reload = false) {
  // If reload is true, delete all commands
  if (reload) {
    await client.textcommands.clear();
    await client.aliases.clear();
    await client.slashcommands.clear();
    await client.log("Removed all commands.");
  }

  // Find all folders in the commands directory
  const commandFolders = fs
    .readdirSync("./commands")
    .filter((file) => fs.statSync(path.join("./commands", file)).isDirectory());

  // Register all commands in the folders
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all slash commands
    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if (command.slashcommand) {
        // Get current slash commands
        const commands = await client.application.commands.fetch();

        // Find a command with the same name in the commands
        const existingCommand = commands.find(
          (cmd) => cmd.name === command.slashcommand.name
        );

        // If the command doesn't exist, create it
        if (!existingCommand) {
          client.log(`Created ${command.slashcommand.name}.`);
          client.application.commands.create(command.slashcommand);
        } else if (
          existingCommand.description !== command.slashcommand.description ||
          existingCommand.options.toString() !==
            command.slashcommand.options.toString()
        ) {
          client.log(`Updated ${command.slashcommand.name}.`);
          client.application.commands.create(command.slashcommand);
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

  // Find all commands that are registered on Discord but not in the bot
  const commands = await client.application.commands.fetch();
  for (const command of commands) {
    if (!client.slashcommands.get(command[1].name)) {
      client.log(`Deleted ${command[1].name}.`);
      client.application.commands.delete(command[1]);
    }
  }

  client.log(`${reload ? "Rel" : "L"}oaded all commands.`);
}

// Button loader
async function loadButtons(client, reload = false) {
  // If reload is true, delete all buttons
  if (reload) {
    await client.buttons.clear();
    await client.log("Removed all buttons.");
  }

  // Find all folders in the buttons directory
  const buttonFolders = fs
    .readdirSync("./buttons")
    .filter((file) => fs.statSync(path.join("./buttons", file)).isDirectory());

  // Register all buttons in the folders
  for (const folder of buttonFolders) {
    const buttonFiles = fs
      .readdirSync(`./buttons/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all buttons
    for (const file of buttonFiles) {
      const button = require(`../buttons/${folder}/${file}`);
      client.buttons.set(button.name, button);
    }
  }

  client.log(`${reload ? "Rel" : "L"}oaded all buttons.`);
}

// Event loader
async function loadEvents(client, reload = false) {
  // If reload is true, delete all events
  if (reload) {
    await client.removeAllListeners();
    await client.log("Removed all events.");
  }

  // Find all folders in the events directory
  const eventFolders = await fs
    .readdirSync("./events")
    .filter((file) => fs.statSync(path.join("./events", file)).isDirectory());

  // Register all events in the folders
  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all events
    for (const file of eventFiles) {
      const event = require(`../events/${folder}/${file}`);
      event.once
        ? client.once(event.name, (...args) => event.execute(...args, client))
        : client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  client.log(`${reload ? "Rel" : "L"}oaded all events.`);
}

async function loadModals(client, reload = false) {
  // If reload is true, delete all modals
  if (reload) {
    await client.modals.clear();
    await client.log("Removed all modals.");
  }

  // Find all folders in the modals directory
  const modalFolders = fs
    .readdirSync("./modals")
    .filter((file) => fs.statSync(path.join("./modals", file)).isDirectory());

  // Register all modals in the folders
  for (const folder of modalFolders) {
    const modalFiles = fs
      .readdirSync(`./modals/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all modals
    for (const file of modalFiles) {
      const modal = require(`../modals/${folder}/${file}`);
      client.modals.set(modal.name, modal);
    }
  }

  client.log(`${reload ? "Rel" : "L"}oaded all modals.`);
}

async function loadInteractions(client, reload = false) {
  await loadCommands(client, reload);
  await loadButtons(client, reload);
  await loadEvents(client, reload);
  await loadModals(client, reload);
}

module.exports = {
  loadCommands,
  loadButtons,
  loadEvents,
  loadModals,
  loadInteractions,
};
