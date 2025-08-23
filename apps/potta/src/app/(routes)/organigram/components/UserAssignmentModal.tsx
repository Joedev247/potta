'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { UserAssignment } from '../types';

interface UserAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: UserAssignment | null;
  onSave: (assignment: Partial<UserAssignment>) => void;
}

export default function UserAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSave,
}: UserAssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<UserAssignment>>({
    user_id: '',
    job_title: '',
    assignment_type: 'PRIMARY',
    start_date: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        setFormData(assignment);
      } else {
        setFormData({
          user_id: '',
          job_title: '',
          assignment_type: 'PRIMARY',
          start_date: '',
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, assignment]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id?.trim()) {
      newErrors.user_id = 'User ID is required';
    }

    if (!formData.job_title?.trim()) {
      newErrors.job_title = 'Job title is required';
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
      console.error('Error saving user assignment:', error);
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
              {assignment ? 'Edit User Assignment' : 'Add New User Assignment'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                value={formData.user_id || ''}
                onChange={(e) => handleInputChange('user_id', e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.user_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter user ID"
              />
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.job_title || ''}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.job_title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter job title"
              />
              {errors.job_title && (
                <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type
              </label>
              <select
                value={formData.assignment_type || 'PRIMARY'}
                onChange={(e) =>
                  handleInputChange('assignment_type', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="PRIMARY">Primary</option>
                <option value="SECONDARY">Secondary</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active || false}
                onChange={(e) =>
                  handleInputChange('is_active', e.target.checked)
                }
                className="h-4 w-4 text-[#237804] focus:ring-[#237804] border-gray-300"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-900"
              >
                Active Assignment
              </label>
            </div>

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
                {loading
                  ? 'Saving...'
                  : assignment
                  ? 'Update Assignment'
                  : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
