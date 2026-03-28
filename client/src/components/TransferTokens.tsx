import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import LoadingSpinner from './common/LoadingSpinner';


const TransferTokens: React.FC<any> = ({
    loading,
    onTransfer,
    from,
    setFrom,
    initialFrom = '',
    initialTo = ''
}) => {
    const [to, setTo] = useState(initialTo);
    const [amount, setAmount] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    // Update from address when initialFrom changes (e.g., when user selects from users list)
    useEffect(() => {
        if (initialFrom) {
            setFrom(initialFrom);
        }
    }, [initialFrom]);

    // Update to address when initialTo changes
    useEffect(() => {
        if (initialTo) {
            setTo(initialTo);
        }
    }, [initialTo]);

    const validateAddress = (address: string): boolean => {
        return address.length >= 10; // Basic validation
    };

    const handleSubmit = async () => {
        const trimmedFrom = from.trim();
        const trimmedTo = to.trim();
        const trimmedAmount = amount.trim();

        // Validation
        if (!trimmedFrom) {
            toast.error('Please enter from address');
            return;
        }

        if (!validateAddress(trimmedFrom)) {
            toast.error('Invalid from address format');
            return;
        }

        if (!trimmedTo) {
            toast.error('Please enter to address');
            return;
        }

        if (!validateAddress(trimmedTo)) {
            toast.error('Invalid to address format');
            return;
        }

        if (!trimmedAmount) {
            toast.error('Please enter amount');
            return;
        }

        const numAmount = parseFloat(trimmedAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Amount must be a positive number');
            return;
        }

        if (trimmedFrom === trimmedTo) {
            toast.error('Cannot send tokens to the same address');
            return;
        }

        try {
            setLocalLoading(true);
            await onTransfer(trimmedFrom, trimmedTo, trimmedAmount);
            // Clear form on success
            setFrom('');
            setTo('');
            setAmount('');
            toast.success('Transaction created successfully!');
        } catch (error: any) {
            console.error('Transfer error:', error);
            toast.error(error.message || 'Failed to create transaction');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
        if (e.key === 'Enter') {
            if (field === 'from') {
                document.getElementById('to-address')?.focus();
            } else if (field === 'to') {
                document.getElementById('amount')?.focus();
            } else if (field === 'amount') {
                handleSubmit();
            }
        }
    };

    const isLoading = loading || localLoading;

    return (
        <div className="card group hover:border-orange-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                    <FiSend />
                </div>
                Transfer Tokens
            </h3>
            <div className="space-y-3">
                <div>
                    <input
                        id="from-address"
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'from')}
                        placeholder="From address"
                        className="input-field"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {from && !validateAddress(from) && from.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">Invalid address format</p>
                    )}
                </div>

                <div>
                    <input
                        id="to-address"
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'to')}
                        placeholder="To address"
                        className="input-field"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {to && !validateAddress(to) && to.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">Invalid address format</p>
                    )}
                </div>

                <div>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'amount')}
                        placeholder="Amount"
                        min="1"
                        step="any"
                        className="input-field"
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !from.trim() || !to.trim() || !amount.trim()}
                    className="btn-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Creating...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiSend />
                            Create Transaction
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TransferTokens;