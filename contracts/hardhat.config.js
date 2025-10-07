require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const { PRIVATE_KEY, POLYGON_RPC_URL } = process.env;

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    hardhat: {},
    mumbai: {
      url: POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || ''
  }
};
