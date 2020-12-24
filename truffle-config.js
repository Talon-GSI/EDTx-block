require('babel-register');
require('babel-polyfill');

const hdWalletProvider = require('truffle-hdwallet-provider');
const infuraEndpoint = 'https://ropsten.infura.io/v3/f6a5cd01e59d41198b857cb44cb62e5f';
const mnemonic = '';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: () => hdWalletProvider(mnemonic, infuraEndpoint),
      network_id: 3,
      gas: 4400000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
