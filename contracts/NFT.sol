// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721URIStorage, Ownable {
    uint256 public constant MAX_NFT_SUPPLY = 10;
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_PER_WALLET = 2;
    uint256 private _tokenIds;
    string private _baseTokenURI;

    mapping(address => uint256) public walletMints;

    constructor(string memory baseURI, address initialOwner) ERC721("PuffleNFT", "PUFFLE") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
    }

    function mintNFT(string memory tokenURI) external payable {
        require(_tokenIds < MAX_NFT_SUPPLY, "All NFTs have been minted");
        require(msg.value == MINT_PRICE, "Incorrect mint price");
        require(walletMints[msg.sender] < MAX_PER_WALLET, "Max NFTs per wallet reached");

        walletMints[msg.sender]++;
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
