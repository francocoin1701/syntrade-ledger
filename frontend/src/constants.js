// ==========================================
// DIRECCIONES DE CONTRATOS (SEPOLIA)
// ==========================================

// Estas son las que ya tenías funcionando:
export const FACTORY_ADDRESS = "0xce766A0886c1Db5aDefDE8F6655DAD3B97f8Ba1a";
export const NFT_ADDRESS = "0x124Fb3952F5c99BDB89195F7e6bD7411FA3e7aE3";

// ¡¡¡AQUÍ FALTA LA NUEVA!!! 
// Pega la dirección que obtuviste al desplegar DeployMarket.s.sol
export const MARKETPLACE_ADDRESS = "0xf156d980ba055b5339c9beeb3625d3f2ca4f4b32"; 


// ==========================================
// ABIS (INTERFACES)
// ==========================================

// 1. ABI DEL FACTORY
export const FACTORY_ABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "initialOwner", "type": "address", "internalType": "address" },
      { "name": "_loanNFTAddress", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "debtRecords",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "debtor", "type": "address", "internalType": "address" },
      { "name": "status", "type": "uint8", "internalType": "enum LoanFactory.HealthStatus" },
      { "name": "legalHash", "type": "bytes32", "internalType": "bytes32" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "loanCounter",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "loanNFT",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "contract LoanNFT" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenizeLoan",
    "inputs": [
      { "name": "debtor", "type": "address", "internalType": "address" },
      { "name": "initialLender", "type": "address", "internalType": "address" },
      { "name": "_legalHash", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateHealthStatus",
    "inputs": [
      { "name": "loanId", "type": "uint256", "internalType": "uint256" },
      { "name": "newStatus", "type": "uint8", "internalType": "enum LoanFactory.HealthStatus" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "LoanTokenized",
    "inputs": [
      { "name": "loanId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "debtor", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "initialLender", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "legalHash", "type": "bytes32", "indexed": false, "internalType": "bytes32" }
    ],
    "anonymous": false
  }
];

// 2. ABI DEL NFT
export const NFT_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      { "name": "from", "type": "address", "internalType": "address" },
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];

// 3. ABI DEL MARKETPLACE (¡Esto es lo que faltaba!)
export const MARKETPLACE_ABI = [
  {
    "type": "function",
    "name": "listLoan",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
      { "name": "price", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyLoan",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "listings",
    "inputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "price", "type": "uint256", "internalType": "uint256" },
      { "name": "seller", "type": "address", "internalType": "address" },
      { "name": "active", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cancelListing",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];