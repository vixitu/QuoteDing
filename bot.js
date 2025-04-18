// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const { initModels, Quote } = require("./initModels");
const sequelize = require("./database");

dotenv.config();
const TOKEN = process.env.TOKEN;

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

let commands = [];

const slashFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./commands/${file}`);
  client.commands.set(slashcmd.data.name, slashcmd);
  commands.push(slashcmd.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(TOKEN);
const clientId = "1362731347323650189";
const guildId = "1022070341490708541";

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  await initModels();
});

client.on("interactionCreate", async (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return;

    const slashcmd = client.commands.get(interaction.commandName);
    if (!slashcmd) interaction.reply("Not a valid slash command");

    await slashcmd.run({ client, interaction });
  }
  handleCommand();
});

// Log in to Discord with your client's token
client.login(TOKEN);
module.exports = client;
