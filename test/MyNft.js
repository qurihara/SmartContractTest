const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNft", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const MyNft = await ethers.getContractFactory("MyNft");
    const myNft = await MyNft.deploy();
    return { myNft, owner, otherAccount };
  }

  it("Should have correct token name and symbol", async function () {
    const { myNft } = await loadFixture(deployFixture);
    expect(await myNft.name()).to.equal("KuriNFT");
    expect(await myNft.symbol()).to.equal("KNFT");
  });

  it("Should mint a new token correctly", async function () {
    const { myNft, owner, otherAccount } = await loadFixture(deployFixture);
    const tokenId = 1;
    await myNft.connect(owner).safeMint(otherAccount.address, tokenId);
    expect(await myNft.ownerOf(tokenId)).to.equal(otherAccount.address);
  });

  it("Should only allow the owner to mint tokens", async function () {
    const { myNft, otherAccount } = await loadFixture(deployFixture);
  
    const tokenId = 1;
  
    // カスタムエラーが発生することを確認
    await expect(
      myNft.connect(otherAccount).safeMint(otherAccount.address, tokenId)
    ).to.be.revertedWithCustomError(myNft, "OwnableUnauthorizedAccount");
  });
  // it("Should only allow the owner to mint tokens", async function () {
  //   const { myNft, otherAccount } = await loadFixture(deployFixture);
  //   const tokenId = 1;
  //   await expect(myNft.connect(otherAccount).safeMint(otherAccount.address, tokenId)).to.be.revertedWith(
  //     "Ownable: caller is not the owner"
  //   );
  // });

  it("Should correctly set token URI after minting", async function () {
    const { myNft, owner, otherAccount } = await loadFixture(deployFixture);
    const tokenId = 1;
    await myNft.connect(owner).safeMint(otherAccount.address, tokenId);
    const tokenURI = await myNft.tokenURI(tokenId);
    expect(tokenURI).to.equal("https://qurihara.github.io/nft1/md/1");
  });
});
