'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { SubBusiness, Location } from '../types';
import { orgChartApi } from '../utils/api';

interface SubBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  subBusiness?: SubBusiness | null;
  onSave: (subBusiness: Partial<SubBusiness>) => void;
}

export default function SubBusinessModal({
  isOpen,
  onClose,
  subBusiness,
  onSave,
}: SubBusinessModalProps) {
  const [formData, setFormData] = useState<Partial<SubBusiness>>({
    sub_business_name: '',
    description: '',
    industry: 'Technology',
    parent_sub_business_id: '',
    organization_id: '500e05a0-c688-4c4a-9661-ae152e00d0c5', // Default org ID
    max_employees: 50,
    annual_revenue: 5000000,
    established_year: new Date().getFullYear(),
    is_active: true,
    website: '',
    contact_email: '',
    contact_phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSubBusinesses, setAvailableSubBusinesses] = useState<
    SubBusiness[]
  >([]);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSubBusinesses();
      loadLocations();
      if (subBusiness) {
        setFormData(subBusiness);
      } else {
        setFormData({
          sub_business_name: '',
          description: '',
          industry: 'Technology',
          parent_sub_business_id: '',
          location_id: '',
          organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
          max_employees: 50,
          current_employees: 0,
          annual_revenue: 5000000,
          established_year: new Date().getFullYear(),
          is_active: true,
          website: '',
          contact_email: '',
          contact_phone: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, subBusiness]);

  const loadSubBusinesses = async () => {
    try {
      const response = await orgChartApi.getSubBusinesses();
      const subBusinessesData = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setAvailableSubBusinesses(subBusinessesData);
    } catch (error) {
      console.error('Error loading sub-businesses:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await orgChartApi.getLocations();
      const locationsData = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setAvailableLocations(locationsData);
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

    if (!formData.sub_business_name?.trim()) {
      newErrors.sub_business_name = 'Sub-business name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.max_employees && formData.max_employees <= 0) {
      newErrors.max_employees = 'Max employees must be greater than 0';
    }

    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = 'Please enter a valid email address';
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
      console.error('Error saving sub-business:', error);
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
              {subBusiness ? 'Edit Sub-Business' : 'Add New Sub-Business'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sub-Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Business Name *
              </label>
              <input
                type="text"
                value={formData.sub_business_name || ''}
                onChange={(e) =>
                  handleInputChange('sub_business_name', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.sub_business_name
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter sub-business name"
              />
              {errors.sub_business_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sub_business_name}
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
                placeholder="Enter business description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="e.g., Technology, Finance, Healthcare"
              />
            </div>

            {/* Parent Sub-Business */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Sub-Business
              </label>
              <select
                value={formData.parent_sub_business_id || ''}
                onChange={(e) =>
                  handleInputChange(
                    'parent_sub_business_id',
                    e.target.value || null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="">No Parent</option>
                {availableSubBusinesses.map((subBusiness) => (
                  <option key={subBusiness.id} value={subBusiness.id}>
                    {subBusiness.sub_business_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={formData.location_id || ''}
                onChange={(e) =>
                  handleInputChange('location_id', e.target.value || null)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="">No Location</option>
                {availableLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name} - {location.city},{' '}
                    {location.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Employees */}
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
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.max_employees ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50"
                min="1"
              />
              {errors.max_employees && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.max_employees}
                </p>
              )}
            </div>

            {/* Annual Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue
              </label>
              <input
                type="number"
                value={formData.annual_revenue || ''}
                onChange={(e) =>
                  handleInputChange(
                    'annual_revenue',
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="5000000"
                min="0"
              />
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <input
                type="number"
                value={formData.established_year || ''}
                onChange={(e) =>
                  handleInputChange(
                    'established_year',
                    parseInt(e.target.value) || new Date().getFullYear()
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder={new Date().getFullYear().toString()}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) =>
                  handleInputChange('contact_email', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@example.com"
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact_email}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone || ''}
                onChange={(e) =>
                  handleInputChange('contact_phone', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            {/* Is Active */}
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
                Active
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
                  : subBusiness
                  ? 'Update Sub-Business'
                  : 'Create Sub-Business'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
