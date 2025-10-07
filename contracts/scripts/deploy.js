const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  const GYT = await hre.ethers.getContractFactory('GYTToken');
  const gyt = await GYT.deploy();
  await gyt.waitForDeployment();
  console.log('GYT deployed to:', await gyt.getAddress());

  const NFT = await hre.ethers.getContractFactory('ProductNFT');
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log('ProductNFT deployed to:', await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
