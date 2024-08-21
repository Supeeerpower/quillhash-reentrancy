// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VulnerableContract is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable
{
    mapping(address => uint256) public balanceOf;
    uint256 private count;

    event Reentrancy(address indexed user, uint256 entry);

    function initialize(address _owner) public initializer {
        // __Ownable_init(msg.sender);
        require(_owner != address(0), "Invaild Owner");
        _transferOwnership(_owner);
        __Pausable_init();
    }

    function deposit() external payable whenNotPaused {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external whenNotPaused {
        uint256 depositedAmount = balanceOf[msg.sender];
        emit Reentrancy(msg.sender, ++count);
        (bool sent, ) = payable(msg.sender).call{value: depositedAmount}("");
        require(sent, "withdraw failed");
        balanceOf[msg.sender] = 0;
        count = 0;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
