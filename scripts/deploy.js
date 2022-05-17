const hre = require('hardhat')
const ethers = hre.ethers

const provider = ethers.provider

async function main(){
    const [signer] = await ethers.getSigners()
    console.log('deployer address', await signer.getAddress())

    const BuyMeACoffee = await ethers.getContractFactory('BuyMeACoffeeUpgraded')
    const buyMeACoffee = await BuyMeACoffee.deploy({
        maxFeePerGas: ethers.utils.parseUnits('5', 'gwei')
    })
    await buyMeACoffee.deployed()    

    console.log('contract address:', buyMeACoffee.address)
}

main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });