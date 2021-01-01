pragma solidity >=0.4.8 <0.8.0;


import "./YaiToken.sol";
import "./YCoinToken.sol";

/**
 * The YogiFarm contract does this and that...
 */
contract YogiFarm {

	string public name = "YCoinToken Farm";

	YaiToken public yaiToken;
	YCoinToken public ycoinToken;

	address  public owner = msg.sender;

	mapping (address => uint) public stakingBalance;
	mapping (address => bool) public hasStaked;
	mapping (address => bool) public isStaking;

	address[] public stakers;
	
	


  constructor(YCoinToken _ycoinToken, YaiToken _yaiToken) public {
    	
    	yaiToken = _yaiToken;
    	ycoinToken = _ycoinToken;
  }


  // !.  Stake Token
  function stakeTokens(uint _amount) public{


  	require (_amount > 0 , 'Amount cannot be 0!');
  	
  		// Transfer Yai Tokens to this  contract for staking
		yaiToken.transferFrom(msg.sender, address(this), _amount) ;

  		// Update staking balance
		stakingBalance[msg.sender] += _amount;


  		// Add stakers to the stakers array *ONLY* if they haven't staked already
  		if (!hasStaked[msg.sender]) {
  			stakers.push(msg.sender);
  		}

  		hasStaked[msg.sender] = true;
  		isStaking[msg.sender] = true;
  }
  // 2.  Issuing Tokens

  function issueTokens ()  public {
  	//Only owner calls the function

  	require (msg.sender == owner , "Caller must be the owner");
  	

  	for (uint i=0; i<stakers.length; i++){

  		address recipient = stakers[i];
  		uint balance = stakingBalance[recipient];

  		if(balance > 0){

  			ycoinToken.transfer(recipient,balance);
  		}
  	}
  	
  }
  
  
  // 3.  Unstaking Tokens
  function unstakeTokens() public {

  	uint balance = stakingBalance[msg.sender];
  	require (balance > 0, 'There should be balance');

  	yaiToken.transfer(msg.sender, balance);

  	stakingBalance[msg.sender] =0;
  	isStaking[msg.sender] = false;


  	

  }


  
}


