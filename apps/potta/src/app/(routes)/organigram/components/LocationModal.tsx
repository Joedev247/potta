'use client';

import { useState, useEffect } from 'react';
import { IoClose, IoLocation, IoSearch } from 'react-icons/io5';
import { GeographicalUnit, Location } from '../types';
import { orgChartApi } from '../utils/api';
import { cleanFormData } from '../utils/formUtils';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSave: (location: Partial<Location>) => void;
  mode?: 'create' | 'edit'; // Add mode prop to distinguish create vs edit
  parentGeographicalUnit?: GeographicalUnit | null; // Add parent geographical unit prop
}

export default function LocationModal({
  isOpen,
  onClose,
  location,
  onSave,
  mode = 'edit', // Default to edit mode
  parentGeographicalUnit,
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
    geo_unit_id: '',
    organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399', // Default org ID
  });

  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);

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
          geo_unit_id: parentGeographicalUnit?.id || '',
          organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399', // Default org ID
        });
      }
      setErrors({});
    }
  }, [isOpen, location, parentGeographicalUnit]);

  // Load geographical units for the dropdown
  useEffect(() => {
    const loadGeographicalUnits = async () => {
      try {
        const response = await orgChartApi.getGeographicalUnits();
        setGeographicalUnits(response.data);
      } catch (error) {
        console.error('Error loading geographical units:', error);
      }
    };

    if (isOpen) {
      loadGeographicalUnits();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Geocoding function to get coordinates from address
  const getCoordinatesFromAddress = async () => {
    const { address, city, state, country, postal_code } = formData;

    if (!address || !city || !country) {
      setErrors((prev) => ({
        ...prev,
        geocoding: 'Please enter address, city, and country to get coordinates',
      }));
      return;
    }

    setGeocodingLoading(true);
    setErrors((prev) => ({ ...prev, geocoding: '' }));

    try {
      // Build the full address string
      const fullAddress = [address, city, state, postal_code, country]
        .filter(Boolean)
        .join(', ');

      // Use a free geocoding service (Nominatim/OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));

        // Show success message
        setErrors((prev) => ({
          ...prev,
          geocoding: '✅ Coordinates found successfully!',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          geocoding:
            '❌ Could not find coordinates for this address. Please check the address and try again.',
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setErrors((prev) => ({
        ...prev,
        geocoding:
          '❌ Error getting coordinates. Please try again or enter manually.',
      }));
    } finally {
      setGeocodingLoading(false);
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

    // Check if coordinates are set
    if (formData.latitude === 0 && formData.longitude === 0) {
      newErrors.coordinates = 'Please get coordinates for this location';
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
      // Filter out empty values before sending
      const cleanedData = cleanFormData(formData);

      await onSave(cleanedData);
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
              {mode === 'create' ? 'Create New Location' : 'Edit Location'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
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

            {/* Get Coordinates Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Coordinates
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={getCoordinatesFromAddress}
                  disabled={
                    geocodingLoading ||
                    !formData.address ||
                    !formData.city ||
                    !formData.country
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors "
                >
                  <IoSearch className="w-4 h-4" />
                  <span>
                    {geocodingLoading
                      ? 'Getting Coordinates...'
                      : 'Get Coordinates'}
                  </span>
                </button>

                {formData.latitude &&
                  formData.longitude &&
                  formData.latitude !== 0 &&
                  formData.longitude !== 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <IoLocation className="w-4 h-4 text-green-600" />
                      <span>
                        {formData.latitude.toFixed(6)},{' '}
                        {formData.longitude.toFixed(6)}
                      </span>
                    </div>
                  )}
              </div>

              {errors.geocoding && (
                <p
                  className={`mt-1 text-sm ${
                    errors.geocoding.includes('✅')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {errors.geocoding}
                </p>
              )}

              {errors.coordinates && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.coordinates}
                </p>
              )}
            </div>

            {/* Geographical Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographical Unit
              </label>
              <select
                value={formData.geo_unit_id || ''}
                onChange={(e) =>
                  handleInputChange('geo_unit_id', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="">Select a geographical unit</option>
                {geographicalUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.geo_unit_name}
                  </option>
                ))}
              </select>
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
                  : mode === 'create'
                  ? 'Create Location'
                  : 'Update Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
