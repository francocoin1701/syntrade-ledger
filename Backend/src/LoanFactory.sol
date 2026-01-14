// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoanNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanFactory is Ownable {
    LoanNFT public loanNFT;
    uint256 public loanCounter;

    enum HealthStatus { Green, Yellow, Red }

    struct DebtRecord {
        address debtor;
        HealthStatus status;
        // La "Huella Digital" del documento legal que invalida el papel físico
        // y transfiere los derechos de cobro a este NFT.
        bytes32 legalHash; 
    }

    mapping(uint256 => DebtRecord) public debtRecords;

    event LoanTokenized(
        uint256 indexed loanId,
        address indexed debtor,
        address indexed initialLender,
        bytes32 legalHash // Emitimos esto para auditoría pública
    );
    event HealthStatusUpdated(uint256 indexed loanId, HealthStatus newStatus);

    constructor(
        address initialOwner,
        address _loanNFTAddress
    ) Ownable(initialOwner) {
        loanNFT = LoanNFT(_loanNFTAddress);
    }

    // AHORA pedimos el legalHash como requisito para tokenizar
    function tokenizeLoan(
        address debtor, 
        address initialLender,
        bytes32 _legalHash
    ) public onlyOwner {
        require(_legalHash != bytes32(0), "Legal Hash cannot be empty");

        loanCounter++;
        uint256 newLoanId = loanCounter;

        loanNFT.safeMint(initialLender, newLoanId);

        debtRecords[newLoanId] = DebtRecord({
            debtor: debtor,
            status: HealthStatus.Green,
            legalHash: _legalHash
        });

        emit LoanTokenized(newLoanId, debtor, initialLender, _legalHash);
    }

    function updateHealthStatus(uint256 loanId, HealthStatus newStatus) public onlyOwner {
        require(debtRecords[loanId].debtor != address(0), "Loan does not exist");
        debtRecords[loanId].status = newStatus;
        emit HealthStatusUpdated(loanId, newStatus);
    }
}