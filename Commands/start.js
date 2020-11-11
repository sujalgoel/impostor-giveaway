const Discord = require('discord.js');
const ms = require('ms');
const path = require('path');
const fs = require('fs')

module.exports.run = async (client, message, args) => {
    let hasPerm = message.member.hasPermission('MANAGE_MESSAGES');


    if (hasPerm === false) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription('You need `MANAGE_MESSAGES` permissions or a role named ``giveaway`` to use that command.')
            .setTimestamp()
        )
    }

    if (!args[0]) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription('Please enter a giveaway duration.\n\n__Example__ : `g!start 1m 1 Nitro Classic`')
            .setTimestamp()
        )
    }

    if (!args[1]) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription('Please, enter the number of winners.\n\n__Example__ : `g!start 1m 1 Nitro Classic`')
            .setTimestamp()
        )
    }

    if (!args[2]) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription('Please, enter the giveaway gift.\n\n__Example__ : `g!start 1m 1 Nitro Classic`')
            .setTimestamp()
        )
    }

    message.delete();

    let embed = await message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('__FINALISATION__')
        .setColor('#ff0000')
        .setDescription('__Do you want to add restrictions?__\n\n`<roleID>`・Need to have a role to enter\n``no``・Launch giveaway !\n\nTo add restrictions, enter the guild id after this message.')
    )
    let error = false;
    let id;
    await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 60000,
        errors: ["time"]
    }).then(collected => {
        id = collected.first().content;
        collected.first().delete()
    }).catch((err) => {
        error = true;
        embed.edit(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription("You didn't enter a message. Cancelling giveaway...")
            .setTimestamp()
        );
        return;
    });
    if (error) return;
    if (id.toLowerCase() === 'no') {
        let giveawayMessage = await client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(" "),
            winnerCount: parseInt(args[1]),
            messages: {
                giveaway: "🎉 **GIVEAWAY** 🎉",
                giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
                timeRemaining: `\n\`⏲️\`・Time left: **{duration}**!\n\`👑\`・Hosted by: ${message.author}\n\`🏆\`・Winner(s): ${parseInt(args[1])}`,
                inviteToParticipate: "React with 🎁 to enter!",
                winMessage: "\`🎉\`・Congratulations, {winners}! You won **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: `\`⛔\`・There are no correct participations.\n\`👑\`・Hosted by: ${message.author}`,
                winners: `\`🏆\`・Winner(s)`,
                endedAt: "Ended",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        });
        let conditionsRoles = require(path.resolve(path.join('./database/conditionRole.json')));
        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: 'none'
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });
        return;
    }
    let role = message.guild.roles.cache.find(r => r.id === id);
    if (!role) {
        return embed.edit(
            new Discord.MessageEmbed()
            .setTitle('__ERROR__')
            .setColor('#ff0000')
            .setDescription(`I can't find the role - Be sure you enter the correct role ID.`)
        )
    }
    embed.delete()
    let giveawayMessage = await client.giveawaysManager.start(message.channel, {
        time: ms(args[0]),
        prize: args.slice(2).join(" "),
        winnerCount: parseInt(args[1]),
        messages: {
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            timeRemaining: `\n\`⏲️\`・Time left: **{duration}**!\n\`👑\`・Hosted by: ${message.author}\n\`🏆\`・Winner(s): ${parseInt(args[1])}`,
            inviteToParticipate: "React with 🎁 to enter!",
            winMessage: "\`🎉\`・Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: `\`⛔\`・There are no correct participations.\n\`👑\`・Hosted by: ${message.author}`,
            winners: `\`🏆\`・Winners(s)`,
            endedAt: "Ended",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    });

    if (message.guild.roles.cache.find(r => r.id === id)) {
        let role = message.guild.roles.cache.find(r => r.id === id);

        let conditionsRoles = require(path.resolve(path.join('./database/conditionRole.json')));
        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: 'none'
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });
        let conditionRole = conditionsRoles[giveawayMessage.messageID].conditionsRoles;

        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: role.id
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });

        const embed = new Discord.MessageEmbed()
            .setTitle('__CONDITION__')
            .setColor('#ff0000')
            .setDescription('To enter, you need the <@&' + role.id + '> rôle.')
        message.channel.send(embed)
    }
}

module.exports.help = {
    name: "start"
}