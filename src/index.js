require('module-alias/register');
const { client } = require("./system");
const dotenv = require("dotenv");
dotenv.config();

client.login(process.env.TOKEN_BOT);
