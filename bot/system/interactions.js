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
        const commands = await client.application.commands.fetch();

        // Find a command with the same name in the commands
        const existingCommand = commands.find(
          (cmd) => cmd.name === command.slashcommand.name
        );

        // If the command doesn't exist, create it
        if (!existingCommand) {
          client.log(`Created ${command.slashcommand.name} command.`);
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

  client.log(`Loaded all commands.`);
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

  client.log(`Loaded all contexts.`);
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

  client.log(`Loaded all buttons.`);
}

// Event loader
async function loadEvents(client) {
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

  client.log(`Loaded all events.`);
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

  client.log(`Loaded all modals.`);
}

// Interaction loader
async function loadInteractions(client) {
  await loadCommands(client);
  await loadContexts(client);
  await loadButtons(client);
  await loadEvents(client);
  await loadModals(client);

  await deleteInteractions(client);
}

module.exports = {
  loadCommands,
  loadButtons,
  loadEvents,
  loadInteractions,
};
