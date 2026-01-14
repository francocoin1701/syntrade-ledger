// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LoanMarketplace is ReentrancyGuard {
    
    struct Listing {
        uint256 price;
        address seller;
        bool active;
    }

    // Mapeo de TokenID -> Datos de la venta
    mapping(uint256 => Listing) public listings;
    
    IERC721 public nftContract;

    event ItemListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemBought(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ItemCanceled(uint256 indexed tokenId, address indexed seller);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    // 1. Poner en venta (Listar)
    function listLoan(uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        // El usuario debe ser el dueño
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        // El usuario debe haber aprobado al mercado (Esto se hace en el Frontend)
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) || 
            nftContract.getApproved(tokenId) == address(this), 
            "Marketplace not approved"
        );

        listings[tokenId] = Listing(price, msg.sender, true);
        emit ItemListed(tokenId, msg.sender, price);
    }

    // 2. Comprar
    function buyLoan(uint256 tokenId) external payable nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.active, "Item not for sale");
        require(msg.value >= item.price, "Insufficient ETH sent");

        // Borrar del mercado antes de transferir (seguridad)
        delete listings[tokenId];

        // Pagar al vendedor
        payable(item.seller).transfer(item.price);

        // Transferir NFT al comprador
        nftContract.safeTransferFrom(item.seller, msg.sender, tokenId);

        emit ItemBought(tokenId, msg.sender, item.price);
    }

    // 3. Cancelar venta
    function cancelListing(uint256 tokenId) external {
        Listing memory item = listings[tokenId];
        require(item.seller == msg.sender, "Not the seller");
        delete listings[tokenId];
        emit ItemCanceled(tokenId, msg.sender);
    }
}