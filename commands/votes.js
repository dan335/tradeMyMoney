import functions from '../functions.js';
import settings from '../settings.js';
import dateFns from 'date-fns';


export default function votes(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  const ordersCollection = db.collection('orders');
  const cursor = ordersCollection.find({});
  cursor.toArray((error, orders) => {
    if (error) {
      console.log(error);
    } else {

      if (!orders.length) {
        msg.channel.send('No votes.');
        return;
      }

      // group together by number of votes
      let grouped = orders.reduce((accum, o) => {
        accum[o.type+'_'+o.symbol+'_'+o.exchange] = accum[o.type+'_'+o.symbol+'_'+o.exchange] || [];
        accum[o.type+'_'+o.symbol+'_'+o.exchange].push(o);
        return accum;
      }, Object.create(null));

      // move into array
      let votes = [];
      Object.keys(grouped).forEach(key => {
        votes.push(Object.assign({num:grouped[key].length}, grouped[key][0]));
      });

      // sort
      votes.sort((a, b) => {
        if (a.num < b.num) {
          return 1;
        } else if (b.num < a.num) {
          return -1;
        } else {
          return 0;
        }
      });

      // print message
      let m = '';
      const minLeft = settings.intervalMinutes - dateFns.getMinutes(new Date()) % settings.intervalMinutes;
      m += minLeft+' minutes left.\n\n';
      votes.forEach(vote => {
        m += vote.num;
        if (vote.num == 1) {
          m += ' vote';
        } else {
          m += ' votes';
        }
        m += ' to '+vote.type+' '+vote.symbol+'\n';
      });
      msg.channel.send(m);
    }
  })
}
