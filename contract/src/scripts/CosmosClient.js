import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { coins } from '@cosmjs/amino';
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export class CosmosClient {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.address = null;
        this.connected = false;
    }

    async connectToTestnet(mnemonic = null) {
        try {
            console.log('🌐 Connecting to Cosmos testnet...');

            if (!mnemonic) {
                this.wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "cosmos" });
                console.log("🔑 Generated new mnemonic (SAVE THIS!):", this.wallet.mnemonic);
            } else {
                this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
            }

            const accounts = await this.wallet.getAccounts();
            this.address = accounts[0].address;
            console.log("📬 Cosmos wallet address:", this.address);

            // Connect to Cosmos testnet
            const rpcEndpoint = process.env.RPC_TESTNET;
            this.client = await SigningStargateClient.connectWithSigner(rpcEndpoint, this.wallet);
            this.connected = true;

            console.log("✅ Successfully connected to Cosmos testnet");

            return {
                success: true,
                address: this.address,
                mnemonic: mnemonic ? null : this.wallet.mnemonic
            };
        } catch (error) {
            console.error("❌ Connection failed:", error.message);
            return { success: false, error: error.message };
        }
    }

    async getBalance(address = null) {
        try {
            if (!this.connected) {
                throw new Error("Not connected to Cosmos network");
            }

            const targetAddress = address || this.address;
            const balances = await this.client.getAllBalances(targetAddress);

            console.log(`💰 Balance for ${targetAddress.substring(0, 10)}...:`, balances);

            return {
                success: true,
                address: targetAddress,
                balances
            };
        } catch (error) {
            console.error("❌ Failed to get balance:", error.message);
            return { success: false, error: error.message };
        }
    }

    async sendTokens(recipientAddress, amount, denom = "uatom", memo = "") {
        try {
            if (!this.connected) {
                throw new Error("Not connected to Cosmos network");
            }

            const sendAmount = coins(amount, denom);
            const fee = {
                amount: coins(5000, "uatom"),
                gas: "200000",
            };

            console.log(`💸 Sending ${amount}${denom} to ${recipientAddress.substring(0, 10)}...`);

            const result = await this.client.sendTokens(
                this.address,
                recipientAddress,
                sendAmount,
                fee,
                memo
            );

            console.log("✅ Transaction successful! Hash:", result.transactionHash);

            return {
                success: true,
                transactionHash: result.transactionHash,
                height: result.height
            };
        } catch (error) {
            console.error("❌ Failed to send tokens:", error.message);
            return { success: false, error: error.message };
        }
    }

    async getNetworkStatus() {
        try {
            const readOnlyClient = await StargateClient.connect(process.env.RPC_TESTNET);

            // console.log(readOnlyClient)
            const height = await readOnlyClient?.getHeight();
            const chainId = await readOnlyClient?.getChainId();
            // const nodeInfo = await readOnlyClient?.cometClient?.nodeInfo();
            const status = await readOnlyClient.cometClient.status();
            const node = status.node_info;

            return {
                success: true,
                chainId,
                height,
                // node: nodeInfo?.node_info?.network || 'unknown'
                node
            };
        } catch (error) {
            console.error("❌ Failed to get network status:", error.message);
            return { success: false, error: error.message };
        }
    }

    disconnect() {
        this.client = null;
        this.wallet = null;
        this.address = null;
        this.connected = false;
        console.log('🔌 Disconnected from Cosmos network');
    }
}