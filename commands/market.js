import dateFns from 'date-fns';
import functions from '../functions.js';


export default function market(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);
  
  alpaca.getClock().then(clock => {
    let m = '';

    if (clock.is_open) {
      m += 'Market is open.';
      const distance = dateFns.distanceInWordsStrict(new Date(), new Date(clock.next_close));
      m += '  Closes in '+distance+'.\n';
    } else {
      m += 'Market is closed.';
      const distance = dateFns.distanceInWordsStrict(new Date(), new Date(clock.next_open));
      m += '  Opens in '+distance+'.\n';
    }

    msg.channel.send(m);

  }).catch(error => {
    console.log(error);
  })
}
