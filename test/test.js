const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VulnerableContract", function () {
  let deployer,
    user,
    attacker,
    vulnerableContract,
    VulnerableContract,
    attackContract,
    AttackContract;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();
    VulnerableContract = await ethers.getContractFactory("VulnerableContract");
    AttackContract = await ethers.getContractFactory(
      "AttackContract",
      attacker
    );
    vulnerableContract = await upgrades.deployProxy(VulnerableContract, [
      deployer.address,
    ]);
    attackContract = await AttackContract.deploy(
      vulnerableContract.getAddress()
    );
  });

  describe("Initialization", function () {
    it("Should set the right owner", async function () {
      expect(await vulnerableContract.owner()).to.equal(deployer.address);
      expect(await attackContract.owner()).to.equal(attacker.address);
    });
  });

  describe("Deposit Functionality", function () {
    it("Should allow the user to deposit funds", async function () {
      await vulnerableContract
        .connect(user)
        .deposit({ value: ethers.parseEther("100") });
      const balance = await vulnerableContract.balanceOf(user.address);
      expect(balance).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Withdraw Functionality", function () {
    it("should withdraw funds", async function () {
      await vulnerableContract
        .connect(user)
        .deposit({ value: ethers.parseEther("100") });
      await vulnerableContract.connect(user).withdraw();
      const balance = await vulnerableContract.balanceOf(user.address);
      expect(balance).to.equal(0);
    });
  });

  describe("Pause and Unpause Functionality", function () {
    it("Should allow the owner to pause and unpause the contract", async function () {
      await vulnerableContract.connect(deployer).pause();
      await expect(
        vulnerableContract
          .connect(user)
          .deposit({ value: ethers.parseEther("100") })
      ).to.be.reverted;
      await vulnerableContract.connect(deployer).unpause();
      await vulnerableContract
        .connect(user)
        .deposit({ value: ethers.parseEther("100") });
    });
  });

  describe("Attack Functionality", function () {
    it("Should allow the attacker to attack the contract", async function () {
      await vulnerableContract
        .connect(attacker)
        .deposit({ value: ethers.parseEther("3") });
      await attackContract
        .connect(attacker)
        .attack({ value: ethers.parseEther("1.6") });
      expect(
        await ethers.provider.getBalance(vulnerableContract.getAddress())
      ).to.eq(ethers.parseEther("0"));
    });
  });
});
