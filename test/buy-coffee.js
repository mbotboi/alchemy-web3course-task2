const { expect } = require('chai');
const hre = require('hardhat')
const ethers = hre.ethers
const provider = ethers.provider

let signer, tipper, tipper2, tipper3;
let coffeeContract;

async function printBalances(addresses) {
    var i = 0
    for (const addr of addresses) {
        var bal = await provider.getBalance(addr)
        console.log(`Address ${i} balance: `, Number(ethers.utils.formatUnits(bal, 'ether')))
        i++
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        var amount = memo.amount
        amount = ethers.utils.formatUnits(amount, 'ether')
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}", ${amount}`);
    }
}

beforeEach(async () => {
    [signer, tipper, tipper2, tipper3] = await ethers.getSigners()
    const CoffeeContract = await ethers.getContractFactory("BuyMeACoffeeUpgraded")
    coffeeContract = await CoffeeContract.deploy()
})

describe("coffeeContractTest", async () => {
    it("can receive tips and withdraw contract balance", async () => {
        //check balances
        const addresses = [signer.address, tipper.address, tipper2.address, tipper3.address, coffeeContract.address]
        console.log("== start ==");
        await printBalances(addresses)

        //tip owner
        const tip = { value: ethers.utils.parseEther("1") };
        await coffeeContract.connect(tipper).buyAnyCoffee("Carolina", "You're the best!", tip);
        await coffeeContract.connect(tipper2).buyAnyCoffee("Vitto", "Amazing teacher", tip);
        await coffeeContract.connect(tipper3).buyAnyCoffee("Kay", "I love my Proof of Knowledge", tip);

        console.log("== bought coffee ==");
        await printBalances(addresses);

        // Withdraw.
        await coffeeContract.connect(signer).withdrawTips();

        // Check balances after withdrawal.
        console.log("== withdrawTips ==");
        await printBalances(addresses);

        // Check out the memos.
        console.log("== memos ==");
        const memos = await coffeeContract.getMemos();
        printMemos(memos);
    })

    it("can accept small coffee", async () => {
        //check balances
        const addresses = [signer.address, tipper.address, tipper2.address, tipper3.address, coffeeContract.address]
        console.log("== start ==");
        await printBalances(addresses)

        //tip owner
        const tip = { value: ethers.utils.parseEther("0.0015") };
        await coffeeContract.connect(tipper).buySmallCoffee("Carolina", "You're the best!", tip);
        await coffeeContract.connect(tipper2).buySmallCoffee("Vitto", "Amazing teacher", tip);
        await coffeeContract.connect(tipper3).buySmallCoffee("Kay", "I love my Proof of Knowledge", tip);

        console.log("== bought coffee ==");
        await printBalances(addresses);

        // Withdraw.
        await coffeeContract.connect(signer).withdrawTips();

        // Check balances after withdrawal.
        console.log("== withdrawTips ==");
        await printBalances(addresses);

        // Check out the memos.
        console.log("== memos ==");
        const memos = await coffeeContract.getMemos();
        printMemos(memos);
    })

    it("can accept large coffees", async () => {
        //check balances
        const addresses = [signer.address, tipper.address, tipper2.address, tipper3.address, coffeeContract.address]
        console.log("== start ==");
        await printBalances(addresses)

        //tip owner
        const tip = { value: ethers.utils.parseEther("0.003") };
        console.log(tip)
        await coffeeContract.connect(tipper).buyLargeCoffee("Carolina", "You're the best!", tip);
        await coffeeContract.connect(tipper2).buyLargeCoffee("Vitto", "Amazing teacher", tip);
        await coffeeContract.connect(tipper3).buyLargeCoffee("Kay", "I love my Proof of Knowledge", tip);

        console.log("== bought coffee ==");
        await printBalances(addresses);

        // Withdraw.
        await coffeeContract.connect(signer).withdrawTips();

        // Check balances after withdrawal.
        console.log("== withdrawTips ==");
        await printBalances(addresses);

        // Check out the memos.
        console.log("== memos ==");
        const memos = await coffeeContract.getMemos();
        printMemos(memos);
    })

    it("wont work when value is wrong", async () => {
        //check balances
        const addresses = [signer.address, tipper.address, tipper2.address, tipper3.address]
        console.log("== start ==");
        await printBalances(addresses)

        //tip owner
        const tip = { value: ethers.utils.parseEther("0.001") };
        expect(coffeeContract.connect(tipper).buyLargeCoffee("Carolina", "You're the best!", tip)).to.be.revertedWith("can't buy large coffee with less!")
    })
})
