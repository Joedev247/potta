'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { orgChartApi } from '../utils/api';
import { OrganizationalStructure, Location, SubBusiness } from '../types';

interface CreateDepartmentFormProps {
  onSubmit: (data: Partial<OrganizationalStructure>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateDepartmentForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateDepartmentFormProps) {
  const [availableStructures, setAvailableStructures] = useState<any[]>([]);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [availableSubBusinesses, setAvailableSubBusinesses] = useState<
    SubBusiness[]
  >([]);

  // Fetch available data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [structuresResult, locationsResult, subBusinessesResult] =
          await Promise.all([
            orgChartApi.getStructures(),
            orgChartApi.getLocations(),
            orgChartApi.getSubBusinesses(),
          ]);
        setAvailableStructures(structuresResult.data || []);
        setAvailableLocations(locationsResult.data || []);
        setAvailableSubBusinesses(subBusinessesResult.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parentStructureId = formData.get('parent_structure_id') as string;
    const locationId = formData.get('location_id') as string;
    const subBusinessUnitId = formData.get('sub_business_unit_id') as string;

    onSubmit({
      department_name: formData.get('department_name') as string,
      description: formData.get('description') as string,
      structure_type: formData.get('structure_type') as string,
      parent_structure_id: parentStructureId || undefined,
      location_id: locationId || undefined,
      sub_business_unit_id: subBusinessUnitId || undefined,
      max_employees: parseInt(formData.get('max_employees') as string) || 25,
      budget: parseInt(formData.get('budget') as string) || 500000,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department Name *
          </label>
          <input
            type="text"
            name="department_name"
            required
            minLength={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
            placeholder="Enter department name (e.g., Engineering, Marketing, HR)"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
            placeholder="Describe the department's purpose and responsibilities"
          />
        </div>

        {/* Structure Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Structure Type *
          </label>
          <select
            name="structure_type"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
          >
            <option value="">Select structure type</option>
            <option value="DIVISION">Division</option>
            <option value="DEPARTMENT">Department</option>
            <option value="UNIT">Unit</option>
            <option value="TEAM">Team</option>
            <option value="SECTION">Section</option>
            <option value="BRANCH">Branch</option>
            <option value="OFFICE">Office</option>
          </select>
        </div>

        {/* Parent Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Department
          </label>
          <select
            name="parent_structure_id"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
          >
            <option value="">No Parent (Root Department)</option>
            {availableStructures.map((structure) => (
              <option key={structure.id} value={structure.id}>
                {structure.department_name} ({structure.structure_type})
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <select
            name="location_id"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
          >
            <option value="">Select location</option>
            {availableLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name} - {location.city}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Business Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Unit (Optional)
          </label>
          <select
            name="sub_business_unit_id"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
          >
            <option value="">No Business Unit</option>
            {availableSubBusinesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.sub_business_name}
              </option>
            ))}
          </select>
        </div>

        {/* Max Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Employees
          </label>
          <input
            type="number"
            name="max_employees"
            min="1"
            defaultValue="25"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
            placeholder="25"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Budget (USD)
          </label>
          <input
            type="number"
            name="budget"
            min="0"
            defaultValue="500000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237804] focus:border-transparent"
            placeholder="500000"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-6 py-3 bg-[#237804] text-white rounded-lg hover:bg-[#1D6303] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Department'}
        </button>
      </div>
    </form>
  );
}
