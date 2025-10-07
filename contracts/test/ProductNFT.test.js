const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ProductNFT', function () {
  it('mints with URI', async function () {
    const [owner, user] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory('ProductNFT');
    const nft = await NFT.deploy();

    const tx = await nft.mintProduct(user.address, 'ipfs://QmHash/metadata.json');
    await tx.wait();

    expect(await nft.ownerOf(1)).to.equal(user.address);
    expect(await nft.tokenURI(1)).to.equal('ipfs://QmHash/metadata.json');
  });
});
