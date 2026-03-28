// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

// User Types
export interface User {
  username: string;
  address: string;
  publicKey: string;
  privateKey: string;
  createdAt: number;
  balance: number;
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

// Balance Types
export interface BalanceResponse {
  success: boolean;
  balance: number;
  address: string;
  username: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  timestamp: number;
  status?: 'pending' | 'confirmed';
  sender?: string;
}

export interface CreateTransactionResponse {
  success: boolean;
  transaction: Transaction;
  message: string;
}

// Block Types
export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

// Chain Info Types
export interface ChainInfo {
  blockHeight: number;
  totalUsers: number;
  pendingTransactions: number;
  totalSupply: number;
  difficulty: number;
  miningReward: number;
  latestBlock: Block;
}

// Mining Types
export interface MiningResponse {
  success: boolean;
  block: Block;
  miningTime: number;
  transactionsCount: number;
  message: string;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  blocks: number;
  error?: string;
}

// Cosmos Types
export interface CosmosBalance {
  denom: string;
  amount: string;
}

export interface CosmosConnectResponse {
  success: boolean;
  address: string;
  mnemonic?: string;
  error?: string;
}

export interface CosmosBalanceResponse {
  success: boolean;
  address: string;
  balances: CosmosBalance[];
  error?: string;
}

export interface CosmosStatusResponse {
  success: boolean;
  chainId: string;
  height: number;
  node: string;
  error?: string;
}

export interface CosmosSendResponse {
  success: boolean;
  transactionHash: string;
  height: number;
  error?: string;
}

// Loading State
export interface LoadingState {
  create?: boolean;
  balance?: boolean;
  users?: boolean;
  transaction?: boolean;
  mine?: boolean;
  validate?: boolean;
  cosmosConnect?: boolean;
  cosmosStatus?: boolean;
  cosmosBalance?: boolean;
  blocks?: any
}