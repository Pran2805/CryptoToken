import React, { useState, useEffect } from 'react';
import { FiSend, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

interface CosmosWallet {
  address: string;
  balances: { denom: string; amount: string }[];
  mnemonic?: string;
}

const SendTokens: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<CosmosWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const API_BASE = import.meta.env.REACT_APP_API_BASE || 'http://localhost:8000';

  // Connect to Cosmos (generate new wallet)
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/api/cosmos/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setWallet({
          address: data.address,
          balances: [],
          mnemonic: data.mnemonic,
        });
        setConnected(true);
        await fetchBalance(data.address);
      } else {
        setError(data.error || 'Connection failed');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance for the connected address
  const fetchBalance = async (address?: string) => {
    const addr = address || wallet?.address;
    if (!addr) return;
    try {
      const res = await fetch(`${API_BASE}/api/cosmos/balance?address=${addr}`);
      const data = await res.json();
      if (data.success) {
        setWallet((prev) => prev ? { ...prev, balances: data.balances } : null);
      } else {
        console.error('Balance fetch error:', data.error);
      }
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  };

  // Send tokens
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !wallet) {
      setError('Not connected. Please connect first.');
      return;
    }
    if (!recipient.trim()) {
      setError('Recipient address is required');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send amount in ATOM (backend will convert to uatom)
      const res = await fetch(`${API_BASE}/api/cosmos/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress: recipient,
          amount: numAmount,    // in ATOM
          denom: 'atom',        // tell backend this is ATOM
          memo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Transaction sent! Hash: ${data.transactionHash}`);
        setRecipient('');
        setAmount('');
        setMemo('');
        // Refresh balance after a few seconds
        setTimeout(() => fetchBalance(), 3000);
      } else {
        setError(data.error || 'Transaction failed');
      }
    } catch (err: any) {
      setError(err.message || 'Send error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to display formatted balance (convert uatom to ATOM)
  const getBalanceInAtom = () => {
    if (!wallet) return '0';
    const uatomBal = wallet.balances.find(b => b.denom === 'uatom');
    if (!uatomBal) return '0';
    return (parseInt(uatomBal.amount) / 1_000_000).toFixed(6);
  };

  if (!connected) {
    return (
      <div className="card bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
            <FiSend />
          </div>
          Send Tokens
        </h3>
        <p className="text-gray-600 mb-4">Connect your Cosmos wallet to start sending tokens on the testnet.</p>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="btn-blue w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiRefreshCw className="animate-spin" />
              Connecting...
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
            <FiSend />
          </div>
          Send Tokens
        </h3>
        <button
          onClick={() => fetchBalance()}
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Your Address:</span>
          <span className="font-mono text-xs break-all">{wallet?.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Balance:</span>
          <span className="font-medium">{getBalanceInAtom()} ATOM</span>
        </div>
        {wallet?.mnemonic && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Please save this mnemonic securely (you won't see it again):<br />
            <span className="font-mono break-all">{wallet.mnemonic}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="space-y-3">
        <input
          type="text"
          placeholder="Recipient address (cosmos1...)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="input-field w-full"
          required
        />
        <input
          type="number"
          placeholder="Amount (ATOM)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field w-full"
          step="any"
          min="0"
          required
        />
        <input
          type="text"
          placeholder="Memo (optional)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="input-field w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-blue w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiRefreshCw className="animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FiSend />
              Send Tokens
            </span>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          ✅ {success}
        </div>
      )}
    </div>
  );
};

export default SendTokens;