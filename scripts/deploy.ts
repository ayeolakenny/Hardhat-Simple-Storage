import { ethers, run, network } from "hardhat";

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed Contract to: ${simpleStorage.address}`);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`current value is: ${currentValue}`);
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`updated value is: ${updatedValue}`);
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      contructorArguments: args,
    });
  } catch (err: any) {
    if (err.message.toLowerCase().includes("already verifies")) {
      console.log("Already verified");
    } else {
      console.log(err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
