const DaiToken = artifacts.require("DaiToken");
const EDTxToken = artifacts.require("EDTxToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, networks, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(EDTxToken);
  const eDTxToken = await EDTxToken.deployed();

  await deployer.deploy(TokenFarm, daiToken.address, eDTxToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await eDTxToken.transfer(tokenFarm.address, '48000000000000000000000000'); // edtx token transferring 48mil$$ to tokenFarm

  // Won't need in Production
  await daiToken.transfer('0x4D38D01Fd5576bf3cf3493f412CfA6f13ba2f128', '5000000000000000000000'); // transferring 500k Dai to invest
};
