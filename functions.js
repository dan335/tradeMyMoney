import dateFns from 'date-fns';
import settings from './settings.js';

const functions = {

  // alpaca returns strings for numbers
  stringToDollar: (str) => {
    const num = Number(str);
    if (isNaN(num)) {
      return num;
    }

    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(num);
  },


  // called on every command
  // store channel id for each guild
  addGuild: (db, msg) => {
    return new Promise((resolve, reject) => {
      const guildsCollection = db.collection('guilds');

      guildsCollection.updateOne({discordId:msg.guild.id}, {
        $setOnInsert: {
          discordId: msg.guild.id,
          channelId: msg.channel.id,
          name: msg.guild.name,
          createdAt: new Date()
        },
        $set: {
          updatedAt: new Date()
        }
      }, {upsert:true}, (error, result) => {
        resolve();
      });
    })
  },


  // called on an interval
  // place order with highest vote
  // delete orders
  reset: (db, alpaca, discord) => {
    const guildsCollection = db.collection('guilds');
    const ordersCollection = db.collection('orders');

    const cursor = ordersCollection.find({});
    cursor.toArray((error, orders) => {
      if (error) {
        console.log(error);
      } else {

        if (!orders.length) {
          return;
        }

        // delte orders in db
        ordersCollection.deleteMany({});

        // group together by number of votes
        let grouped = orders.reduce((accum, o) => {
          accum[o.type+'_'+o.symbol+'_'+o.exchange] = accum[o.type+'_'+o.symbol+'_'+o.exchange] || [];
          accum[o.type+'_'+o.symbol+'_'+o.exchange].push(o);
          return accum;
        }, Object.create(null));

        // find one with most votes
        // if multiple then use oldest
        let winningOrder = null;
        let votes = 0;
        let createdAt = new Date();
        Object.keys(grouped).forEach(key => {
          if (grouped[key].length >= votes) {

            let oldest = new Date();

            grouped[key].forEach(o => {
              if (dateFns.isBefore(new Date(o.createdAt), oldest)) {
                oldest = new Date(o.createdAt);
              }
            })

            if (grouped[key].length == votes) {
              if (dateFns.isBefore(oldest, createdAt)) {
                winningOrder = grouped[key][0];
                createdAt = oldest;
                votes = grouped[key].length;
              }
            } else {
              winningOrder = grouped[key][0];
              createdAt = oldest;
              votes = grouped[key].length;
            }
          }
        })

        if (winningOrder) {

          // place order
          alpaca.createOrder({
            symbol: winningOrder.symbol,
            qty: settings.numSharesBuy,
            side: winningOrder.type,
            type: 'market',
            time_in_force: 'day'
          }).then(order => {

            // get account value
            alpaca.getAccount().then(account => {
              const str = 'Placed order to '+order.side+' '+order.qty+' shares of '+order.symbol+'.  Next order in '+settings.intervalMinutes+' minutes.  Account value: '+functions.stringToDollar(account.portfolio_value)+'. Buying power: '+functions.stringToDollar(account.buying_power)+'.';
              functions.sendToGuilds(db, alpaca, discord, str);
            }).catch(error => {
              console.log(error);
            })

          }).catch(error => {
            if (error.statusCode == 403) {
              const str = 'Buying power or shares is not sufficient to place order.';
              functions.sendToGuilds(db, alpaca, discord, str);
            } else if (error.statusCode == 422) {
              const str = 'Input parameters are not recognized.';
              console.log(str, winningOrder);
            }
          });
        }

      }
    })

  },


  // send a message to all guilds
  sendToGuilds: function(db, alpaca, discord, str) {
    const guildsCollection = db.collection('guilds');

    const cursor = guildsCollection.find({}, {projection:{channelId:1}});
    cursor.toArray((error, guilds) => {
      if (error) {
        console.log(error);
      } else {
        guilds.forEach(guild => {
          const channel = discord.channels.get(guild.channelId);
          if (channel) {
            channel.send(str);
          } else {
            guildsCollection.deleteOne({_id:guild._id});
          }
        })
      }
    })
  }
}

export default functions
