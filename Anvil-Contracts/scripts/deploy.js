const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    const IBTToken = await ethers.getContractFactory("IBTToken");

    const token = await IBTToken.deploy(deployer.address);

    const contractAddress = token.target || token.address || "undefined";
    console.log("Contract deploy sa realizat cu succes!" + contractAddress);
}

main().catch((error) => {
    console.error("Handle error during deployment:", error);
    process.exitCode = error.code;
});
