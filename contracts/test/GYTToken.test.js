const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GYTToken', function () {
  it('mints and burns correctly', async function () {
    const [owner, user] = await ethers.getSigners();
    const GYT = await ethers.getContractFactory('GYTToken');
    const gyt = await GYT.deploy();

    await gyt.mint(user.address, ethers.parseUnits('100', 18));
    expect(await gyt.balanceOf(user.address)).to.equal(ethers.parseUnits('100', 18));

    await gyt.connect(user).burn(ethers.parseUnits('40', 18));
    expect(await gyt.balanceOf(user.address)).to.equal(ethers.parseUnits('60', 18));
  });
});
