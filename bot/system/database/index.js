const fs = require("fs");
const path = require("path");

class Database {
  constructor(filename) {
    this.filename = filename;
    this.data = this.loadData();
  }

  loadData() {
    try {
      const data = fs.readFileSync(`./database/${this.filename}.json`, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or there is an error, return an empty object
      return {};
    }
  }

  saveData() {
    const dataToSave = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(`./database/${this.filename}.json`, dataToSave, "utf8");
  }

  getAll() {
    return this.data;
  }

  get(key) {
    const modelPath = path.resolve(__dirname, `./models/${this.filename}.js`);
    const ModelClass = require(modelPath);

    if (this.data[key]) {
      // Merge properties from the default instance into the database entry
      this.data[key] = { ...new ModelClass(), ...this.data[key] };
      return this.data[key];
    } else {
      // Get the model for the entry and set the ID to the key

      try {
        const defaultInstance = new ModelClass();
        defaultInstance.id = key;

        // Merge properties from the default instance into the database entry
        this.data[key] = { ...defaultInstance, ...this.data[key] };

        // Save the instance to the database
        this.saveData();

        // Return the instance
        return this.data[key];
      } catch (error) {
        // If the model file doesn't exist or there is an error, return undefined
        return undefined;
      }
    }
  }

  set(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  remove(key) {
    delete this.data[key];
    this.saveData();
  }
}

module.exports = Database;
