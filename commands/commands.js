import functions from '../functions.js';


export default function commands(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  let m = '';
  m += '**$about** - About the bot.\n';
  m += '**$market** - Is market open?\n';
  m += '**$account** - Portfolio value and cash available.\n';
  m += '**$positions** - See all held positions.\n';
  m += '**$position <symbol>** - Info on a position.\n';
  m += '**$buy <symbol>** - Add vote to buy stock.\n';
  m += '**$sell <symbol>** - Add vote to sell stock.\n';
  m += '**$votes** - See votes placed.\n';
  m += '**$setChannel <channel name>** - Set channel for bot to report in.  Can only be used by guild owner.\n';
  m += '\n';
  m += '**<symbol>** can be **<symbol>** or **<symbol>:<exchange>** or **<symbol>:<exchange>:<asset class>**.  Symbols are case-sensitive.\n';
  msg.channel.send(m);
}
