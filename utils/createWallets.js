const { Wallet } = require('ethers')
fs = require('fs')

function createWwallet() {
    const wallet = new Wallet.createRandom()
    return wallet
}

function main() {
    console.log("creating wallets")
    const wallets = []
    const numWallets = 1
    const name = 'courseWallet'

    for (i = 0; i < numWallets; i++) {
        var wallet = createWwallet()
        wallets.push({
            key: wallet.privateKey.substring(2, wallet.privateKey.length),
            addr: wallet.address,
            index: i
        })
    }

    const saveJson = JSON.stringify(wallets, null, 4)
    fs.writeFile(`./${name}.json`, saveJson, 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
    console.log("done creating wallets")
}
main()

