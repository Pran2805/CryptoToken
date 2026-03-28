import React from 'react';
import { FiLink, FiActivity } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import type { CosmosStatusResponse } from '../../types';

interface CosmosStatusProps {
    status: CosmosStatusResponse | null;
    loading?: boolean;
    onGetStatus: () => void;
}

const CosmosStatus: React.FC<CosmosStatusProps> = ({ status, loading, onGetStatus }) => {
    return (
        <div className="card group hover:border-emerald-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                    <FiLink />
                </div>
                Network Status
            </h3>
            <div className="space-y-3">
                <button
                    onClick={onGetStatus}
                    disabled={loading}
                    className="btn-blue w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Loading...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiActivity />
                            Get Status
                        </span>
                    )}
                </button>
                {status && (
                    <div className="result-success">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded">
                                <span className="text-gray-500 text-xs">Chain</span>
                                <p className="font-semibold">{status.chainId}</p>
                            </div>
                            <div className="bg-white p-2 rounded">
                                <span className="text-gray-500 text-xs">Height</span>
                                <p className="font-semibold">{status.height}</p>
                            </div>
                            <div className="col-span-2 bg-white p-2 rounded">
                                <span className="text-gray-500 text-xs">Node</span>
                                <p className="font-mono text-sm">{status.node}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CosmosStatus;