// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMinter is ERC721URIStorage {
    uint256 public constant MAX_NFT_SUPPLY = 10;
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_PER_WALLET = 2;
    uint256 private _tokenIds;
    string private _baseTokenURI;

    mapping (address => uint256) public walletmints;

    constructor(string memory baseURI) ERC721("PuffleNFT", "PUFFLE") {
        _baseTokenURI = baseURI;
    }

    function mintNFT(string memory tokenURI) external payabale {
        require(_tokenIds < MAX_NFT_SUPPLY, "All NFTs have been minted");
        require(msg.value == MINT_PRICE, "Incorrect mint price");
        require(walletmints[msg.sender] < MAX_PER_WALLET, "Max NFT per wallet reached");

        walletmints[msg.sender] ++;
        _tokenIds ++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
    }





}