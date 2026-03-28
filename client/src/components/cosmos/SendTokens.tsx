import React, { useState } from 'react';
import { FiSend, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import ApiClient from '../../utils/api';

interface SendTokensProps {
  balance?: number; // Optional balance prop to display current balance
  onSuccess?: (txHash: string) => void; // Optional callback on successful send
}

const SendTokens: React.FC<SendTokensProps> = ({ balance = 0, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!recipient.trim()) {
      setError('Recipient address is required');
      return;
    }

    // Basic Cosmos address validation (starts with cosmos1 and has proper length)
    if (!recipient.trim().startsWith('cosmos1') || recipient.trim().length < 10) {
      setError('Invalid Cosmos address. Address should start with "cosmos1"');
      return;
    }

    const numAmount = parseFloat(amount);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Make the API call to backend
      const data: any = await ApiClient.post('/api/cosmos/send', {
        recipientAddress: recipient.trim(),
        amount: numAmount,
      });

      if (data.success) {
        setSuccess(data.message || `Successfully sent ${numAmount} ATOM to ${recipient.substring(0, 10)}...`);
        setRecipient('');
        setAmount('');

        // Call onSuccess callback if provided
        if (onSuccess && data.txHash) {
          onSuccess(data.txHash);
        }
      } else {
        setError(data.error || 'Transaction failed');
      }
    } catch (err: any) {
      console.error('Send error:', err);

      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError('Please login to send tokens');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Invalid request. Please check your inputs');
      } else if (err.response?.status === 409) {
        setError('Insufficient balance for this transaction');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to send transaction. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
              <FiSend />
            </div>
            Send Token
          </h3>
        </div>

        {/* Balance Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Available Balance:</span>
            <span className="text-2xl font-bold text-gray-800">
              {balance.toFixed(6)} <span className="text-sm font-normal text-gray-600">ATOM</span>
            </span>
          </div>
        </div>

        {/* Send Form */}
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="cosmos1..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a valid Cosmos address starting with "cosmos1"
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ATOM)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.000001"
              min="0"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiRefreshCw className="animate-spin" />
                Processing Transaction...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiSend /> Send Tokens
              </span>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-2">
            <span className="text-lg flex-shrink-0">✅</span>
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTokens;