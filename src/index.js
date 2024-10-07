const { client } = require("./system");
const dotenv = require("dotenv");
dotenv.config();

client.login(process.env.TOKEN_BOT)
    .catch(() => {
        console.error("Could not login to Discord. Please check your token and try again.");
        process.exit(1);
    });
