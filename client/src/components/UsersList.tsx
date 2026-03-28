import React from 'react';
import { FiUsers, FiRefreshCw, FiUser, FiDollarSign } from 'react-icons/fi';
import type { User } from '../types';

interface UsersListProps {
    users: User[];
    loading?: boolean;
    onRefresh: () => void;
    onSelectUser: (address: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
    users,
    loading,
    onRefresh,
    onSelectUser
}) => {
    return (
        <div className="card group hover:border-purple-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                        <FiUsers />
                    </div>
                    Users
                </h3>

                <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FiRefreshCw className={loading ? 'animate-spin text-blue-600' : ''} />
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
                {users.map((user) => (
                    <div
                        key={user.address}
                        onClick={() => onSelectUser(user.address)}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                    >
                        <p className="font-semibold text-blue-600 flex items-center gap-2">
                            <FiUser />
                            {user.username}
                        </p>

                        <p className="text-sm text-gray-600 font-mono">
                            {user.address.slice(0, 20)}...
                        </p>

                        <p className="text-sm flex items-center gap-1 mt-1">
                            <FiDollarSign />
                            {user.balance} tokens
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;