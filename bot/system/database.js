const fs = require("fs");

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
    return this.data[key];
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
