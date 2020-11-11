const Discord = require('discord.js');

module.exports.run = async (client, message) => {
    let allGiveaways = client.giveawaysManager.giveaways
    let notEnded = client.giveawaysManager.giveaways.filter((g) => !g.ended);
    let ended = client.giveawaysManager.giveaways.filter((g) => g.ended);
    message.channel.send(
        new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setDescription(`All giveaways: **${allGiveaways.length}**\nGoing on: **${notEnded.length}**\nEnded: **${ended.length}**`)
    )
}

module.exports.help = {
    name: 'info'
}