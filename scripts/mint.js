require("@nomicfoundation/hardhat-toolbox");
     const { vars } = require("hardhat/config");
     
     const { ethers} = require("hardhat");
     const contract = require("../artifacts/contracts/MyNft.sol/MyNft.json");
     
     
     const abi = contract.abi;
     
     async function main() {
         const provider = ethers.provider;
         const signer = await provider.getSigner();
       const contractAddress = await vars.get("CONTRACT_ADDRESS");
       if (!contractAddress) {
         throw new Error("CONTRACT_ADDRESS is not set in vars.");
       }
     
       const myNftContract = new ethers.Contract(contractAddress, abi, signer);
     
       try {
         const to = await signer.getAddress();
         const tokenId = 0;
         const nftTxn = await myNftContract.safeMint(to, tokenId);
         await nftTxn.wait();
         console.log(`NFT Minted! Check it out at: https://etherscan.io/tx/${nftTxn.hash}`);
       } catch (error) {
         console.error("Error minting NFT:", error);
         process.exit(1);
       }
     }
     
     main();