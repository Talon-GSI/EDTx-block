const { assert } = require('chai');
const DaiToken = artifacts.require("DaiToken");
const EDTxToken = artifacts.require("EDTxToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should();

    function tokens(n) {
        return web3.utils.toWei(n, 'ether');
    }
    
    contract('TokenFarm', ([owner, investor]) => {
        let daiToken, eDTxToken, tokenFarm;
        
        before(async () => {
            //Loading Contracts for test
            daiToken = await DaiToken.new()
            eDTxToken = await EDTxToken.new()
            tokenFarm = await TokenFarm.new(eDTxToken.address, daiToken.address)
            // transfer dapp tokens to Token farm contract; 1 million
            await eDTxToken.transfer(tokenFarm.address, tokens('76000000'))
            await daiToken.transfer(investor, tokens('100'), { from: owner })
        })
    
        describe('Mock Dai deployment', async () => {
            it('has Name', async () => {
                const name = await daiToken.name()
                assert.equal(name, 'Mock DAI Token')
            })
        })
        describe('Dapp deployment', async () => {
            it('has Name', async () => {
                const name = await eDTxToken.name()
                assert.equal(name, 'DApp Token')
            })
        })
        describe('Token Farm deployment', async () => {
            it('has Name', async () => {
                const name = await tokenFarm.name()
                assert.equal(name, 'Dapp Token Farm')
            })
    
            it('Contract has tokens', async () => {
                let balance = await eDTxToken.balanceOf(tokenFarm.address)
                assert.equal(balance.toString(), tokens('76000000'))
            })
        })
    
        describe('Farming tokens', async () => {
            it('rewards investors for staking mock Dai tokens', async () => {
                let result
    
                // check invester balance before staking
                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('100'), 'Investor Mock Dai wallet balance correct before staking')
    
                // Stake Mock Dai Tokens
                await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
                await tokenFarm.stakeTokens(tokens('100'), { from: investor })
    
                // checks staking result
                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('0'), 'Investor Mock Dai wallet balance correct after staking')
    
                result = await daiToken.balanceOf(tokenFarm.address)
                assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')
    
                result = await tokenFarm.stakingBalance(investor)
                assert.equal(result.toString(), tokens('100'), 'Investor staking balance correct after staking')
    
                result = await tokenFarm.isStaking(investor)
                assert.equal(result.toString(), 'true', 'Investor staking status correct after staking')
                
                // Issue Tokens
                await tokenFarm.issueToken({ from: owner });
                result = await eDTxToken.balanceOf(investor);
                assert.equal(result.toString(), tokens('100') * 4, 'Investor DApp Token wallet balance correct after issuance')
    
                // ensure that only owner can issue tokens
                await tokenFarm.issueToken({ from: investor }).should.be.rejected;
    
                // unstake tokens
                await tokenFarm.unStakeTokens({ from: investor})
    
                // check results after unstaking
                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct after staking')
                
                result = await daiToken.balanceOf(tokenFarm.address)
                assert.equal(result.toString(), tokens('0'), 'investor Mock Dai wallet balance correct after staking')
                
                result = await tokenFarm.stakingBalance(investor)
                assert.equal(result.toString(), tokens('0'), 'investor Mock Dai wallet balance correct after staking')
                
                result = await tokenFarm.isStaking(investor)
                assert.equal(result.toString(), 'false', 'investor Mock Dai wallet balance correct after staking')
            })
        })
    })