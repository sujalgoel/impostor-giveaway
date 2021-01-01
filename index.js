const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
const fs = require('fs');
const path = require('path');
const {
  GiveawaysManager
} = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#ff0000",
    reaction: "🎁"
  }
});
client.giveawaysManager = manager;

fs.readdir('./Commands/', (error, f) => {
  if (error) {
    return console.error(error);
  }
  let commands = f.filter(f => f.split('.').pop() === 'js');
  if (commands.length <= 0) {
    return console.log('no command!');
  }

  commands.forEach((f) => {
    let Command = require(`./Commands/${f}`);
    console.log(`${f} Command run!`);
    client.commands.set(Command.help.name, Command);
  });
});

client.on('message', message => {
  if (message.channel.type === 'dm') return;
  if (message.author.bot) {
    return;
  }
  if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    return;
  }
  let prefix = "g!"
  if (!message.content.startsWith(prefix)) {
    return;
  }

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let Command = args.shift();
  let cmd = client.commands.get(Command);

  if (!cmd) {
    return;
  }
  cmd.run(client, message, args);
  let date = new Date();
  console.log(`${message.author.username} | ${date} | Command : ${prefix}${Command} ${args.join(' ')}`)
})

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  if (member.user.bot) return;
  let conditionRole;

  let conditionsRoles = require(path.resolve(path.join(__dirname + '/database/conditionRole.json')));
  if (conditionsRoles[giveaway.messageID]) {
    conditionRole = conditionsRoles[giveaway.messageID].conditionRole;
  }
  if (conditionRole != 'none') {
    if (member.roles.cache.find(r => r.id === conditionRole)) {
      member.send(
        new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({
          format: 'png',
          dynamic: 'true'
        }))
        .setColor('GREEN')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been approved. **Good luck !**`)
        .setFooter(`Giveaway by ${reaction.message.author.tag}`)
        .setTimestamp()
      );
      return;
    } else {
      reaction.users.remove(member.id)
      let role = reaction.message.guild.roles.cache.find(r => r.id === conditionRole);
      member.send(
        new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({
          format: 'png',
          dynamic: 'true'
        }))
        .setColor('RED')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been denied. To enter, you need the \`${role.name}\` role.`)
        .setFooter(`Giveaway by ${reaction.message.author.tag}`)
        .setTimestamp()
      );
      return;
    }
  }

});

client.login(``)
