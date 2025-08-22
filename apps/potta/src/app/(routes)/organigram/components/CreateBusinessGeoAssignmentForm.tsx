'use client';

import { useState, useEffect } from 'react';
import { BusinessGeoAssignment, SubBusiness, GeographicalUnit } from '../types';
import { orgChartApi } from '../utils/api';

interface CreateBusinessGeoAssignmentFormProps {
  onSubmit: (data: Partial<BusinessGeoAssignment>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateBusinessGeoAssignmentForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateBusinessGeoAssignmentFormProps) {
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating business-geo assignment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sub-Business */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub-Business *
        </label>
        <select
          value={formData.sub_business_id || ''}
          onChange={(e) => handleInputChange('sub_business_id', e.target.value)}
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
          <p className="mt-1 text-sm text-red-600">{errors.sub_business_id}</p>
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
            errors.geographical_unit_id ? 'border-red-500' : 'border-gray-300'
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
          onChange={(e) => handleInputChange('operation_type', e.target.value)}
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
          <p className="mt-1 text-sm text-red-600">{errors.operation_type}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the business operation in this geographical area"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
              errors.start_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
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
              handleInputChange('employee_count', parseInt(e.target.value) || 0)
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
              handleInputChange('annual_revenue', parseInt(e.target.value) || 0)
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
          onChange={(e) => handleInputChange('contact_person', e.target.value)}
          className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
            errors.contact_person ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full name of contact person"
        />
        {errors.contact_person && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>
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
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
            className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
              errors.contact_email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@example.com"
          />
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contact_phone || ''}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
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
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          disabled={isCreating}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 text-sm font-medium text-white bg-[#237804] hover:bg-[#1D6303] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? 'Creating...' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
}
