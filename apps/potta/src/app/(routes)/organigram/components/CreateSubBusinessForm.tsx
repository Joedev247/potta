'use client';

import { useState, useEffect } from 'react';
import { SubBusiness } from '../types';
import { orgChartApi } from '../utils/api';

interface CreateSubBusinessFormProps {
  onSubmit: (data: Partial<SubBusiness>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateSubBusinessForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateSubBusinessFormProps) {
  const [availableSubBusinesses, setAvailableSubBusinesses] = useState<
    SubBusiness[]
  >([]);

  useEffect(() => {
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
    loadSubBusinesses();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      sub_business_name: formData.get('sub_business_name') as string,
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      parent_sub_business_id:
        (formData.get('parent_sub_business_id') as string) || undefined,
      max_employees: parseInt(formData.get('max_employees') as string) || 0,
      current_employees:
        parseInt(formData.get('current_employees') as string) || 0,
      annual_revenue: parseInt(formData.get('annual_revenue') as string) || 0,
      established_year:
        parseInt(formData.get('established_year') as string) ||
        new Date().getFullYear(),
      is_active: formData.get('is_active') === 'true',
      website: (formData.get('website') as string) || undefined,
      contact_email: (formData.get('contact_email') as string) || undefined,
      contact_phone: (formData.get('contact_phone') as string) || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-Business Name *
          </label>
          <input
            type="text"
            name="sub_business_name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter sub-business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="e.g., Technology, Finance, Healthcare"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Sub-Business
          </label>
          <select
            name="parent_sub_business_id"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
          >
            <option value="">No Parent (Root Level)</option>
            {availableSubBusinesses.map((subBusiness) => (
              <option key={subBusiness.id} value={subBusiness.id}>
                {subBusiness.sub_business_name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Employees
            </label>
            <input
              type="number"
              name="max_employees"
              min={0}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Employees
            </label>
            <input
              type="number"
              name="current_employees"
              min={0}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
              placeholder="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Revenue (XAF)
            </label>
            <input
              type="number"
              name="annual_revenue"
              min={0}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Established Year
            </label>
            <input
              type="number"
              name="established_year"
              min={1900}
              max={new Date().getFullYear()}
              defaultValue={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="https://example.com"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contact_phone"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
              placeholder="+237 123 456 789"
            />
          </div>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={true}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isCreating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] disabled:opacity-50"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Business Unit'}
        </button>
      </div>
    </form>
  );
}
