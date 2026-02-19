/**
 * Deploy Randomness Contract
 */

import "dotenv/config";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { Monad_Testnet_Entropy } from "../constants";
const CONTRACT_NAME = "PythRandomDice"; // change contract name
const ENTROPY_ADDRESS = Monad_Testnet_Entropy;

async function main(): Promise<void> {
    console.log("\n🚀 Deploying", CONTRACT_NAME, "...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");

    if (!ENTROPY_ADDRESS) {
        throw new Error("❌ ENTROPY_ADDRESS missing in .env");
    }

    console.log("📋 Config:");
    console.log("   Entropy Contract:", ENTROPY_ADDRESS);

    // Deploy contract
    console.log("📝 Deploying...");
    const Contract = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const contract = await Contract.deploy(ENTROPY_ADDRESS);

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log("✅ Contract deployed:", contractAddress);

    // Network info
    const network = hre.network.name;
    const chainId = hre.network.config.chainId;

    // Save addresses
    const addresses = {
        contract: CONTRACT_NAME,
        address: contractAddress,
        entropy: ENTROPY_ADDRESS,
        network,
        chainId,
        deployer: deployer.address,
        deployedAt: new Date().toISOString()
    };

    const filePath = path.join(__dirname, "..", "deployed-addresses.json");
    fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

    console.log("\n📁 Saved to:", filePath);

    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(50));
    console.log("Contract:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
