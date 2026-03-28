import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import LoadingSpinner from './common/LoadingSpinner';

interface CreateUserProps {
  loading?: boolean;
  onCreateUser: (username: string) => Promise<void>;
}

const CreateUser: React.FC<CreateUserProps> = ({ loading = false, onCreateUser }) => {
  const [username, setUsername] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = loading || localLoading;

  const handleSubmit = async () => {
    const trimmed = username.trim();

    if (!trimmed) {
      toast.error('Enter username');
      return;
    }

    if (trimmed.length < 3) {
      toast.error('Min 3 characters required');
      return;
    }

    try {
      setLocalLoading(true);

      await onCreateUser(trimmed);

      setUsername('');
      toast.success('User created');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="card group hover:border-blue-300 relative z-10">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
          <FiUser />
        </div>
        Create User
      </h3>

      <div className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter username"
          className="input-field relative z-10"
          disabled={isLoading}
          autoComplete="off"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !username.trim()}
          className="btn-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              Creating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FiUser />
              Create User
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateUser;