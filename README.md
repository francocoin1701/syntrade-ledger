# SynTrade Ledger: Loan Markets Reimagined

**A submission for the LMA EDGE Hackathon**

> **Tagline:** Unlocking Trillions: Loan Settlement from Weeks to Seconds.

---

## 💡 About the Project

### Inspiration
The core motivation behind SynTrade Ledger is to address the crippling **illiquidity** and **inefficiency** inherent in the multi-trillion dollar loan market. By leveraging decentralized ledger technology, we reimagine how loans are documented, traded, and serviced, directly supporting the LMA's mission to enhance market liquidity.

### What it does
SynTrade Ledger tokenizes corporate loans, transforming them into liquid, verifiable digital assets. It separates the **debt obligation** from the **tradable financial instrument** to enable instant secondary market trading while maintaining rigorous risk oversight.

**Key Features:**
*   **Dual Tokenization:** Creates a tradable **NFT (Loan Bond)** and an immutable **SBT (Debt Record)** for risk tracking.
*   **Legal Binding:** Links the on-chain asset to the off-chain agreement via a cryptographic hash (`legalHash`).
*   **Transparent Secondary Market:** Allows owners to list their assets for **Fixed-Price Sales** and potential buyers to **Place Offers**.
*   **Privacy by Design:** Asset value is **censored (blurred)** for non-owners on the marketplace, while risk scores (Health Status) remain transparent.
*   **Active Servicing Simulation:** The owner can initiate a "Claim Interest" function, simulating the actual collection of payments.

### How we built it
The project is built on a full-stack Web3 architecture:
*   **Smart Contracts (Solidity & Foundry):** The core logic resides in three contracts: `LoanNFT`, `LoanFactory` (for minting and tracking ownership/health), and `LoanMarketplace` (for listing and buying/selling).
*   **Frontend (React & Vite):** A modern desktop-style prototype built with React and styled using **Tailwind CSS**.
*   **Web3 Integration:** **Wagmi/Viem** provides the connection layer to interact with the deployed contracts on the **Sepolia Testnet** via the **Alchemy** RPC endpoint.

### Challenges we ran into
1.  **Version Conflicts:** Resolving dependency mismatches between modern React, Wagmi v2, and RainbowKit required manually pinning dependency versions in `package.json`.
2.  **Asynchronous Trading Flow:** Implementing the secure two-step market listing (`Approve` then `List`) required careful state management (`useWaitForTransactionReceipt`) to ensure sequential execution.
3.  **Access Control Logic:** Initially, the **`tokenizeLoan`** function was too open. We restricted it to the **Factory Owner only** (your wallet) to simulate a centralized control body for asset issuance, a deliberate design choice for the demo.

### Accomplishments that we're proud of
We are proud of successfully linking the *physical* concept of a legal agreement hash to the on-chain NFT, and creating the **dual-view card system** that correctly enforces privacy rules based on ownership status.

### What's next for SynTrade Ledger
The next phase involves: (1) Building the **off-chain oracle** to automatically update the **Health Status** based on real data feeds, and (2) Finalizing the **Auction/Bidding** mechanism on the Marketplace contract.

---

## 🛠️ Built with

*   **Languages/Contracts:** Solidity
*   **Development Tools:** Foundry, Vite
*   **Frontend:** React, Tailwind CSS, Lucide React
*   **Web3 Stack:** Wagmi, Viem, RainbowKit
*   **Blockchain/Infra:** Ethereum Sepolia Testnet, Alchemy RPC

---

## 🚀 How to Run Locally (For Judges)

To run the full application locally (requires a separate local Anvil chain):

1.  **Setup Backend (Solidity/Foundry):**
    ```bash
    cd backend
    # Install dependencies and run tests
    forge install
    forge test
    # Deploy to local Anvil chain (must be running in another terminal)
    cast wallet import "YOU WALLET" --rpc-url http://127.0.0.1:8545
    forge script script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast --account "YOU WALLET"
    # Copy resulting Contract Addresses for Frontend config
    ```

2.  **Setup Frontend (React/Node):**
    ```bash
    cd ../frontend
    # Clean install of stable dependencies
    rm -rf node_modules package-lock.json
    npm install 
    # Setup Tailwind (if not done)
    npx tailwindcss init -p
    # Start the dev server
    npm run dev
    ```

3.  **Final Steps:** Update `constants.js` with the new contract addresses and ensure MetaMask is pointing to the correct local chain ID (31337).
