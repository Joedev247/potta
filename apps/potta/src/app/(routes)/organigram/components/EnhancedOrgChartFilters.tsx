'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  IoFilter,
  IoClose,
  IoRefresh,
  IoChevronDown,
  IoChevronUp,
  IoLocation,
  IoBusiness,
  IoGlobe,
  IoPeople,
  IoCalendar,
  IoStatsChart,
  IoSettings,
  IoBookmark,
} from 'react-icons/io5';
import {
  OrgChartFilters,
  FilterPreset,
  Location,
  GeographicalUnit,
  SubBusiness,
  OrganizationalStructure,
} from '../types';
import { orgChartApi } from '../utils/api';

interface EnhancedOrgChartFiltersProps {
  filters: OrgChartFilters;
  onFiltersChange: (filters: OrgChartFilters) => void;
  viewMode: string;
  onViewModeChange?: (mode: string) => void;
}

export default function EnhancedOrgChartFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: EnhancedOrgChartFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [departments, setDepartments] = useState<OrganizationalStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string>('default');

  // Filter presets
  const filterPresets: FilterPreset[] = [
    {
      id: 'default',
      name: 'All Data',
      description: 'Show all organizational data',
      filters: {
        location: '',
        businessUnit: '',
        geographicalUnit: '',
        employeeStatus: 'all',
        showOnlyActive: false,
        showOnlyWithEmployees: false,
        viewDepth: 3,
        groupBy: 'none',
      },
      isDefault: true,
    },
    {
      id: 'active-only',
      name: 'Active Only',
      description: 'Show only active departments and employees',
      filters: {
        location: '',
        businessUnit: '',
        geographicalUnit: '',
        employeeStatus: 'active',
        showOnlyActive: true,
        showOnlyWithEmployees: true,
        viewDepth: 2,
        groupBy: 'business',
      },
    },
    {
      id: 'with-budget',
      name: 'With Budget',
      description: 'Show departments with budget allocation',
      filters: {
        location: '',
        businessUnit: '',
        geographicalUnit: '',
        showOnlyWithBudget: true,
        viewDepth: 2,
        groupBy: 'location',
      },
    },
    {
      id: 'management-view',
      name: 'Management View',
      description: 'High-level organizational structure',
      filters: {
        location: '',
        businessUnit: '',
        geographicalUnit: '',
        viewDepth: 1,
        groupBy: 'business',
      },
    },
  ];

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        const [locationsRes, geoUnitsRes, subBusinessesRes, structuresRes] =
          await Promise.all([
            orgChartApi.getLocations(),
            orgChartApi.getGeographicalUnits(),
            orgChartApi.getSubBusinesses(),
            orgChartApi.getStructures(),
          ]);

        setLocations(locationsRes.data || []);
        setGeographicalUnits(geoUnitsRes.data || []);
        setSubBusinesses(subBusinessesRes.data || []);
        setDepartments(structuresRes.data || []);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  const handleFilterChange = (key: keyof OrgChartFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePresetChange = (presetId: string) => {
    const preset = filterPresets.find((p) => p.id === presetId);
    if (preset) {
      setActivePreset(presetId);
      onFiltersChange(preset.filters);
    }
  };

  const clearAllFilters = () => {
    const defaultPreset = filterPresets.find((p) => p.isDefault);
    if (defaultPreset) {
      setActivePreset('default');
      onFiltersChange(defaultPreset.filters);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.businessUnit) count++;
    if (filters.geographicalUnit) count++;
    if (filters.department) count++;
    if (filters.employeeStatus && filters.employeeStatus !== 'all') count++;
    if (filters.structureType) count++;
    if (filters.dateRange?.start || filters.dateRange?.end) count++;
    if (filters.maxEmployees) count++;
    if (filters.budgetRange?.min || filters.budgetRange?.max) count++;
    if (filters.showOnlyActive) count++;
    if (filters.showOnlyWithEmployees) count++;
    if (filters.showOnlyWithBudget) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <IoFilter className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <IoRefresh className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <IoChevronUp className="w-5 h-5" />
            ) : (
              <IoChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Presets */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <IoBookmark className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Quick Filters
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetChange(preset.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                activePreset === preset.id
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoLocation className="w-4 h-4 mr-1" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Business Unit Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoBusiness className="w-4 h-4 mr-1" />
                Business Unit
              </label>
              <select
                value={filters.businessUnit}
                onChange={(e) =>
                  handleFilterChange('businessUnit', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">All Business Units</option>
                {subBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.sub_business_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Geographical Unit Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoGlobe className="w-4 h-4 mr-1" />
                Geographical Unit
              </label>
              <select
                value={filters.geographicalUnit}
                onChange={(e) =>
                  handleFilterChange('geographicalUnit', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoStatsChart className="w-4 h-4 mr-1" />
                Department
              </label>
              <select
                value={filters.department || ''}
                onChange={(e) =>
                  handleFilterChange('department', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoPeople className="w-4 h-4 mr-1" />
                Employee Status
              </label>
              <select
                value={filters.employeeStatus || 'all'}
                onChange={(e) =>
                  handleFilterChange('employeeStatus', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Employees</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* View Depth Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IoSettings className="w-4 h-4 mr-1" />
                View Depth
              </label>
              <select
                value={filters.viewDepth || 3}
                onChange={(e) =>
                  handleFilterChange('viewDepth', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Level 1 (Top Level)</option>
                <option value={2}>Level 2 (Mid Level)</option>
                <option value={3}>Level 3 (All Levels)</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Advanced Filters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Show Only Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnlyActive"
                  checked={filters.showOnlyActive || false}
                  onChange={(e) =>
                    handleFilterChange('showOnlyActive', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showOnlyActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show only active structures
                </label>
              </div>

              {/* Show Only With Employees */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnlyWithEmployees"
                  checked={filters.showOnlyWithEmployees || false}
                  onChange={(e) =>
                    handleFilterChange(
                      'showOnlyWithEmployees',
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showOnlyWithEmployees"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show only with employees
                </label>
              </div>

              {/* Show Only With Budget */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnlyWithBudget"
                  checked={filters.showOnlyWithBudget || false}
                  onChange={(e) =>
                    handleFilterChange('showOnlyWithBudget', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showOnlyWithBudget"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show only with budget
                </label>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.location && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Location:{' '}
                    {
                      locations.find((l) => l.id === filters.location)
                        ?.location_name
                    }
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.businessUnit && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Business:{' '}
                    {
                      subBusinesses.find((b) => b.id === filters.businessUnit)
                        ?.sub_business_name
                    }
                    <button
                      onClick={() => handleFilterChange('businessUnit', '')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.geographicalUnit && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Region:{' '}
                    {
                      geographicalUnits.find(
                        (g) => g.id === filters.geographicalUnit
                      )?.geo_unit_name
                    }
                    <button
                      onClick={() => handleFilterChange('geographicalUnit', '')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.employeeStatus && filters.employeeStatus !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Status: {filters.employeeStatus}
                    <button
                      onClick={() =>
                        handleFilterChange('employeeStatus', 'all')
                      }
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
