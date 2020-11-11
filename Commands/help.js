const Discord = require("discord.js");

module.exports.run = async (client, message) => {
    message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('Help System')
        .setColor('#ff0000')
        .setDescription('`g!delete`, `g!drop`, `g!edit`, `g!end`, `g!help`, `g!info`, `g!reroll`, `g!start`')
    )
}

module.exports.help = {
    name: "help"
}