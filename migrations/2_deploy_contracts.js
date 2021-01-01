const YaiToken = artifacts.require('YaiToken');
const YCoinToken = artifacts.require('YCoinToken');
const YogiFarm = artifacts.require('YogiFarm');

module.exports =async function(deployer, network, accounts) {

	await deployer.deploy(YaiToken)
	const yaiToken = await YaiToken.deployed()

	await deployer.deploy(YCoinToken)
	const ycoinToken = await YCoinToken.deployed()

	await deployer.deploy(YogiFarm, ycoinToken.address , yaiToken.address)
	const yogiFarm = await YogiFarm.deployed()


	await ycoinToken.transfer(yogiFarm.address , '100000000')

	await yaiToken.transfer(accounts[1], '10000')

}
