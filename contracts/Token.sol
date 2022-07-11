// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract Token {

    address public owner;
    
    string public name = "AhsenToken";
    string public symbol = "AT";

    uint256 public totalSupply;

    mapping(address => uint) public balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);


    constructor(address owner_ , uint256 totalSupply_) {
        owner = owner_;
        totalSupply = totalSupply_;
        balances[owner_] = totalSupply_; 
    }

    function transfer(address to  , uint256 amount) external {
        require(amount <= balances[msg.sender] , "not enough tokens");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender , to , amount);
    }

    function balanceOf(address account) external view returns (uint){
        return balances[account];
    }
}