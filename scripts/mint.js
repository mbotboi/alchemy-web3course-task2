const hre = require('hardhat')
const ethers = hre.ethers

const deployedAddr = '0xb7c7Eac4B0D4710bb92cD034693dd6Bc3bBF679a'
const CID = "ipfs://bafkreibstuv64ifq7o6hyzfv2rwr3qiib3w67p4dyb3pqwoxorfetmisme"
let contract;
let signer;

async function main() {
    const [signer1] = await ethers.getSigners()
    signer = signer1
    const Contract = await ethers.getContractFactory("MBNFT", { signer: signer })
    contract = Contract.attach(deployedAddr)
    const signerAddr = await signer.getAddress()
    console.log(signerAddr)
    console.log(await signer.provider.getBlockNumber())
    console.log('minting')
    const tx = await contract.safeMint(signerAddr, `ipfs://${CID}`,
        {
            maxFeePerGas: ethers.utils.parseUnits('17', 'gwei')
        })
    console.log(tx)
    await tx.wait()
    console.log('done minting')
    console.log('hash:', tx.hash)
}

main()