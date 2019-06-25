import settings from '../settings.js';
import functions from '../functions.js';


export default function position(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  let symbol = msg.content.replace(settings.botPrefix+'position', '').trim();

  if (!symbol) {
    msg.reply('Missing symbol.  Syntax: **'+settings.botPrefix+'position <symbol>**');
    return;
  }

  alpaca.getPosition(symbol).then(position => {
    let m = '';
    m += '**'+position.qty+' x '+position.symbol+':'+position.exchange+':'+position.asset_class+'**\n';
    m += 'Avg Entry Price: '+functions.stringToDollar(position.avg_entry_price)+'\n';
    m += 'Market Value: '+functions.stringToDollar(position.market_value)+'\n';
    m += 'Cost Basis: '+functions.stringToDollar(position.cost_basis)+'\n';
    m += 'Unrealized Profit/Loss: '+functions.stringToDollar(position.unrealized_pl)+'\n';
    m += 'Unrealized Profit/Loss Pct: '+(Math.round(Number(position.unrealized_plpc)*10000)/100)+'%\n';
    m += 'Current Price: '+functions.stringToDollar(position.current_price)+'\n';
    m += 'Last Day Price: '+functions.stringToDollar(position.lastday_price)+'\n';
    m += 'Change Today: '+(Math.round(Number(position.change_today)*10000)/100)+'%\n';

    msg.channel.send(m);
  }).catch(error => {
    if (error.statusCode ==  404) {
      msg.reply('Position not found.');
    }
  })
}
