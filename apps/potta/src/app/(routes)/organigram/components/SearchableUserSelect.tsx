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
  organizationId: string;
}

export default function SearchableUserSelect({
  value,
  onChange,
  placeholder = 'Search and select a user...',
  error,
  disabled = false,
  organizationId,
}: SearchableUserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load members on component mount
  useEffect(() => {
    loadMembers();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(members);
    } else {
      const filtered = members.filter((member) => {
        const user = member.user;
        if (!user) return false;

        const userId = user.id;
        const fullName = `${user.firstName || ''} ${
          user.lastName || ''
        }`.trim();
        const username = user.username || '';
        const email = user.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
          fullName.toLowerCase().includes(search) ||
          username.toLowerCase().includes(search) ||
          email.includes(search) ||
          userId.toLowerCase().includes(search) ||
          `User ${userId}`.toLowerCase().includes(search)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, members]);

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

  const loadMembers = async () => {
    try {
      setLoading(true);
      const result = await orgChartApi.getUsers(organizationId);
      setMembers(result.data || []);
      setFilteredUsers(result.data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (member: any) => {
    setSelectedUser(member);
    const user = member.user;
    if (user) {
      const userId = user.id;
      const displayName =
        user.username ||
        `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
        user.email ||
        `User ${userId}`;

      setSearchTerm(displayName);
      onChange(userId, user);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSearchTerm('');
    onChange('', null);
  };

  const getDisplayText = () => {
    if (selectedUser && selectedUser.user) {
      const user = selectedUser.user;
      const userId = user.id;
      return (
        user.username ||
        `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
        user.email ||
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
            filteredUsers.map((member) => {
              const user = member.user;
              if (!user) return null;

              const userId = user.id;
              const displayName =
                user.username ||
                `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                user.email ||
                `User ${userId}`;
              const initials =
                user.firstName?.[0] ||
                user.username?.[0] ||
                user.email?.[0] ||
                userId?.[0] ||
                'U';

              return (
                <div
                  key={userId}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleUserSelect(member)}
                >
                  <div className="flex items-center space-x-3">
                    {user.image ? (
                      <img
                        src={user.image}
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
                      {member.role && (
                        <div className="text-xs text-gray-400 truncate">
                          Role: {member.role.name}
                        </div>
                      )}
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
