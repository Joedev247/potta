'use client';

import { useState, useEffect } from 'react';
import { Role } from '../types';
import { orgChartApi } from '../utils/api';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSave: (role: Partial<Role>) => void;
}

export default function RoleModal({
  isOpen,
  onClose,
  role,
  onSave,
}: RoleModalProps) {
  const [formData, setFormData] = useState<Partial<Role>>({
    role_name: '',
    description: '',
    permissions: [],
    organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData(role);
      } else {
        setFormData({
          role_name: '',
          description: '',
          permissions: [],
          organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
        });
      }
      setErrors({});
    }
  }, [isOpen, role]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.role_name?.trim()) {
      newErrors.role_name = 'Role name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {role ? 'Edit Role' : 'Add New Role'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={formData.role_name || ''}
                onChange={(e) => handleInputChange('role_name', e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.role_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter role name"
              />
              {errors.role_name && (
                <p className="mt-1 text-sm text-red-600">{errors.role_name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter role description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                {['read', 'write', 'delete', 'admin'].map((permission) => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={
                        formData.permissions?.includes(permission) || false
                      }
                      onChange={(e) => {
                        const currentPermissions = formData.permissions || [];
                        const newPermissions = e.target.checked
                          ? [...currentPermissions, permission]
                          : currentPermissions.filter((p) => p !== permission);
                        handleInputChange('permissions', newPermissions);
                      }}
                      className="h-4 w-4 text-[#237804] focus:ring-[#237804] border-gray-300"
                    />
                    <label
                      htmlFor={permission}
                      className="ml-2 block text-sm text-gray-900 capitalize"
                    >
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#237804] hover:bg-[#1D6303] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
