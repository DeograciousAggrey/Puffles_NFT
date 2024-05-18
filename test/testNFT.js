const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMinter", function () {
    let NFTMinter, nftMinter, owner, addr1, addr2;
    

    const baseURI = "ipfs://QmQ1VX4UqoKFUmp5GpaUXeeprQoWCkhpU7DmixGiFmpBy2";

    beforeEach(async function () {
        NFTMinter = await ethers.getContractFactory("NFTMinter");
        
        [owner, addr1, addr2,addr3,addr4,addr5,addr6, _] = await ethers.getSigners();
        nftMinter = await NFTMinter.deploy(baseURI, owner.address);
        await nftMinter.deployed();
    });

    it("Should set the correct owner", async function () {
        expect(await nftMinter.owner()).to.equal(owner.address);
    });

    it("Should mint an NFT successfully", async function () {
        const tokenURI = "metadata/1";
        await nftMinter.connect(addr1).mintNFT(tokenURI, { value: ethers.utils.parseEther("0.01") });
        
        expect(await nftMinter.balanceOf(addr1.address)).to.equal(1);
        expect(await nftMinter.walletMints(addr1.address)).to.equal(1);
        expect(await nftMinter.tokenURI(1)).to.equal(baseURI + tokenURI);
    });

    // it("Should not mint if supply is exceeded", async function () {
    //     for (let i = 0; i < 10; i++) {
    //         await nftMinter.connect(addr1).mintNFT(`metadata/${i}`, { value: ethers.utils.parseEther("0.01") });
    //     }

    //     await expect(
    //         nftMinter.connect(addr2).mintNFT("metadata/11", { value: ethers.utils.parseEther("0.01") })
    //     ).to.be.revertedWith("All NFTs have been minted");
    // });


    it("Should not mint if supply is exceeded", async function () {
        const addressArray = [addr1, addr2, addr3, addr4, addr5];
        const nftsperWallet = 2;
        const totalNFTs = 10;

        // Mint NFTs for each address
        for (const address of addressArray) {
            for (let i = 0; i < nftsperWallet; i++) {
                await nftMinter.connect(address).mintNFT(`metadata/${i}`, { value: ethers.utils.parseEther("0.01") });
            }
        }

        await expect(
            nftMinter.connect(addr6).mintNFT("metadata/11", { value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith("All NFTs have been minted");

    });












    it("Should not mint if incorrect price is sent", async function () {
        const tokenURI = "metadata/2";
        await expect(
            nftMinter.connect(addr1).mintNFT(tokenURI, { value: ethers.utils.parseEther("0.005") })
        ).to.be.revertedWith("Incorrect mint price");
    });

    it("Should not mint more than the max per wallet", async function () {
        const tokenURI1 = "metadata/3";
        const tokenURI2 = "metadata/4";

        await nftMinter.connect(addr1).mintNFT(tokenURI1, { value: ethers.utils.parseEther("0.01") });
        await nftMinter.connect(addr1).mintNFT(tokenURI2, { value: ethers.utils.parseEther("0.01") });

        await expect(
            nftMinter.connect(addr1).mintNFT("metadata/5", { value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith("Max NFTs per wallet reached");
    });

    it("Should allow the owner to set a new base URI", async function () {
        const newBaseURI = "ipfs://newBaseURI/";
        await nftMinter.connect(owner).setBaseURI(newBaseURI);
    
        // Mint an NFT to have a token ID to test the base URI
        await nftMinter.connect(addr1).mintNFT("metadata/1", { value: ethers.utils.parseEther("0.01") });
        const tokenId = 1;
    
        // Retrieve the token URI and verify that it includes the new base URI
        const tokenURI = await nftMinter.tokenURI(tokenId);
        const expectedTokenURI = newBaseURI + "metadata/1"; // Adjust as per your metadata URI structure
    
        expect(tokenURI).to.equal(expectedTokenURI);
    });
    
    it("Should allow the owner to withdraw funds", async function () {
        await nftMinter.connect(addr1).mintNFT("metadata/6", { value: ethers.utils.parseEther("0.01") });
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        const tx = await nftMinter.connect(owner).withdraw();
        const receipt = await tx.wait();

        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(ethers.utils.parseEther("0.01")).sub(gasUsed));
    });

    
    
    
    
    
});
