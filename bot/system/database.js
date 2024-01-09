const fs = require("fs").promises;

async function loadDatabaseMap(client) {
  let files = await fs.readdir("./system/database/");
  for (let file of files) {
    let fileData = await fs.readFile(`./system/database/${file}`);
    let fileJSON = JSON.parse(fileData);

    client.database.set(
      file.replace(".json", ""),
      new Map(Object.entries(fileJSON))
    );
  }

  client.log("Loaded database into cache.");
}

async function saveDatabaseMap(client) {
  // Save every part of the client.database map
  for (let [key, value] of client.database) {
    await fs.writeFile(
      `./system/database/${key}.json`,
      JSON.stringify(Object.fromEntries(value))
    );
  }
}

module.exports = {
  loadDatabaseMap,
  saveDatabaseMap,
};
