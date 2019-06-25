import functions from '../functions.js';
import settings from '../settings.js';


export default function setChannel(db, discord, alpaca, msg) {
  functions.addGuild(db, msg).then(() => {
    // make sure author is owner
    if (msg.author.id != msg.guild.ownerID) {
      msg.reply('setChannel command can only be used by guild owner.');
      return;
    }

    let name = msg.content.replace(settings.botPrefix+'setChannel', '');
    name = name.replace('#', '');
    name = name.trim();

    const channel = msg.guild.channels.find(c => c.name == name);

    if (channel) {

      const guildsCollection = db.collection('guilds');

      guildsCollection.updateOne({discordId:msg.guild.id}, {
        $set: {
          channelId:channel.id
        }
      }, {}, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          if (result.matchedCount) {
            msg.reply('Channel updated.');
          } else {
            msg.reply('Could not find channel.');
          }
        }
      })

    } else {
      msg.reply('I could not find that channel.');
    }
  })
}
