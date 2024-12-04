// Require the necessary discord.js classes
const { isChatInputApplicationCommandInteraction } = require('discord-api-types/utils/v10');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

// Importação dos comandos
const fs = require("node:fs")
const path = require("node:path") //modulo nativo do Node que permite navegarmos entre caminhos (path) que nos permitirar interagir com a pasta de commands
const commandsPath = path.join(__dirname, "commands")
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))
console.log(commandsFiles)

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)

    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes`)
    }
}

console.log(client.commands)

//----------------------------------------
const { Player } = require('discord-player');
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});


//----------------------------------------

// L ogin do bot
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

//Listemer de interações com o bot
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand() ) return
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("Comando não encontrado!")
        return
    }
    try {
        await command.execute(interaction)
    }
    catch (error) {
        console.error("Erro ao executar comando:", error);
        await interaction.reply({ content: "Houve um erro ao executar esse comando.", ephemeral: true });
    }
})