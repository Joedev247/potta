'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { OrganizationalStructure, Location } from '../types';
import { orgChartApi } from '../utils/api';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: OrganizationalStructure | null;
  onSave: (department: Partial<OrganizationalStructure>) => void;
  parentStructure?: OrganizationalStructure | null;
}

export default function DepartmentModal({
  isOpen,
  onClose,
  department,
  onSave,
  parentStructure,
}: DepartmentModalProps) {
  const [formData, setFormData] = useState<Partial<OrganizationalStructure>>({
    department_name: '',
    description: '',
    structure_type: 'STANDARD_OFFICE',
    parent_structure_id: '',
    location_id: '',
    max_employees: 10,
    budget: 0,
    is_active: true,
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadLocations();
      if (department) {
        setFormData(department);
      } else {
        setFormData({
          department_name: '',
          description: '',
          structure_type: 'STANDARD_OFFICE',
          parent_structure_id: parentStructure?.id || '',
          location_id: '',
          max_employees: 10,
          budget: 0,
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, department, parentStructure]);

  const loadLocations = async () => {
    try {
      const response = await orgChartApi.getLocations();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.department_name?.trim()) {
      newErrors.department_name = 'Department name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location_id) {
      newErrors.location_id = 'Location is required';
    }

    if (formData.max_employees && formData.max_employees < 1) {
      newErrors.max_employees = 'Max employees must be at least 1';
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative';
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
      console.error('Error saving department:', error);
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
              {department ? 'Edit Department' : 'Add New Department'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.department_name || ''}
                onChange={(e) =>
                  handleInputChange('department_name', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.department_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter department name"
              />
              {errors.department_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.department_name}
                </p>
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
                placeholder="Enter department description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Structure Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Structure Type
              </label>
              <select
                value={formData.structure_type || 'STANDARD_OFFICE'}
                onChange={(e) =>
                  handleInputChange('structure_type', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="STANDARD_OFFICE">Standard Office</option>
                <option value="TECH_STARTUP">Tech Startup</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="NON_PROFIT">Non-Profit</option>
                <option value="GOVERNMENT">Government</option>
              </select>
            </div>

            {/* Parent Structure */}
            {parentStructure && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Department
                </label>
                <input
                  type="text"
                  value={parentStructure.department_name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500"
                />
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={formData.location_id || ''}
                onChange={(e) =>
                  handleInputChange('location_id', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.location_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name} - {location.city},{' '}
                    {location.country}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location_id}
                </p>
              )}
            </div>

            {/* Employee Counts */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Employees
                </label>
                <input
                  type="number"
                  value={formData.max_employees || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'max_employees',
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.max_employees ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.max_employees && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.max_employees}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Employees
                </label>
                <input
                  type="number"
                  value={formData.current_employees || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'current_employees',
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.current_employees
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.current_employees && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current_employees}
                  </p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Budget ($)
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) =>
                  handleInputChange('budget', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
              )}
            </div>

            {/* Active Status */}
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
                Active Department
              </label>
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
                {loading
                  ? 'Saving...'
                  : department
                  ? 'Update Department'
                  : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
