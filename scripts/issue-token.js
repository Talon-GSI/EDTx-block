const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueToken();
  
  console.log("Tokens issued! - I am the Man!");
  callback();
  // This function can be run using: truffle exec scripts/issue-token.js
};
