/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-ethers");

const RPCS = require('./utils/rpcs.json').botboi
const KEY = require('./courseWallet.json')[0].key
// const RPCS = 
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: RPCS.rinkeby,
        blockNumber: 10682095//14255839,
      }
    },
    rinkeby: {
      url: RPCS.rinkeby,
      accounts: [KEY]
    },
    goerli: {
      url: RPCS.goerli,
      accounts: [KEY]
    }
  }
};

