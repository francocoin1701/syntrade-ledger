// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {LoanFactory} from "../src/LoanFactory.sol";
import {LoanNFT} from "../src/LoanNFT.sol";

contract DeployScript is Script {
    function run() external {
        // TU DIRECCIÓN REAL (La de casinoElon)
        address deployer = 0xde7DC3389d538641D5Ae6479306a755C66abB342;

        // Le decimos a Foundry explícitamente: "Ejecuta todo esto como casinoElon"
        vm.startBroadcast(deployer);

        // 1. Desplegar el NFT (Asignando a casinoElon como dueño inicial)
        LoanNFT nft = new LoanNFT(deployer);

        // 2. Desplegar la Fábrica (Asignando a casinoElon como dueño inicial)
        LoanFactory factory = new LoanFactory(deployer, address(nft));

        // 3. Transferir la propiedad del NFT a la Fábrica
        // Esto funcionará porque vm.startBroadcast(deployer) asegura que
        // la llamada viene de la dirección correcta.
        nft.transferOwnership(address(factory));

        vm.stopBroadcast();
    }
}