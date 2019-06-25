import functions from '../functions.js';
import settings from '../settings.js';
import dateFns from 'date-fns';


export default function order(db, discord, alpaca, msg) {
  functions.addGuild(db, msg).then(() => {

    alpaca.getClock().then(clock => {
      if (clock.is_open) {

        let type = null;
        let symbol = null;
        let check = null;

        if (msg.content.substring(0, 4) == settings.botPrefix+'buy') {
          type = 'buy';
          symbol = msg.content.replace(settings.botPrefix+'buy', '').trim();
          check = alpaca.getAsset(symbol);

        } else if (msg.content.substring(0, 5) == settings.botPrefix+'sell') {
          type = 'sell';
          symbol = msg.content.replace(settings.botPrefix+'sell', '').trim();
          check = alpaca.getPosition(symbol);
        }

        if (!type) {
          return;
        }

        check.then(check => {

          if (type == 'buy') {
            if (!check.tradable) {
              msg.reply('Symbol not tradable.');
              return;
            }
          }

          const ordersCollection = db.collection('orders');

          // remove previous order by user
          ordersCollection.deleteOne({userDiscordId:msg.author.id}, {}, (error, result) => {
            if (error) {
              console.log(error);
            } else {
              if (result.deletedCount) {
                msg.reply("You're only allowed one vote every "+settings.intervalMinutes+" minutes.  I replaced your previous vote with this one.");
              }

              const order = {
                type: type,
                symbol: check.symbol,
                exchange: check.exchange,
                createdAt: new Date(),
                guildDiscordId: msg.guild.id,
                guildName: msg.guild.name,
                userDiscordId: msg.author.id,
                username: msg.member && msg.member.nickname ? msg.member.nickname : msg.author.username
              };

              ordersCollection.insertOne(order, {}, (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  const minLeft = settings.intervalMinutes - dateFns.getMinutes(new Date()) % settings.intervalMinutes;
                  const str = 'Added vote by '+order.guildName+':'+order.username+' to **'+order.type+' '+order.symbol+'** in '+minLeft+' minutes.';
                  functions.sendToGuilds(db, alpaca, discord, str);
                }
              });
           }
          });

        }).catch(error => {
          if (error.statusCode == 404) {
            msg.reply('Symbol not found.');
          }
        })

      } else {
        msg.reply('Market is not open.');
      }
    }).catch(error => {
      console.log(error);
    })

  })
}
