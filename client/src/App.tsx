import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FiCpu } from 'react-icons/fi';
import { useTokenStore, initializeStore } from './store/useTokenStore';

// Layout Components
import Header from './layout/Header';
import Footer from './layout/Footer';
import ScrollToTop from './layout/ScrollToTop';
import TabButton from './components/common/TabButton';

// Local Blockchain Components
import CreateUser from './components/CreateUser';
import CheckBalance from './components/CheckBalance';
import UsersList from './components/UsersList';
import TransferTokens from './components/TransferTokens';
import MineTransactions from './components/MineTransactions';
import BlockchainExplorer from './components/BlockchainExplorer';
import TransactionHistory from './components/TransactionHistory';

// Cosmos Components
import ConnectCosmos from './components/cosmos/ConnectCosmos';
import CosmosStatus from './components/cosmos/CosmosStatus';
import CosmosBalance from './components/cosmos/CosmosBalance';
import SendTokens from './components/cosmos/SendTokens';

function App() {
  const {
    activeTab,
    setActiveTab,
    loading,
    chainInfo,
    users,
    blocks,
    transactions,
    balance,
    fetchUsers,
    fetchBlocks,
    fetchTransactions,
    createUser,
    checkBalance,
    createTransaction,
    mineTransactions,
    validateChain,
    mnemonic,
    cosmosAddress,
    cosmosBalance,
    cosmosStatus,
    cosmosWallet,
    setMnemonic,
    setCosmosAddress,
    connectToCosmos,
    getCosmosStatus,
    checkCosmosBalance,
    copyToClipboard,
  } = useTokenStore();

  useEffect(() => {
    const cleanup = initializeStore();
    return cleanup;
  }, []);

  useEffect(() => {
    if (activeTab === 'local') {
      fetchUsers();
      fetchBlocks();
      fetchTransactions();
    }
  }, [activeTab, fetchUsers, fetchBlocks, fetchTransactions]);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            icon: '🎉',
            style: { borderLeft: '4px solid #10B981' },
          },
          error: {
            icon: '❌',
            style: { borderLeft: '4px solid #EF4444' },
          },
        }}
      />

      <Header chainInfo={chainInfo} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex gap-4 mb-8 perspective-1000">
          {/* <TabButton
            active={activeTab === 'local'}
            onClick={() => setActiveTab('local')}
            icon={<FiCpu className="text-xl" />}
            label="Local Blockchain"
          /> */}
          <TabButton
            active={activeTab === 'cosmos'}
            onClick={() => setActiveTab('cosmos')}
            icon={<FiCpu className="text-xl" />}
            label="Cosmos"
          />

        </div>

        {activeTab === 'local' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CreateUser loading={loading.create} onCreateUser={createUser} />
              <CheckBalance
                loading={loading.balance}
                balance={balance}
                onCheckBalance={checkBalance}
                address={selectedAddress}
                onAddressChange={setSelectedAddress}
              />
              <UsersList
                users={users}
                loading={loading.users}
                onRefresh={fetchUsers}
                onSelectUser={(addr) => {
                  setSelectedAddress(addr); // 👈 THIS is the key
                  checkBalance(addr);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransferTokens
                loading={loading.transaction}
                from={fromAddress}
                setFrom={setFromAddress}
                to={toAddress}
                amount={amount}
                onFromChange={setFromAddress}
                onToChange={setToAddress}
                onAmountChange={setAmount}
                onTransfer={createTransaction}
              />

              <MineTransactions
                loading={loading.mine}
                onMine={mineTransactions}
              />
            </div>

            <BlockchainExplorer
              blocks={blocks}
              loading={loading?.blocks}
              onRefresh={fetchBlocks}
              onValidate={validateChain}
              validateLoading={loading.validate}
            />

            <TransactionHistory transactions={transactions} />
          </div>
        )}

        {activeTab === 'cosmos' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConnectCosmos
                mnemonic={mnemonic}
                loading={loading.cosmosConnect}
                wallet={cosmosWallet}
                onMnemonicChange={setMnemonic}
                onConnect={connectToCosmos}
                onCopy={copyToClipboard}
              />
              <CosmosStatus
                status={cosmosStatus}
                loading={loading.cosmosStatus}
                onGetStatus={getCosmosStatus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CosmosBalance
                address={cosmosAddress}
                balance={cosmosBalance}
                loading={loading.cosmosBalance}
                onAddressChange={setCosmosAddress}
                onCheckBalance={checkCosmosBalance}
              />
              <SendTokens />
            </div>
          </div>
        )}

        <Footer />
      </main>

      <ScrollToTop />
    </div>
  );
}

export default App;