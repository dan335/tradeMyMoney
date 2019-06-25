import functions from '../functions.js';
import settings from '../settings.js';


export default function positions(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  alpaca.getPositions().then(positions => {

    if (!positions.length) {
      msg.channel.send('No positions.');
      return;
    }

    positions.sort((a, b) => {
      const ap = Number(a.unrealized_plpc);
      const bp = Number(b.unrealized_plpc);
      if (ap < bp) {
        return 1;
      } else if (bp < ap) {
        return -1;
      } else {
        return 0;
      }
    })

    let m = '';

    for (let n = 0; n < positions.length; n++) {
      m += (n+1)+'. **'+positions[n].qty+'** x **'+positions[n].symbol+'**';
      m += '    value:  '+functions.stringToDollar(positions[n].market_value);
      m += '    p/l:  '+functions.stringToDollar(positions[n].unrealized_pl);
      m += '    '+Math.round(Number(positions[n].unrealized_plpc)*10000)/100+'%';
      m += '\n';

      if (n%settings.numPerPage == settings.numPerPage-1) {
        msg.channel.send(m);
        m = '';
      }
    }

    if (m.length) {
      msg.channel.send(m);
    }

  }).catch (error => {
    console.log(error);
  })
}
