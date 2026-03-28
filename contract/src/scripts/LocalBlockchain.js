import crypto from 'crypto'
import fs from 'fs'

export class LocalBlockchain {
    constructor() {
        this.blocks = [];
        this.users = new Map();
        this.balances = new Map();
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.difficulty = 4;
        this.transactionHistory = [];

        this.createGenesisBlock();
        this.loadFromFile();
    }

    loadFromFile() {
        try {
            if (fs.existsSync('wallet-data.json')) {
                const data = JSON.parse(fs.readFileSync('wallet-data.json'));
                this.users = new Map(data.users);
                this.balances = new Map(data.balances);
                console.log('✅ Wallet data loaded from file');
            }
        } catch (error) {
            console.log('No existing wallet data found, starting fresh');
        }
    }

    saveToFile() {
        const data = {
            users: Array.from(this.users.entries()),
            balances: Array.from(this.balances.entries())
        };
        fs.writeFileSync('wallet-data.json', JSON.stringify(data, null, 2));
        console.log('💾 Wallet data saved to file');
    }

    createGenesisBlock() {
        const genesisBlock = {
            index: 0,
            timestamp: Date.now(),
            transactions: [],
            previousHash: "0",
            hash: this.calculateHash(0, Date.now(), [], "0", 0),
            nonce: 0
        };
        this.blocks.push(genesisBlock);
        console.log('🌱 Genesis block created');
    }

    calculateHash(index, timestamp, transactions, previousHash, nonce) {
        return crypto
            .createHash('sha256')
            .update(index + timestamp + JSON.stringify(transactions) + previousHash + nonce)
            .digest('hex');
    }

    getLatestBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    createUser(username, publicKey = null) {
        if (this.users.has(username)) {
            throw new Error('Username already exists');
        }

        if (!publicKey) {
            publicKey = crypto.randomBytes(32).toString('hex');
        }

        const address = this.generateAddress(publicKey);
        const privateKey = crypto.createHash('sha256').update(publicKey + Date.now()).digest('hex');

        const user = {
            username,
            address,
            publicKey,
            privateKey: privateKey.substring(0, 16), 
            createdAt: Date.now()
        };

        this.users.set(username, user);

        this.balances.set(address, 1000);

        this.saveToFile();
        console.log(`👤 New user created: ${username} (${address})`);

        return user;
    }

    generateAddress(publicKey) {
        return 'cosmos1' + crypto.createHash('sha256').update(publicKey).digest('hex').substring(0, 38);
    }

    getBalance(address) {
        return this.balances.get(address) || 0;
    }

    createTransaction(fromAddress, toAddress, amount, privateKey = null) {
        const senderBalance = this.getBalance(fromAddress);

        if (senderBalance < amount) {
            throw new Error(`Insufficient balance. You have ${senderBalance} tokens`);
        }

        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }

        let senderUsername = 'Unknown';
        for (let [name, user] of this.users.entries()) {
            if (user.address === fromAddress) {
                senderUsername = name;
                break;
            }
        }

        const transaction = {
            id: crypto.randomUUID(),
            fromAddress,
            toAddress,
            amount: parseFloat(amount),
            timestamp: Date.now(),
            status: 'pending',
            sender: senderUsername
        };

        this.pendingTransactions.push(transaction);
        this.transactionHistory.push({ ...transaction, status: 'pending' });

        console.log(`📝 Transaction created: ${amount} tokens from ${fromAddress.substring(0, 10)}... to ${toAddress.substring(0, 10)}...`);

        return transaction;
    }

    minePendingTransactions(minerAddress) {
        if (this.pendingTransactions.length === 0) {
            throw new Error('No transactions to mine');
        }

        console.log(`⛏️ Mining ${this.pendingTransactions.length} transactions...`);

        const rewardTransaction = {
            id: crypto.randomUUID(),
            fromAddress: null,
            toAddress: minerAddress,
            amount: this.miningReward,
            timestamp: Date.now(),
            status: 'reward'
        };

        const transactionsToMine = [...this.pendingTransactions, rewardTransaction];

        const block = {
            index: this.blocks.length,
            timestamp: Date.now(),
            transactions: transactionsToMine,
            previousHash: this.getLatestBlock().hash,
            nonce: 0
        };

        console.log('🔨 Mining block with PoW...');
        const startTime = Date.now();
        block.hash = this.mineBlock(block);
        const miningTime = (Date.now() - startTime) / 1000;

        for (let transaction of block.transactions) {
            if (transaction.fromAddress) {
                const fromBalance = this.getBalance(transaction.fromAddress);
                this.balances.set(transaction.fromAddress, fromBalance - transaction.amount);
            }

            const toBalance = this.getBalance(transaction.toAddress);
            this.balances.set(transaction.toAddress, toBalance + transaction.amount);

            const txInHistory = this.transactionHistory.find(t => t.id === transaction.id);
            if (txInHistory) txInHistory.status = 'confirmed';
        }

        this.blocks.push(block);
        this.pendingTransactions = [];
        this.saveToFile();

        console.log(`✅ Block mined in ${miningTime} seconds! Hash: ${block.hash.substring(0, 20)}...`);

        return {
            block,
            miningTime,
            transactionsCount: transactionsToMine.length
        };
    }

    mineBlock(block) {
        const target = Array(this.difficulty + 1).join("0");
        let hash = '';

        while (hash.substring(0, this.difficulty) !== target) {
            block.nonce++;
            hash = this.calculateHash(
                block.index,
                block.timestamp,
                block.transactions,
                block.previousHash,
                block.nonce
            );
        }

        return hash;
    }

    getAllUsers() {
        return Array.from(this.users.values()).map(user => ({
            ...user,
            balance: this.getBalance(user.address)
        }));
    }

    getUser(username) {
        const user = this.users.get(username);
        if (user) {
            return {
                ...user,
                balance: this.getBalance(user.address)
            };
        }
        return null;
    }

    getUserByAddress(address) {
        for (let [name, user] of this.users.entries()) {
            // console.log(name, user)
            if (user.address === address) {
                return {
                    ...user,
                    balance: this.getBalance(address)
                };
            }
        }
        return null;
    }

    getChainInfo() {
        return {
            blockHeight: this.blocks.length - 1,
            totalUsers: this.users.size,
            pendingTransactions: this.pendingTransactions.length,
            totalSupply: this.calculateTotalSupply(),
            difficulty: this.difficulty,
            miningReward: this.miningReward,
            latestBlock: this.getLatestBlock()
        };
    }

    calculateTotalSupply() {
        let total = 0;
        for (let balance of this.balances.values()) {
            total += balance;
        }
        return total;
    }

    getTransactionHistory(address = null) {
        if (address) {
            return this.transactionHistory.filter(t =>
                t.fromAddress === address || t.toAddress === address
            );
        }
        return this.transactionHistory;
    }

    validateChain() {
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];

            if (currentBlock.hash !== this.calculateHash(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.transactions,
                currentBlock.previousHash,
                currentBlock.nonce
            )) {
                return { valid: false, error: `Block ${i} hash is invalid` };
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return { valid: false, error: `Block ${i} previous hash mismatch` };
            }
        }
        return { valid: true, blocks: this.blocks.length };
    }
}
