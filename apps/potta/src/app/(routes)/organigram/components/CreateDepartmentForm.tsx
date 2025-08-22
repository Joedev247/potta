'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { orgChartApi } from '../utils/api';
import { OrganizationalStructure, Location } from '../types';

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

  // Fetch available structures and locations for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [structuresResult, locationsResult] = await Promise.all([
          orgChartApi.getStructures(),
          orgChartApi.getLocations(),
        ]);
        setAvailableStructures(structuresResult.data || []);
        setAvailableLocations(locationsResult.data || []);
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

    onSubmit({
      department_name: formData.get('department_name') as string,
      description: formData.get('description') as string,
      structure_type: formData.get('structure_type') as string,
      parent_structure_id: parentStructureId || undefined,
      location_id: locationId || undefined,
      max_employees: parseInt(formData.get('max_employees') as string) || 25,
      current_employees:
        parseInt(formData.get('current_employees') as string) || 0,
      budget: parseInt(formData.get('budget') as string) || 500000,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Name *
          </label>
          <input
            type="text"
            name="department_name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter department name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Department
          </label>
          <select
            name="parent_structure_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          >
            <option value="">No Parent (Root Department)</option>
            {availableStructures.map((structure) => (
              <option key={structure.id} value={structure.id}>
                {structure.department_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <select
            name="location_id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          >
            <option value="">Select a location</option>
            {availableLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name} - {location.city}, {location.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Department description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Structure Type
          </label>
          <select
            name="structure_type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          >
            <option value="STANDARD_OFFICE">Standard Office</option>
            <option value="TECH_STARTUP">Tech Startup</option>
            <option value="REGIONAL_OFFICE">Regional Office</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Employees
          </label>
          <input
            type="number"
            name="max_employees"
            defaultValue={25}
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Employees
          </label>
          <input
            type="number"
            name="current_employees"
            defaultValue={0}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget (XAF)
          </label>
          <input
            type="number"
            name="budget"
            defaultValue={500000}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
          />
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
          {isCreating ? 'Creating...' : 'Create Department'}
        </button>
      </div>
    </form>
  );
}
