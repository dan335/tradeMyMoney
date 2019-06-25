// map command to function

import about from './commands/about.js';
import account from './commands/account.js';
import cmds from './commands/commands.js';
import market from './commands/market.js';
import order from './commands/order.js';
import position from './commands/position.js';
import positions from './commands/positions.js';
import setChannel from './commands/setChannel.js';
import votes from './commands/votes.js';

const commands = {
  about: function(db, discord, alpaca, msg) {
    try {
      about(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  account: function(db, discord, alpaca, msg) {
    try {
      account(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  commands: function(db, discord, alpaca, msg) {
    try {
      cmds(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  market: function(db, discord, alpaca, msg) {
    try {
      market(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  buy: function(db, discord, alpaca, msg) {
    try {
      order(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  sell: function(db, discord, alpaca, msg) {
    try {
      order(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  position: function(db, discord, alpaca, msg) {
    try {
      position(db, discord, alpaca, msg);
    } catch (error) {
      console.log(error);
    }
  },

  positions: function(db, discord, alpaca, msg) {
    try {
      positions(db, discord, alpaca, msg);
    } catch (error) {
      positions.log(error);
    }
  },

  setChannel: function(db, discord, alpaca, msg) {
    try {
      setChannel(db, discord, alpaca, msg);
    } catch (error) {
      setChannel.log(error);
    }
  },

  votes: function(db, discord, alpaca, msg) {
    try {
      votes(db, discord, alpaca, msg);
    } catch (error) {
      setChannel.log(error);
    }
  },
}


export default commands
