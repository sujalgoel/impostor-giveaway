const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  let hasPerm = message.member.hasPermission('MANAGE_MESSAGES');
  if (hasPerm === false) {
    return message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('__ERROR__')
      .setColor('#FF0000')
      .setDescription("You need `MANAGE_MESSAGES` permissions or a role named `giveaway` to use that command!")
    )
  }
  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setTitle('__ERROR__')
      .setColor('#FF0000')
      .setDescription("You need to enter a message ID!")
    return message.channel.send(embed)
  }
  let messageID = args[0];
  client.giveawaysManager.delete(messageID).then(() => {
    const embwed = new Discord.MessageEmbed()
      .setTitle('__SUCCESS__')
      .setColor('#00FF00')
      .setDescription("Giveaway deleted!")
    return message.channel.send(embwed)
  }).catch((err) => {
    const ewm3bed = new Discord.MessageEmbed()
      .setTitle('__ERROR__')
      .setColor('#FF0000')
      .setDescription("No giveaway exist with that message ID!")
    return message.channel.send(ewm3bed)
  });
}

module.exports.help = {
  name: 'delete'
}