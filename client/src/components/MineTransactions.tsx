import React, { useState } from 'react';
import { FiCpu, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import LoadingSpinner from './common/LoadingSpinner';

interface MineTransactionsProps {
    loading?: boolean;
    onMine: (address: string) => Promise<void>; // Make it async
}

const MineTransactions: React.FC<MineTransactionsProps> = ({ loading, onMine }) => {
    const [address, setAddress] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const handleMine = async () => {
        const trimmedAddress = address.trim();
        
        if (!trimmedAddress) {
            toast.error('Please enter your address for mining reward');
            return;
        }

        // Basic address validation (adjust based on your address format)
        if (trimmedAddress.length < 10) {
            toast.error('Invalid address format');
            return;
        }

        try {
            setLocalLoading(true);
            await onMine(trimmedAddress);
            setAddress(''); // Clear input on success
            toast.success('Mining started successfully!');
        } catch (error: any) {
            console.error('Mining error:', error);
            toast.error(error.message || 'Failed to start mining');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && address.trim() && !isLoading) {
            handleMine();
        }
    };

    const isLoading = loading || localLoading;

    return (
        <div className="card group hover:border-yellow-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 group-hover:scale-110 transition-transform">
                    <FiCpu />
                </div>
                Mine Transactions
            </h3>
            <div className="space-y-3">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your address for reward"
                    className="input-field"
                    disabled={isLoading}
                    autoComplete="off"
                />
                <button
                    onClick={handleMine}
                    disabled={isLoading || !address.trim()}
                    className="btn-blue w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Mining...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiZap />
                            Start Mining
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MineTransactions;