const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);


  const baseTokenURI = "ipfs://QmcdzPqCtVVP6Ap3HBf32HhEXMpJwgzneyayGaXc9Z6EKJ";
  const NFTMinter = await hre.ethers.getContractFactory("NFTMinter");
  const contract = await NFTMinter.deploy(baseTokenURI, deployer.address);


  console.log("Contract address:", contract.address);

  // Write the contract address to a file
  const contractAddressPath = path.join(__dirname, '../src/contract-address.json');
  fs.writeFileSync(contractAddressPath, JSON.stringify({ contractAddress: contract.address }));



}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });