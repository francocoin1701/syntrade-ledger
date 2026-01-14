// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Script} from "forge-std/Script.sol";
import {LoanMarketplace} from "../src/LoanMarketPlace.sol";

contract DeployMarket is Script {
    function run() external {
        // TU DIRECCIÓN REAL DE SEPOLIA
        address deployer = 0xde7DC3389d538641D5Ae6479306a755C66abB342;
        
        // ¡¡¡IMPORTANTE!!! PEGA AQUÍ LA DIRECCIÓN DE TU NFT CONTRACT DE CONSTANTS.JS
        address nftAddress = 0x124Fb3952F5c99BDB89195F7e6bD7411FA3e7aE3; 

        vm.startBroadcast(deployer);
        new LoanMarketplace(nftAddress);
        vm.stopBroadcast();
    }
}