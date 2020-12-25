pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./EDTxToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DaiToken public daiToken;
    EDTxToken public eDTxToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DaiToken _daiToken, EDTxToken _eDTxToken) public {
        daiToken = _daiToken;
        eDTxToken = _eDTxToken;
    }

    // 1. Stakes Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "Amount cannot be 0");
        //transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        
        // Add user to stakers array only if they haven't staked
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        } 
        // update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2. Issuing Tokens (Interest earned)
    function issueToken() public {
        require(msg.sender == owner, "Caller must be Owner");
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] * 40;
            if(balance > 0) {
                eDTxToken.transfer(recipient, balance);
            }
        }
    }

    // 3. Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // fetch balance
        uint balance = stakingBalance[msg.sender];
        // Require amount to be greater than 0
        require(balance > 0, "Staking balance cannot be 0");
        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);
        // Reset staking balance
        stakingBalance[msg.sender] = 0;
        // update staking status
        isStaking[msg.sender] = false;
    }
}