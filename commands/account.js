import functions from '../functions.js';


export default function account(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  alpaca.getAccount().then(account => {

    let m = '';

    if (account.status != 'ACTIVE') {
      m += 'Status: **'+account.status+'**\n';
    }

    m += 'Portfolio Value:  **'+functions.stringToDollar(account.portfolio_value)+'**\n';
    m += 'Cash:  **'+functions.stringToDollar(account.cash)+'**\n';
    m += 'Buying Power:  **'+functions.stringToDollar(account.buying_power)+'**\n';
    msg.channel.send(m);

  }).catch(error => {
    console.log(error);
  })
}
