const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Ouça a melhor playlist de estudos"),

    async execute(interaction) {
        await interaction.reply("https://www.youtube.com/watch?v=5FrhtahQiRc&list=PLgPXFH_SIl7AhYQRFiE3DFjMD9pMz7rDo")
    }
}