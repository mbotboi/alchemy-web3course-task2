const hre = require('hardhat')
const ethers = hre.ethers

const provider = ethers.provider
const deployedAddr = require('./deployedAddresses.json').BuyMeACoffeeUpgraded
async function main() {
    const [signer] = await ethers.getSigners()
    console.log('deployer address', await signer.getAddress())

    const BuyMeACoffee = await ethers.getContractFactory('BuyMeACoffeeUpgraded')
    const buyMeACoffee = BuyMeACoffee.attach(deployedAddr)

    //initial balance
    const ib = await provider.getBalance(signer.address)
    console.log('balance before withdrawal:', Number(ethers.utils.formatEther(ib)))
    //contract balance                      
    const cb = await provider.getBalance(deployedAddr)
    console.log('inital contract balance:', Number(ethers.utils.formatEther(cb)))

    // Withdraw funds if there are funds to withdraw.
    if (Number(ethers.utils.formatEther(cb) != 0)) {
        console.log("withdrawing funds..")
        const withdrawTxn = await buyMeACoffee.withdrawTips()
        await withdrawTxn.wait();
    } else {
        console.log("no funds to withdraw!");
    }

    //end balance
    const eb = await provider.getBalance(signer.address)
    console.log('balance before withdrawal:', Number(ethers.utils.formatEther(eb)))
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });