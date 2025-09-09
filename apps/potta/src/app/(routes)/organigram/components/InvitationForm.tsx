'use client';

import React, { useState, useEffect } from 'react';
import { IoClose, IoMail, IoPerson, IoShield } from 'react-icons/io5';
import { orgChartApi } from '../utils/api';
import { toast } from 'react-hot-toast';
import { Role } from '../types';

interface InvitationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: string;
}

interface InvitationData {
  email: string;
  recipientName: string;
  role: string;
  temporaryPassword?: string;
}

export default function InvitationForm({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
}: InvitationFormProps) {
  const [formData, setFormData] = useState<InvitationData>({
    email: '',
    recipientName: '',
    role: '',
    temporaryPassword: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [errors, setErrors] = useState<Partial<InvitationData>>({});

  // Load roles when component mounts
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const result = await orgChartApi.getRoles(organizationId);
        setRoles(result.data || []);
      } catch (error) {
        console.error('Error loading roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (isOpen) {
      loadRoles();
    }
  }, [isOpen, organizationId]);

  const handleInputChange = (field: keyof InvitationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InvitationData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await orgChartApi.sendInvitation({
        email: formData.email,
        recipientName: formData.recipientName,
        role: formData.role,
        temporaryPassword: formData.temporaryPassword || undefined,
      });

      toast.success('Invitation sent successfully!');
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      recipientName: '',
      role: '',
      temporaryPassword: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 text-green-600">
                <IoMail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Send Invitation
                </h2>
                <p className="text-sm text-gray-500">
                  Invite a new user to the organization
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoPerson className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      handleInputChange('recipientName', e.target.value)
                    }
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.recipientName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.recipientName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recipientName}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoShield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.role ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    disabled={loadingRoles}
                  >
                    <option value="">
                      {loadingRoles ? 'Loading roles...' : 'Select a role'}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Temporary Password (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password (Optional)
                </label>
                <input
                  type="password"
                  value={formData.temporaryPassword}
                  onChange={(e) =>
                    handleInputChange('temporaryPassword', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Leave empty for auto-generated password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  If left empty, a temporary password will be generated
                  automatically
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-3">
           
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
