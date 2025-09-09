'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { GeographicalUnit } from '../types';
import { orgChartApi } from '../utils/api';

interface GeographicalUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  geographicalUnit?: GeographicalUnit | null;
  onSave: (geographicalUnit: Partial<GeographicalUnit>) => void;
  mode?: 'create' | 'edit'; // Add mode prop to distinguish create vs edit
  parentGeographicalUnit?: GeographicalUnit | null; // Add parent geographical unit prop
  organizationId: string;
}

export default function GeographicalUnitModal({
  isOpen,
  onClose,
  geographicalUnit,
  onSave,
  mode = 'edit', // Default to edit mode
  parentGeographicalUnit,
  organizationId,
}: GeographicalUnitModalProps) {
  const [formData, setFormData] = useState<Partial<GeographicalUnit>>({
    geo_unit_name: '',
    description: '',
    parent_geo_unit_id: '',
  });

  const [parentUnits, setParentUnits] = useState<GeographicalUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load parent units for dropdown
  useEffect(() => {
    const loadParentUnits = async () => {
      try {
        const response = await orgChartApi.getGeographicalUnits(organizationId);
        if (response.success && response.data) {
          setParentUnits(response.data);
        }
      } catch (error) {
        console.error('Error loading parent units:', error);
      }
    };

    if (isOpen) {
      loadParentUnits();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (geographicalUnit) {
        setFormData(geographicalUnit);
      } else {
        setFormData({
          geo_unit_name: '',
          description: '',
          parent_geo_unit_id: parentGeographicalUnit?.id || '',
        });
      }
      setErrors({});
    }
  }, [isOpen, geographicalUnit, parentGeographicalUnit]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.geo_unit_name?.trim()) {
      newErrors.geo_unit_name = 'Unit name is required';
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
      // Filter out unnecessary fields for update and empty values
      const payload = {
        geo_unit_name: formData.geo_unit_name,
        description: formData.description,
        ...(mode === 'create' &&
          formData.parent_geo_unit_id &&
          formData.parent_geo_unit_id.trim() !== '' && {
            parent_geo_unit_id: formData.parent_geo_unit_id,
          }),
      };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Error saving geographical unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto  shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create'
                ? 'Create New Geographical Unit'
                : 'Edit Geographical Unit'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Unit Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Name *
              </label>
              <input
                type="text"
                value={formData.geo_unit_name || ''}
                onChange={(e) =>
                  handleInputChange('geo_unit_name', e.target.value)
                }
                className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-[#237804] focus:border-transparent transition-colors ${
                  errors.geo_unit_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter geographical unit name"
              />
              {errors.geo_unit_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.geo_unit_name}
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
                className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-[#237804] focus:border-transparent transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Parent Unit - Only show when creating */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Unit (Optional)
                </label>
                <select
                  value={formData.parent_geo_unit_id || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'parent_geo_unit_id',
                      e.target.value || undefined
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-[#237804] focus:border-transparent transition-colors"
                >
                  <option value="">No Parent Unit</option>
                  {parentUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.geo_unit_name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select a parent unit to create a hierarchical structure
                </p>
              </div>
            )}

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
                  : mode === 'create'
                  ? 'Create Geographical Unit'
                  : 'Update Geographical Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
