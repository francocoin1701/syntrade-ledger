// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {LoanFactory} from "../src/LoanFactory.sol";
import {LoanNFT} from "../src/LoanNFT.sol";

contract LoanFactoryTest is Test {
    LoanFactory public factory;
    LoanNFT public nft;

    address public owner = makeAddr("owner");
    address public lender = makeAddr("lender");
    address public debtor = makeAddr("debtor");
    address public buyer = makeAddr("buyer");

    // Simulamos un hash de un documento PDF legal (SHA-256)
    bytes32 public constant MOCK_LEGAL_HASH = keccak256("Contrato Legal Firmado v1.0");

    function setUp() public {
        vm.startPrank(owner);
        nft = new LoanNFT(owner);
        factory = new LoanFactory(owner, address(nft));
        nft.transferOwnership(address(factory));
        vm.stopPrank();
    }

    function test_TokenizeLoanSuccess() public {
        vm.prank(owner);
        // Ahora pasamos el hash legal al tokenizar
        factory.tokenizeLoan(debtor, lender, MOCK_LEGAL_HASH);
        uint256 loanId = 1;

        assertEq(nft.ownerOf(loanId), lender);
        
        // Leemos todos los datos, incluido el nuevo hash
        (address _debtor, LoanFactory.HealthStatus _status, bytes32 _storedHash) = factory.debtRecords(loanId);
        
        assertEq(_debtor, debtor);
        assertEq(uint(_status), uint(LoanFactory.HealthStatus.Green));
        // Verificamos que el hash guardado sea el mismo que enviamos (Inmutabilidad Legal)
        assertEq(_storedHash, MOCK_LEGAL_HASH);
    }

    function test_CanTransferNFT() public {
        vm.prank(owner);
        factory.tokenizeLoan(debtor, lender, MOCK_LEGAL_HASH);
        uint256 loanId = 1;

        vm.startPrank(lender);
        nft.transferFrom(lender, buyer, loanId);
        vm.stopPrank();

        assertEq(nft.ownerOf(loanId), buyer);
    }

    function test_CanUpdateHealthStatus() public {
        vm.prank(owner);
        factory.tokenizeLoan(debtor, lender, MOCK_LEGAL_HASH);
        uint256 loanId = 1;
        
        vm.prank(owner);
        factory.updateHealthStatus(loanId, LoanFactory.HealthStatus.Yellow);
        
        // Usamos comas para saltar los valores que no necesitamos verificar ahora
        (, LoanFactory.HealthStatus _status, ) = factory.debtRecords(loanId);
        
        assertEq(uint(_status), uint(LoanFactory.HealthStatus.Yellow));
    }

    function test_Fail_TokenizeWithoutLegalHash() public {
        vm.prank(owner);
        // Intentamos tokenizar enviando un hash vacío (bytes32(0))
        vm.expectRevert("Legal Hash cannot be empty");
        factory.tokenizeLoan(debtor, lender, bytes32(0));
    }
}