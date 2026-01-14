// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract LoanNFT is ERC721, Ownable {
    constructor(
        address initialOwner
    ) ERC721("SynTrade Loan Bond", "SLB") Ownable(initialOwner) {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}