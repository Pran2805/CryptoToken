import React from 'react';
import { FiGlobe, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import CopyButton from '../common/CopyButton';
import type { CosmosConnectResponse } from '../../types';

interface ConnectCosmosProps {
    mnemonic: string;
    loading?: boolean;
    wallet: CosmosConnectResponse | null;
    onMnemonicChange: (value: string) => void;
    onConnect: () => void;
    onCopy: (text: string) => void;
}

const ConnectCosmos: React.FC<ConnectCosmosProps> = ({
    mnemonic,
    loading,
    wallet,
    onMnemonicChange,
    onConnect,
    onCopy
}) => {
    return (
        <div className="card group hover:border-cyan-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600 group-hover:scale-110 transition-transform">
                    <FiGlobe />
                </div>
                Connect to Cosmos
            </h3>
            <div className="space-y-3">
                <textarea
                    value={mnemonic}
                    onChange={(e) => onMnemonicChange(e.target.value)}
                    placeholder="Enter mnemonic (optional)"
                    rows={3}
                    className="input-field"
                />
                <button
                    onClick={onConnect}
                    disabled={loading}
                    className="btn-blue w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Connecting...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiGlobe />
                            Connect to Testnet
                        </span>
                    )}
                </button>
                {wallet && (
                    <div className="result-success animate__animated animate__fadeInUp">
                        <p className="font-medium flex items-center gap-2">
                            <FiCheckCircle className="text-green-600" />
                            Connected!
                        </p>
                        <p className="text-sm break-all mt-1 font-mono bg-white p-2 rounded border border-gray-200">
                            {wallet.address}
                        </p>
                        <CopyButton text={wallet.address} onCopy={onCopy} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectCosmos;