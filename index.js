const MongoClient = require('mongodb').MongoClient;
const mongo = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true });
const Discord = require('discord.js');
const discord = new Discord.Client();
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
  keyId: process.env.ALPACA_KEY_ID,
  secretKey: process.env.ALPACA_SECRET_KEY,
  paper: process.env.ALPACA_PAPER == 'true',
});
import settings from './settings.js';
import commands from './commands.js';
import functions from './functions.js';
import dateFns from 'date-fns';

mongo.connect(error => {
  if (error) {
    console.log('Error connecting to mongodb.');
    console.log(error);
    return;
  }

  const db = mongo.db(process.env.MONGO_DB);

  discord.on('ready', () => {
    console.log(`Logged in as ${discord.user.tag}!`);
  });

  discord.on('message', msg => {
    if (msg.channel.type == 'text') {
      if (msg.content.charAt(0) == settings.botPrefix) {
        const msgArray = msg.content.split(' ');
        try {
          commands[msgArray[0].substring(1)](db, discord, alpaca, msg);
        } catch (error) {
          // command does not exist
        }
      }
    }
  });

  discord.login(process.env.DISCORD_TOKEN);

  // timer
  const now = new Date();
  let nextInterval = dateFns.addMinutes(now, settings.intervalMinutes - dateFns.getMinutes(now) % settings.intervalMinutes);
  nextInterval = dateFns.startOfMinute(nextInterval);

  setTimeout(() => {
    functions.reset(db, alpaca, discord);
    setInterval(() => {
      functions.reset(db, alpaca, discord);
    }, 1000 * 60 * 5);
  }, dateFns.differenceInMilliseconds(nextInterval, now));
});
