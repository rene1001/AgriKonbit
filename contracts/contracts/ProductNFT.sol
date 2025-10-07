// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("AgriKonbit Product", "AKP") Ownable(msg.sender) {}

    function mintProduct(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
