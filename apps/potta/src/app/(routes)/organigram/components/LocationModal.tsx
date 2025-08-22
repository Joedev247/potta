'use client';

import { useState, useEffect } from 'react';
import { Location } from '../types';
import { orgChartApi } from '../utils/api';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSave: (location: Partial<Location>) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  location,
  onSave,
}: LocationModalProps) {
  const [formData, setFormData] = useState<Partial<Location>>({
    location_name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    email: '',
    website: '',
    description: '',
    capacity: 0,
    organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (location) {
        setFormData(location);
      } else {
        setFormData({
          location_name: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postal_code: '',
          latitude: 0,
          longitude: 0,
          phone: '',
          email: '',
          website: '',
          description: '',
          capacity: 0,
          organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
        });
      }
      setErrors({});
    }
  }, [isOpen, location]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.location_name?.trim()) {
      newErrors.location_name = 'Location name is required';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (formData.latitude === undefined || formData.latitude === null) {
      newErrors.latitude = 'Latitude is required';
    }

    if (formData.longitude === undefined || formData.longitude === null) {
      newErrors.longitude = 'Longitude is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
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
      console.error('Error saving location:', error);
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
              {location ? 'Edit Location' : 'Add New Location'}
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
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name *
              </label>
              <input
                type="text"
                value={formData.location_name || ''}
                onChange={(e) =>
                  handleInputChange('location_name', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.location_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter location name"
              />
              {errors.location_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location_name}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                  placeholder="State/Province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Country"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postal_code || ''}
                onChange={(e) =>
                  handleInputChange('postal_code', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="Postal Code"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Enter the geographical coordinates for this location. You can
                find coordinates using Google Maps or other mapping services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'latitude',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.0000"
                  />
                  {errors.latitude && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.latitude}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'longitude',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.0000"
                  />
                  {errors.longitude && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.longitude}
                    </p>
                  )}
                </div>
              </div>
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
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="Enter location description"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) =>
                  handleInputChange('capacity', parseInt(e.target.value) || 0)
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="0"
              />
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
                  : location
                  ? 'Update Location'
                  : 'Create Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
