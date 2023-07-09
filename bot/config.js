module.exports = {
  OWNER_IDS: ["244173330431737866"], // Bot owner ID's
  PREFIX: "A!", // Default prefix for the bot
  SUPPORT_SERVER: "https://discord.gg/tCNusW2uDC", // Your bot support server
  PRESENCE: {
    ENABLED: true, // Whether or not the bot should update its status
    STATUS: "online", // The bot's status [online, idle, dnd, invisible]
    TYPE: "WATCHING", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
  },
  DASHBOARD: {
    enabled: false, // enable or disable dashboard
    baseURL: "http://localhost:8080", // base url
    failureURL: "http://localhost:8080", // failure redirect url
    port: "8080", // port to run the bot on
  },
  INTERACTIONS: {
    SLASH: true, // Should the interactions be enabled
    CONTEXT: true, // Should contexts be enabled
    GLOBAL: true, // Should the interactions be registered globally
    TEST_GUILD_ID: "882756411031978005", // Guild ID where the interactions should be registered. [** Test you commands here first **]
  },
  XP_SYSTEM: {
    COOLDOWN: 5, // Cooldown in seconds between messages
    DEFAULT_LVL_UP_MSG: "{m}, You just leveled up to **Level {l}**",
  },
  MISCELLANEOUS: {
    DAILY_COINS: 100, // coins to be received by daily command
  },
  ECONOMY: {
    CURRENCY: " ₵",
    DAILY_COINS: 100, // coins to be received by daily command
    MIN_BEG_AMOUNT: 100, // minimum coins to be received when beg command is used
    MAX_BEG_AMOUNT: 2500, // maximum coins to be received when beg command is used
  },
  SUGGESTIONS: {
    ENABLED: true, // Should the suggestion system be enabled
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#31469f",
    APPROVED_EMBED: "#00ff00",
    DENIED_EMBED: "#ff0000",
  },
  IMAGE: {
    BASE_API: "https://image-api.strangebot.xyz",
  },
  MUSIC: {
    IDLE_TIME: 60, // Time in seconds before the bot disconnects from the voice channel
    MAX_SEARCH_RESULTS: 5,
    NODES: [
      {
        host: "ger.lavalink.mitask.tech",
        port: 2333,
        password: "lvserver",
        identifier: "German Link",
        retryDelay: 5000,
        secure: false,
      },
      {
        host: "usa.lavalink.mitask.tech",
        port: 2333,
        password: "lvserver",
        identifier: "USA Link",
        retryDelay: 5000,
        secure: false,
      },
    ],
  },
  /* Bot Embed Colors */
  EMBED_COLORS: {
    DEFAULT: "#31469f",
    BOT_EMBED: "#31469f",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
    AUTOMOD: "#36393F",
    TICKET_CREATE: "#31469f",
    TICKET_CLOSE: "#31469f",
    TIMEOUT_LOG: "#102027",
    UNTIMEOUT_LOG: "#4B636E",
    KICK_LOG: "#FF7961",
    SOFTBAN_LOG: "#AF4448",
    BAN_LOG: "#D32F2F",
    VMUTE_LOG: "#102027",
    VUNMUTE_LOG: "#4B636E",
    DEAFEN_LOG: "#102027",
    UNDEAFEN_LOG: "#4B636E",
    DISCONNECT_LOG: "RANDOM",
    MOVE_LOG: "RANDOM",
    GIVEAWAYS: "#FF468A",
  },
  /* Maximum number of keys that can be stored */
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR:
      "Unexpected Backend Error! Contact @axodubl#0001 for help or report this at https://archaic.axodouble.tech/",
  },
};
