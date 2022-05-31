const  Discord= require("discord.js")
const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
    intents: Object.keys(Discord.Intents.FLAGS),
});
const db = require('quick.db')

client.on('ready', () => {
    console.log(`Connecté sur ${client.user.tag} !`)
})

client.on('messageDelete', async message => {
    if (!message.embeds.toString()) return

    const embed = new Discord.MessageEmbed()
    embed.setDescription(`\\✏️ Cette embed a été supprimé dans le salon <#${message.channel.id}>`)
    embed.setFooter({ text: 'By Rytez et Irox' })
    embed.setColor('2f3136')

    db.set(message.channel.id, message.embeds[0].toJSON())

    const button = new Discord.MessageButton()
    button.setCustomId(message.channel.id)
    button.setLabel('📜')
    button.setStyle('PRIMARY')

    const button2 = new Discord.MessageButton()
    button2.setCustomId(message.channel.id)
    button2.setLabel('📜')
    button2.setStyle('PRIMARY')
    button2.setDisabled(true);

    const row = new Discord.MessageActionRow().addComponents([button])
    const row2 = new Discord.MessageActionRow().addComponents([button2])

    client.channels.cache.get('id channel log').send({ content: `Salon: <#${message.channel.id}>`, embeds: [message.embeds[0].toJSON()] })
    client.channels.cache.get('id channel log').send({ embeds: [embed], components: [row] })


    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            interaction.message.edit({ components: [row2] })
            interaction.reply({
                ephemeral: true, embeds: [{ description: `✅ J'ai bien envoyer le message dans le salon.` }]
            })
            const channel = interaction.guild.channels.cache.get(interaction.customId)
            if (channel) channel.send({ embeds: [new Discord.MessageEmbed(db.get(interaction.customId))] })
        }
    })
})
client.login('token')
