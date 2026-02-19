/**
 * Call rollDice() and monitor randomness callback
 * Usage:
 * npx hardhat run scripts/roll-and-watch.ts --network monadTestnet
 */

import "dotenv/config";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main(): Promise<void> {

    console.log("\n🎲 Rolling Dice...\n");

    const [signer] = await hre.ethers.getSigners();
    console.log("Player:", signer.address);

    // Load deployed address
    const addressPath = path.join(__dirname, "..", "deployed-addresses.json");
    const addresses = JSON.parse(fs.readFileSync(addressPath, "utf-8"));
    const contractAddress = addresses.address;

    const Dice = await hre.ethers.getContractFactory("PythRandomDice");
    const dice = Dice.attach(contractAddress);

    // Get entropy address
    const entropyAddr = await dice.entropy();
    const entropy = await hre.ethers.getContractAt("IEntropyV2", entropyAddr);

    // Get fee
    const fee = await entropy.getFeeV2();
    console.log("Entropy Fee:", fee.toString());

    // Send rollDice
    const tx = await dice.rollDice({ value: fee });
    console.log("Tx sent:", tx.hash);

    const receipt = await tx.wait();

    console.log("\n⏳ Waiting for callback...\n");

    // Listen for DiceRolled event
    dice.on("DiceRolled", (player, result) => {
        console.log("\n🎉 Dice Result Received!");
        console.log("Player:", player);
        console.log("Result:", result.toString());
        process.exit(0);
    });

    // Timeout after 3 minutes
    setTimeout(() => {
        console.log("\n⚠️ Timeout waiting for callback.");
        console.log("Check explorer manually.");
        process.exit(0);
    }, 180000);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
