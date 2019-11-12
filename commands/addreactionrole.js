
const Discord = require('discord.js')
exports.run = async (client, msg, args) => {


    let array2 = []

    msg.channel.send('How many roles do you want to add? (20 MAX)')

    const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
        max: 1,
        time: 30000,
    })
    if (!msgs.size) return msg.channel.send('Did not get a valid response within 30 seconds, cancelling.')
    if (msgs.first().content <= 0) return msg.channel.send('Integer must be larged than 0.')
    if (msgs.first().content > 20) return msg.channel.send('Integer was larger than 20, cancelling.')


    let value = parseInt(msgs.first().content)


    while(value > 0) {

        msg.channel.send('Now give me the `NAME` of the role you wish to add.')


        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
            max: 1,
            time: 30000,
        })

        if (!msgs.size) return msg.channel.send('Did not get a valid response within 30 seconds, cancelling.')
 

        let roles = client.reactionroles.get(msg.guild.id, "roles")
        let role = msg.guild.roles.find(r => r.name === msgs.first().content)
        if (!role) return msg.channel.send('Could not find that role, returning.') // continue if you don't want to return

        if (roles.includes(msgs.first().content)) return msg.channel.send('You already had that role added onto a message, remove it before adding it again.')


        msg.channel.send(`Now give me the emoji **name** or **id**.`)
        const emojiInput = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
            max: 1,
            time: 30000,
        })

        if (!emojiInput.size) return msg.channel.send('Did not get a valid response within 30 seconds, cancelling.')

        let emoji = client.emojis.get(emojiInput.first().content) || client.emojis.find(e => e.name === emojiInput.first().content)
        if (!emoji) return msg.channel.send('Could not find that emoji, returning.')


        client.reactionroles.push(msg.guild.id, {emoji: emoji.name, emojiid: emoji.id, role: msgs.first().content}, "roles")
        value--
        array2.push({id: emoji.id, role: msgs.first().content, name: emoji.name})

    }


    let array = client.reactionroles.get(msg.guild.id, "roles")
    let embed = new Discord.MessageEmbed()
    .setAuthor('React to get a role!', msg.guild.iconURL)
    .setDescription(array2.map(i => `${client.emojis.get(i.id)} => ${msg.guild.roles.get(msg.guild.roles.find(r => r.name === i.role).id)}`))
    .setColor("RANDOM")
    msg.channel.send(embed).then(m => {

        client.reactionroles.push(msg.guild.id, m.id, "ids")
        for (var i = 0; i < array.length; i++) {
            m.react(array2[i].id)
        }

        array2.length = 0;

    })



}