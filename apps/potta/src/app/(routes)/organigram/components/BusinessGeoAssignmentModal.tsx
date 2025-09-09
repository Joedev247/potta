'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { BusinessGeoAssignment, SubBusiness, GeographicalUnit } from '../types';
import { orgChartApi } from '../utils/api';

interface BusinessGeoAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessGeoAssignment?: BusinessGeoAssignment | null;
  onSave: (businessGeoAssignment: Partial<BusinessGeoAssignment>) => void;
}

export default function BusinessGeoAssignmentModal({
  isOpen,
  onClose,
  businessGeoAssignment,
  onSave,
}: BusinessGeoAssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<BusinessGeoAssignment>>({
    sub_business_id: '',
    geographical_unit_id: '',
    organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
    operation_type: 'Regional Office',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    employee_count: 0,
    annual_revenue: 0,
    market_share_percentage: 0,
    contact_person: '',
    contact_email: '',
    contact_phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (businessGeoAssignment) {
        setFormData(businessGeoAssignment);
      } else {
        setFormData({
          sub_business_id: '',
          geographical_unit_id: '',
          organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
          operation_type: 'Regional Office',
          description: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          is_active: true,
          employee_count: 0,
          annual_revenue: 0,
          market_share_percentage: 0,
          contact_person: '',
          contact_email: '',
          contact_phone: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, businessGeoAssignment]);

  const loadData = async () => {
    try {
      setDataLoading(true);

      const [subBusinessesRes, geoUnitsRes] = await Promise.all([
        orgChartApi.getSubBusinesses(),
        orgChartApi.getGeographicalUnits(),
      ]);

      const subBusinessesData = Array.isArray(subBusinessesRes.data)
        ? subBusinessesRes.data
        : (subBusinessesRes.data as any)?.data || [];

      const geoUnitsData = Array.isArray(geoUnitsRes.data)
        ? geoUnitsRes.data
        : (geoUnitsRes.data as any)?.data || [];

      setSubBusinesses(subBusinessesData);
      setGeographicalUnits(geoUnitsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
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

    if (!formData.sub_business_id?.trim()) {
      newErrors.sub_business_id = 'Sub-business is required';
    }

    if (!formData.geographical_unit_id?.trim()) {
      newErrors.geographical_unit_id = 'Geographical unit is required';
    }

    if (!formData.operation_type?.trim()) {
      newErrors.operation_type = 'Operation type is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.start_date?.trim()) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.contact_person?.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    if (!formData.contact_email?.trim()) {
      newErrors.contact_email = 'Contact email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to clean form data by removing empty strings and null values
  const cleanFormData = (data: any): any => {
    const cleaned: any = {};

    Object.entries(data).forEach(([key, value]) => {
      // Only include the field if it has a meaningful value
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value;
      }
    });

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Clean the form data to remove empty strings and null values
      const cleanedFormData = cleanFormData(formData);
      await onSave(cleanedFormData);
      onClose();
    } catch (error) {
      console.error('Error saving business-geo assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {dataLoading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700">
              Loading data...
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {businessGeoAssignment
                ? 'Edit Business-Geo Assignment'
                : 'Add New Business-Geo Assignment'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sub-Business */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Business *
              </label>
              <select
                value={formData.sub_business_id || ''}
                onChange={(e) =>
                  handleInputChange('sub_business_id', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.sub_business_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a sub-business</option>
                {subBusinesses.length > 0 ? (
                  subBusinesses.map((subBusiness) => (
                    <option key={subBusiness.id} value={subBusiness.id}>
                      {subBusiness.sub_business_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No sub-businesses available
                  </option>
                )}
              </select>
              {errors.sub_business_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sub_business_id}
                </p>
              )}
            </div>

            {/* Geographical Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographical Unit *
              </label>
              <select
                value={formData.geographical_unit_id || ''}
                onChange={(e) =>
                  handleInputChange('geographical_unit_id', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.geographical_unit_id
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select a geographical unit</option>
                {geographicalUnits.length > 0 ? (
                  geographicalUnits.map((geoUnit) => (
                    <option key={geoUnit.id} value={geoUnit.id}>
                      {geoUnit.geo_unit_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No geographical units available
                  </option>
                )}
              </select>
              {errors.geographical_unit_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.geographical_unit_id}
                </p>
              )}
            </div>

            {/* Operation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Type *
              </label>
              <select
                value={formData.operation_type || ''}
                onChange={(e) =>
                  handleInputChange('operation_type', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.operation_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select operation type</option>
                <option value="Regional Office">Regional Office</option>
                <option value="Branch Office">Branch Office</option>
                <option value="Sales Office">Sales Office</option>
                <option value="Service Center">Service Center</option>
                <option value="Distribution Center">Distribution Center</option>
              </select>
              {errors.operation_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.operation_type}
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
                placeholder="Describe the business operation in this geographical area"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) =>
                    handleInputChange('start_date', e.target.value)
                  }
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.start_date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) =>
                    handleInputChange('end_date', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                />
              </div>
            </div>

            {/* Business Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Count
                </label>
                <input
                  type="number"
                  value={formData.employee_count || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'employee_count',
                      parseInt(e.target.value) || 0
                    )
                  }
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue (XAF)
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
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Share (%)
                </label>
                <input
                  type="number"
                  value={formData.market_share_percentage || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'market_share_percentage',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={100}
                  step={0.1}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contact_person || ''}
                onChange={(e) =>
                  handleInputChange('contact_person', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.contact_person ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full name of contact person"
              />
              {errors.contact_person && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact_person}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
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
                  placeholder="+237 123 456 789"
                />
              </div>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) =>
                    handleInputChange('is_active', e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
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
                  : businessGeoAssignment
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
