import functions from '../functions.js';
import settings from '../settings.js';


export default function about(db, discord, alpaca, msg) {
  functions.addGuild(db, msg);

  let m = '__Trade My Money Bot__\n';

  m += "Can Discord beat the stock market?  Trade stocks and make me money.  Or lose it.  Please don't lose it all.\n\n";

  m += "Use **"+settings.botPrefix+"buy <symbol>** and **"+settings.botPrefix+"sell <symbol>** to cast a vote on what action the bot should do next.  Every "+settings.intervalMinutes+" minutes the bot will pick the action with the most votes and execute it.  If votes are equal it chooses the oldest one.  Use **"+settings.botPrefix+"account** to see the value of the account and **"+settings.botPrefix+"positions** to see held positions.  Use **"+settings.botPrefix+"commands** to see all of the commands.\n\n";

  m += "Bot source at <https://github.com/dan335/tradeMyMoney>.  It makes trades using Alpaca's API. <https://alpaca.markets>\n\n";

  m += "Oh yeah.  It's probably fake money so don't worry about losing it.  The bot works with real money too but unless some crazy person cloned the bot and deposited their own money it's fake."

  msg.channel.send(m);
}
