'use client';

import { useState, useEffect, useRef } from 'react';
import { IoChevronDown, IoSearch, IoClose } from 'react-icons/io5';
import { User } from '../types';
import { orgChartApi } from '../utils/api';

interface SearchableUserSelectProps {
  value: string;
  onChange: (userId: string, user: User | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function SearchableUserSelect({
  value,
  onChange,
  placeholder = 'Search and select a user...',
  error,
  disabled = false,
}: SearchableUserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const userId = user.id || (user as any).userId;
        const fullName = `${user.first_name || ''} ${
          user.last_name || ''
        }`.trim();
        const email = user.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
          fullName.toLowerCase().includes(search) ||
          email.includes(search) ||
          (user.full_name && user.full_name.toLowerCase().includes(search)) ||
          userId.toLowerCase().includes(search) ||
          `User ${userId}`.toLowerCase().includes(search)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await orgChartApi.getUsers();
      setUsers(result.data || []);
      setFilteredUsers(result.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // Handle member data structure (userId field) vs user data structure (id field)
    const userId = user.id || (user as any).userId;
    const displayName =
      user.full_name ||
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      user.email ||
      `User ${userId}`;

    setSearchTerm(displayName);
    onChange(userId, user);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSearchTerm('');
    onChange('', null);
  };

  const getDisplayText = () => {
    if (selectedUser) {
      const userId = selectedUser.id || (selectedUser as any).userId;
      return (
        selectedUser.full_name ||
        `${selectedUser.first_name || ''} ${
          selectedUser.last_name || ''
        }`.trim() ||
        selectedUser.email ||
        `User ${userId}`
      );
    }
    return searchTerm || placeholder;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`relative w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-white cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <IoSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span
              className={`truncate ${
                selectedUser ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {getDisplayText()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {selectedUser && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <IoClose className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <IoChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm
                ? 'No users found matching your search'
                : 'No users available'}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const userId = user.id || (user as any).userId;
              const displayName =
                user.full_name ||
                `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                user.email ||
                `User ${userId}`;
              const initials =
                user.first_name?.[0] || user.email?.[0] || userId?.[0] || 'U';

              return (
                <div
                  key={userId}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {initials.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {user.email || `ID: ${userId}`}
                      </div>
                    </div>
                    {user.is_active === false && (
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
