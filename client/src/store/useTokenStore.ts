import { create } from 'zustand';
import type {
    User, ChainInfo, Block, Transaction, BalanceResponse,
    CreateUserResponse, CreateTransactionResponse, MiningResponse,
    ValidationResult, CosmosConnectResponse, CosmosBalanceResponse,
    CosmosStatusResponse, CosmosBalance, LoadingState
} from '../types';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface TokenStore {
    activeTab: 'local' | 'cosmos';
    setActiveTab: (tab: 'local' | 'cosmos') => void;

    loading: LoadingState;
    setLoading: (key: keyof LoadingState, value: boolean) => void;

    chainInfo: ChainInfo;
    fetchChainInfo: () => Promise<void>;

    users: User[];
    blocks: Block[];
    transactions: Transaction[];
    balance: BalanceResponse | null;

    fetchUsers: () => Promise<void>;
    fetchBlocks: () => Promise<void>;
    fetchTransactions: () => Promise<void>;
    createUser: (username: string) => Promise<void>;
    checkBalance: (address: string) => Promise<void>;
    createTransaction: (fromAddress: string, toAddress: string, amount: string) => Promise<void>;
    mineTransactions: (minerAddress: string) => Promise<void>;
    validateChain: () => Promise<void>;

    mnemonic: string;
    cosmosAddress: string;
    cosmosBalance: CosmosBalance[] | null;
    cosmosStatus: CosmosStatusResponse | null;
    cosmosWallet: CosmosConnectResponse | null;

    setMnemonic: (mnemonic: string) => void;
    setCosmosAddress: (address: string) => void;
    connectToCosmos: () => Promise<void>;
    getCosmosStatus: () => Promise<void>;
    checkCosmosBalance: () => Promise<void>;

    copyToClipboard: (text: string) => void;
}

const initialChainInfo: ChainInfo = {
    blockHeight: 0,
    totalUsers: 0,
    pendingTransactions: 0,
    totalSupply: 0,
    difficulty: 4,
    miningReward: 100,
    latestBlock: {
        index: 0,
        timestamp: Date.now(),
        transactions: [],
        previousHash: '0',
        hash: '0',
        nonce: 0
    }
};

export const useTokenStore = create<TokenStore>((set, get) => ({
    activeTab: 'local',
    setActiveTab: (tab) => set({ activeTab: tab }),

    loading: {},
    setLoading: (key, value) =>
        set((state) => ({ loading: { ...state.loading, [key]: value } })),

    chainInfo: initialChainInfo,
    fetchChainInfo: async () => {
        try {
            const data = await api.get<{ success: boolean; info: ChainInfo }>('/api/chain-info');
            if (data.success) {
                set({ chainInfo: data.info });
            }
        } catch (error) {
            console.error('Failed to fetch chain info:', error);
        }
    },

    users: [],
    blocks: [],
    transactions: [],
    balance: null,

    fetchUsers: async () => {
        try {
            const data = await api.get<{ success: boolean; users: User[] }>('/api/users');
            if (data.success) {
                set({ users: data.users });
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    },

    fetchBlocks: async () => {
        try {
            const data = await api.get<{ success: boolean; blocks: Block[] }>('/api/blocks');
            if (data.success) {
                set({ blocks: data.blocks.slice().reverse() });
            }
        } catch (error) {
            console.error('Failed to fetch blocks:', error);
        }
    },

    fetchTransactions: async () => {
        try {
            const data = await api.get<{ success: boolean; history: Transaction[] }>('/api/transactions/history');
            if (data.success) {
                set({ transactions: data.history.slice().reverse() });
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    },

    createUser: async (username: string) => {
        if (!username) {
            toast.error('Please enter a username');
            return;
        }

        get().setLoading('create', true);
        try {
            const data = await api.post<CreateUserResponse>('/api/users', { username });
            if (data.success) {
                toast.success(`User created! Address: ${data.user.address.slice(0, 20)}...`);
                get().fetchUsers();
                get().fetchChainInfo();
            }
        } catch (error) {
            console.error('Create user error:', error);
        } finally {
            get().setLoading('create', false);
        }
    },

    checkBalance: async (address: string) => {
        if (!address) {
            toast.error('Please enter an address');
            return;
        }

        get().setLoading('balance', true);
        try {
            const data = await api.get<BalanceResponse>(`/api/balance/${address}`);
            if (data.success) {
                set({ balance: data });
                toast.success(`Balance: ${data.balance} tokens`);
            }
        } catch (error) {
            console.error('Check balance error:', error);
        } finally {
            get().setLoading('balance', false);
        }
    },

    createTransaction: async (fromAddress: string, toAddress: string, amount: string) => {
        if (!fromAddress || !toAddress || !amount) {
            toast.error('Please fill all fields');
            return;
        }

        if (parseFloat(amount) <= 0) {
            toast.error('Amount must be positive');
            return;
        }

        get().setLoading('transaction', true);
        try {
            const data = await api.post<CreateTransactionResponse>('/api/transactions', {
                fromAddress,
                toAddress,
                amount: parseFloat(amount)
            });
            if (data.success) {
                toast.success(`Transaction created! ID: ${data.transaction.id.slice(0, 8)}...`);
                get().fetchChainInfo();
                get().fetchTransactions();
            }
        } catch (error) {
            console.error('Create transaction error:', error);
        } finally {
            get().setLoading('transaction', false);
        }
    },

    mineTransactions: async (minerAddress: string) => {
        if (!minerAddress) {
            toast.error('Please enter miner address');
            return;
        }

        get().setLoading('mine', true);
        try {
            const data = await api.post<MiningResponse>('/api/mine', { minerAddress });
            if (data.success) {
                toast.success(`Mined ${data.transactionsCount} transactions in ${data.miningTime}s!`);
                get().fetchChainInfo();
                get().fetchBlocks();
                get().fetchTransactions();
            }
        } catch (error) {
            console.error('Mine error:', error);
        } finally {
            get().setLoading('mine', false);
        }
    },

    validateChain: async () => {
        get().setLoading('validate', true);
        try {
            const data = await api.get<{ success: boolean } & ValidationResult>('/api/validate');
            if (data.success) {
                if (data.valid) {
                    toast.success(`✅ Blockchain is valid! ${data.blocks} blocks checked.`);
                } else {
                    toast.error(`❌ Chain invalid: ${data.error}`);
                }
            }
        } catch (error) {
            console.error('Validate error:', error);
        } finally {
            get().setLoading('validate', false);
        }
    },

    mnemonic: '',
    cosmosAddress: '',
    cosmosBalance: null,
    cosmosStatus: null,
    cosmosWallet: null,

    setMnemonic: (mnemonic) => set({ mnemonic }),
    setCosmosAddress: (address) => set({ cosmosAddress: address }),

    connectToCosmos: async () => {
        get().setLoading('cosmosConnect', true);
        try {
            const mnemonic = get().mnemonic;
            const data = await api.post<CosmosConnectResponse>('/api/cosmos/connect', {
                mnemonic: mnemonic || undefined
            });
            if (data.success) {
                set({ cosmosWallet: data });
                toast.success(`Connected! Address: ${data.address.slice(0, 20)}...`);
                if (data.mnemonic) {
                    toast.success('Save this mnemonic! Check console.', { duration: 10000 });
                    console.log('🔑 MNEMONIC:', data.mnemonic);
                }
            }
        } catch (error) {
            console.error('Cosmos connect error:', error);
        } finally {
            get().setLoading('cosmosConnect', false);
        }
    },

    getCosmosStatus: async () => {
        get().setLoading('cosmosStatus', true);
        try {
            const data = await api.get<CosmosStatusResponse>('/api/cosmos/status');
            if (data.success) {
                set({ cosmosStatus: data });
                toast.success(`Chain: ${data.chainId} | Height: ${data.height}`);
            }
        } catch (error) {
            console.error('Cosmos status error:', error);
        } finally {
            get().setLoading('cosmosStatus', false);
        }
    },

    checkCosmosBalance: async () => {
        get().setLoading('cosmosBalance', true);
        try {
            const cosmosAddress = get().cosmosAddress;
            const url = cosmosAddress
                ? `/api/cosmos/balance?address=${cosmosAddress}`
                : '/api/cosmos/balance';
            const data = await api.get<CosmosBalanceResponse>(url);
            if (data.success) {
                set({ cosmosBalance: data.balances });
                if (data.balances?.length) {
                    toast.success(`Balance: ${data.balances.map(b => `${b.amount} ${b.denom}`).join(', ')}`);
                } else {
                    toast.success('Balance: 0 tokens');
                }
            }
        } catch (error) {
            console.error('Cosmos balance error:', error);
        } finally {
            get().setLoading('cosmosBalance', false);
        }
    },

    copyToClipboard: (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    },
}));

export const initializeStore = () => {
    const store = useTokenStore.getState();
    store.fetchChainInfo();

    const interval = setInterval(() => {
        store.fetchChainInfo();
    }, 10000);

    return () => clearInterval(interval);
};