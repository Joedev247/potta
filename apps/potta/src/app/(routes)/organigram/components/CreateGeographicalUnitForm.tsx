'use client';

import { useState, useEffect } from 'react';
import { GeographicalUnit } from '../types';
import { orgChartApi } from '../utils/api';

interface CreateGeographicalUnitFormProps {
  onSubmit: (data: Partial<GeographicalUnit>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateGeographicalUnitForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateGeographicalUnitFormProps) {
  const [availableGeoUnits, setAvailableGeoUnits] = useState<
    GeographicalUnit[]
  >([]);

  useEffect(() => {
    const loadGeoUnits = async () => {
      try {
        const response = await orgChartApi.getGeographicalUnits();
        const geoUnitsData = Array.isArray(response.data)
          ? response.data
          : (response.data as any)?.data || [];
        setAvailableGeoUnits(geoUnitsData);
      } catch (error) {
        console.error('Error loading geographical units:', error);
      }
    };
    loadGeoUnits();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      geo_unit_name: formData.get('geo_unit_name') as string,
      description: formData.get('description') as string,
      parent_geo_unit_id:
        (formData.get('parent_geo_unit_id') as string) || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Geographical Unit Name *
          </label>
          <input
            type="text"
            name="geo_unit_name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter geographical unit name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Geographical Unit
          </label>
          <select
            name="parent_geo_unit_id"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
          >
            <option value="">No Parent (Root Level)</option>
            {availableGeoUnits.map((geoUnit) => (
              <option key={geoUnit.id} value={geoUnit.id}>
                {geoUnit.geo_unit_name}
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
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter description"
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
          {isCreating ? 'Creating...' : 'Create Geographical Unit'}
        </button>
      </div>
    </form>
  );
}
