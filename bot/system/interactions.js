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

  // Find all commands that are registered on Discord but not in the bot
  client.application.commands.fetch().then((commands) => {
    commands.forEach((command) => {
      if (!client.slashcommands.has(command.name)) {
        client.log(`Deleting the /${command.name} command.`);
        command.delete();
      }
    });
  });

  client.log(`Loaded all commands.`);
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
    .readdirSync("./interactions/events")
    .filter((file) =>
      fs.statSync(path.join("./interactions/events", file)).isDirectory()
    );

  // Register all events in the folders
  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./interactions/events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Register all events
    for (const file of eventFiles) {
      const event = require(`../interactions/events/${folder}/${file}`);
      event.once
        ? client.once(event.name, (...args) => event.execute(...args, client))
        : client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  client.log(`Loaded all events.`);
}

async function loadInteractions(client) {
  await loadCommands(client);
  await loadButtons(client);
  await loadEvents(client);
}

module.exports = {
  loadCommands,
  loadButtons,
  loadEvents,
  loadInteractions,
};
