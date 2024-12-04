const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduz áudio de um vídeo do YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL do vídeo do YouTube')
                .setRequired(true)),
    async execute({ client, interaction }) {
        const url = interaction.options.getString('url');
        const player = client.player;

        if (!interaction.member.voice.channel) {
            return interaction.reply('Você precisa estar em um canal de voz!');
        }

        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel,
            },
        });

        try {
            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }
        } catch {
            queue.destroy();
            return interaction.reply('Não consegui entrar no canal de voz.');
        }

        const track = await player.search(url, {
            requestedBy: interaction.user,
        }).then(x => x.tracks[0]);

        if (!track) {
            return interaction.reply('Nenhuma música encontrada.');
        }

        queue.addTrack(track);
        if (!queue.playing) await queue.play();

        interaction.reply(`Tocando agora: **${track.title}**`);
    },
};
