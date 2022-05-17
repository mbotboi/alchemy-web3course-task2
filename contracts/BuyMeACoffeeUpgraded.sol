//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract BuyMeACoffeeUpgraded {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    //marked payable so can withdraw to this addr
    address payable owner;

    //a list of all memos received
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */

    function buyAnyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee for free!");
        //add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, msg.value));

        emit NewMemo(msg.sender, block.timestamp, _name, _message, msg.value);
    }

    function buySmallCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(
            msg.value >= (15 * 10**18) / 10000,
            "can't buy a small coffee with less!"
        );
        //add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, msg.value));

        emit NewMemo(msg.sender, block.timestamp, _name, _message, msg.value);
    }

    function buyLargeCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value >= (3 * 10**18) / 1000, "can't buy large coffee with less!");
        //add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, msg.value));

        emit NewMemo(msg.sender, block.timestamp, _name, _message, msg.value);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
