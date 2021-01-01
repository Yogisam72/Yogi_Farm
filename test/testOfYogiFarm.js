const YaiToken = artifacts.require('YaiToken');
const YCoinToken = artifacts.require('YCoinToken');
const YogiFarm = artifacts.require('YogiFarm');

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('yogiFarm', ([owner , investor]) => {

	let yaiToken, ycoinToken, yogiFarm

  before(async () => {
    // Load Contracts
    yaiToken = await YaiToken.new()
    ycoinToken = await YCoinToken.new()
    yogiFarm = await YogiFarm.new(ycoinToken.address, yaiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await ycoinToken.transfer(yogiFarm.address, tokens('1000000'))

    // Send tokens to investor
    await yaiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI (YAI) deployment', async () => {
    it('has a name', async () => {
      const name = await yaiToken.name()
      assert.equal(name, "Yogi's version of DAI")
    })
  })

  describe('YCoin Token deployment', async () => {
    it('has a name', async () => {
      const name = await ycoinToken.name()
      assert.equal(name, 'YCoin Token')
    })
  })

  describe('YCoinToken Farm deployment', async () => {
    it('has a name', async () => {
      const name = await yogiFarm.name()
      assert.equal(name, 'YCoinToken Farm')
    })

    it('Contract has tokens', async () => {
      let balance = await ycoinToken.balanceOf(yogiFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe("Farming tokens", async () => {

  		it('rewards investors for staking YAI tokens', async () =>{

  		let result

  		result = await yaiToken.balanceOf(investor)
  		assert.equal(result.toString(), tokens('100'), 'investor YAI wallet balance correct before staking')

  		// Stake YAI tokens

  		await yaiToken.approve(yogiFarm.address, tokens('100'), {from: investor})
  		await yogiFarm.stakeTokens(tokens('100'),{from: investor})

  		// Check staking result

  		result = await yaiToken.balanceOf(investor)
  		assert.equal(result.toString(), tokens('0'), 'investor YAI wallet balance correct after staking')

  		result = await yaiToken.balanceOf(yogiFarm.address)
  		assert.equal(result.toString(), tokens('100'), 'Yogi Farm YAI balance correct after staking')

  		// Check if staking balance is correct
  		result = await yogiFarm.stakingBalance(investor)
  		assert.equal(result.toString(), tokens('100'), 'Investor Staking balance correct after the staking')

  		result = await yogiFarm.isStaking(investor)
  		assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

  		// Isuue tokens

  		await yogiFarm.issueTokens({from: owner})

  		// Check balances after issuance
  		result = await ycoinToken.balanceOf(investor)
  		assert.equal(result.toString(), tokens('100'), 'Investor YCoinToken balance correct after the issuance')

  		await yogiFarm.issueTokens({ from: investor }).should.be.rejected;

  		//Unstake tokens

  		await yogiFarm.unstakeTokens({ from : investor })

  		// check results after unstaking

  		result = await yaiToken.balanceOf(investor)
  		assert.equal(result.toString(), tokens('100'), 'Investor YAI balance correct after unstaking')

  		result = await yaiToken.balanceOf(yogiFarm.address)
  		assert.equal(result.toString(), tokens('0'), 'Yogi Farm YAI balance correct after unstaking')

  		// Check if staking balance is correct
  		result = await yogiFarm.stakingBalance(investor)
  		assert.equal(result.toString(), tokens('0'), 'Investor Staking balance correct after the unstaking')

  		result = await yogiFarm.isStaking(investor)
  		assert.equal(result.toString(), 'false', 'investor staking status correct after unstaking')

  	})
  	
  })

})