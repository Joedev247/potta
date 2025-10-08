'use client';

import { useState, useEffect } from 'react';
import {
  IoSearch,
  IoBusiness,
  IoGlobe,
  IoStatsChart,
  IoPeople,
} from 'react-icons/io5';
import {
  ViewMode,
  OrgChartFilters,
  Location,
  GeographicalUnit,
  SubBusiness,
} from '../types';
import { orgChartApi } from '../utils/api';

interface OrgChartControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: OrgChartFilters;
  onFiltersChange: (filters: OrgChartFilters) => void;
  organizationId: string;
}

export default function OrgChartControls({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  organizationId,
}: OrgChartControlsProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        const [locationsRes, geoUnitsRes, subBusinessesRes] = await Promise.all(
          [
            orgChartApi.getLocations(organizationId),
            orgChartApi.getGeographicalUnits(organizationId),
            orgChartApi.getSubBusinesses(organizationId),
          ]
        );

        setLocations(locationsRes.data || []);
        setGeographicalUnits(geoUnitsRes.data || []);
        setSubBusinesses(subBusinessesRes.data || []);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  const handleFilterChange = (key: keyof OrgChartFilters, value: string) => {
    onFiltersChange({
      ...selectedFilters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* View Mode Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex bg-gray-100  p-1">
            {[
              { key: 'general', label: 'General', icon: IoBusiness },
              { key: 'geographical', label: 'Geographical', icon: IoGlobe },
              { key: 'business', label: 'Business', icon: IoBusiness },
              {
                key: 'organizational',
                label: 'Departments',
                icon: IoStatsChart,
              },
              { key: 'employees', label: 'Employees', icon: IoPeople },
            ].map((mode) => {
              const IconComponent = mode.icon;
              return (
                <button
                  key={mode.key}
                  onClick={() => onViewModeChange(mode.key as ViewMode)}
                  className={`px-3 py-1 text-sm font-medium transition-colors flex items-center space-x-1 ${
                    viewMode === mode.key
                      ? 'bg-white text-[#237804] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search departments, employees..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Location Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              disabled={loading}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </div>

          {/* Geographical Unit Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedFilters.geographicalUnit}
              onChange={(e) =>
                handleFilterChange('geographicalUnit', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              disabled={loading}
            >
              <option value="">All Regions</option>
              {geographicalUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.geo_unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedFilters.location ||
        selectedFilters.businessUnit ||
        selectedFilters.geographicalUnit) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Active Filters:
            </span>
            {selectedFilters.location && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E6F4E6] text-[#237804]">
                Location:{' '}
                {
                  locations.find((l) => l.id === selectedFilters.location)
                    ?.location_name
                }
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="ml-1 text-[#237804] hover:text-[#1D6303]"
                >
                  ×
                </button>
              </span>
            )}
            {selectedFilters.businessUnit && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F3FCE9] text-[#548F2B]">
                Business:{' '}
                {
                  subBusinesses.find(
                    (b) => b.id === selectedFilters.businessUnit
                  )?.sub_business_name
                }
                <button
                  onClick={() => handleFilterChange('businessUnit', '')}
                  className="ml-1 text-[#548F2B] hover:text-[#3A621E]"
                >
                  ×
                </button>
              </span>
            )}
            {selectedFilters.geographicalUnit && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E6F4E6] text-[#237804]">
                Region:{' '}
                {
                  geographicalUnits.find(
                    (g) => g.id === selectedFilters.geographicalUnit
                  )?.geo_unit_name
                }
                <button
                  onClick={() => handleFilterChange('geographicalUnit', '')}
                  className="ml-1 text-[#237804] hover:text-[#1D6303]"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() =>
                onFiltersChange({
                  location: '',
                  businessUnit: '',
                  geographicalUnit: '',
                })
              }
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
