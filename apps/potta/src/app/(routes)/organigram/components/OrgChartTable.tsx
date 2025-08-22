'use client';

import { useMemo, useState } from 'react';
import { ViewMode, OrgChartNode } from '../types';
import DataGrid from '@potta/app/(routes)/account_receivables/invoice/components/DataGrid';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@potta/components/shadcn/dropdown';

interface OrgChartTableProps {
  data: OrgChartNode[];
  viewMode: ViewMode;
  onNodeClick: (node: OrgChartNode) => void;
  getLocationName?: (locationId: string) => string;
  getBusinessUnitName?: (businessUnitId: string) => string;
  getGeographicalUnitName?: (geoUnitId: string) => string;
  subBusinesses?: any[]; // Add subBusinesses prop
  geographicalUnits?: any[]; // Add geographicalUnits prop
}

export default function OrgChartTable({
  data,
  viewMode,
  onNodeClick,
  getLocationName,
  getBusinessUnitName,
  getGeographicalUnitName,
  subBusinesses = [],
  geographicalUnits = [],
}: OrgChartTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleToggleExpanded = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };
  const columns = [
    {
      accessorKey: 'expand',
      header: '',
      cell: ({ row }: { row: { original: OrgChartNode } }) => {
        const hasExpandedData = (row.original as any).expandedData?.length > 0;
        const isExpanded = expandedRows.has(row.original.id);

        if (!hasExpandedData) return null;

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpanded(row.original.id);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
        );
      },
    },
    {
      accessorKey: 'department_name',
      header: 'Department',
      cell: ({ row }: { row: { original: OrgChartNode } }) => {
        const isLevel1 = row.original.level === 1;
        const isLocationHeader = (row.original as any).isLocationHeader;
        const isBusinessHeader = (row.original as any).isBusinessHeader;
        const isGeoHeader = (row.original as any).isGeoHeader;
        const isMainLocation = (row.original as any).hasLevel1;
        const indentLevel =
          isLocationHeader || isBusinessHeader || isGeoHeader
            ? 0
            : row.original.level - 1;

        return (
          <div className="flex items-center space-x-2">
            <div
              className={`flex-1 ${
                isLocationHeader
                  ? isMainLocation
                    ? 'font-bold text-[#237804]'
                    : 'font-bold '
                  : isBusinessHeader
                  ? 'font-bold '
                  : isGeoHeader
                  ? 'font-bold '
                  : isLevel1
                  ? 'font-bold text-[#237804]'
                  : 'font-medium text-gray-900'
              }`}
              style={{ paddingLeft: `${indentLevel * 20}px` }}
            >
              {row.original.department_name || 'Unnamed Department'}
              {isLocationHeader && (
                <span
                  className={`ml-2 text-xs px-2 py-1 ${
                    isMainLocation ? 'bg-[#E6F4E6] text-[#237804]' : ''
                  }`}
                >
                  {isMainLocation ? 'Main Office' : 'Location'}
                </span>
              )}

              {isLevel1 &&
                !isLocationHeader &&
                !isBusinessHeader &&
                !isGeoHeader && (
                  <span className="ml-2 text-xs bg-[#E6F4E6] text-[#237804] px-2 py-1">
                    Level 1
                  </span>
                )}
            </div>
          </div>
        );
      },
    },

    ...(viewMode === 'location'
      ? [
          {
            accessorKey: 'location_id',
            header: 'Location',
            cell: ({ row }: { row: { original: OrgChartNode } }) => (
              <span className="text-sm text-gray-600">
                {getLocationName
                  ? getLocationName(row.original.location_id || '')
                  : row.original.location_id}
              </span>
            ),
          },
        ]
      : []),
    ...(viewMode === 'business'
      ? [
          {
            accessorKey: 'business_unit',
            header: 'Business Unit',
            cell: ({ row }: { row: { original: OrgChartNode } }) => {
              const primaryEmployee = row.original.employees.find(
                (emp) => emp.assignment_type === 'PRIMARY'
              );
              const businessUnitId = primaryEmployee?.sub_business_id || 'N/A';
              return (
                <span className="text-sm text-gray-600">
                  {getBusinessUnitName && businessUnitId !== 'N/A'
                    ? getBusinessUnitName(businessUnitId)
                    : businessUnitId}
                </span>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: 'employees',
      header: 'Employees',
      cell: ({ row }: { row: { original: OrgChartNode } }) => {
        const currentEmployees = row.original.current_employees || 0;
        const maxEmployees = row.original.max_employees || 0;
        const capacity =
          maxEmployees > 0
            ? Math.round((currentEmployees / maxEmployees) * 100)
            : 0;

        return (
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {currentEmployees}/{maxEmployees}
            </div>
            <div className="text-xs text-gray-500">{capacity}% capacity</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'departmentCount',
      header: 'Departments',
      cell: ({ row }: { row: { original: OrgChartNode } }) => {
        const departmentCount = (row.original as any).departmentCount || 0;
        return (
          <div className="text-center">
            <div className="font-medium text-gray-900">{departmentCount}</div>
            <div className="text-xs text-gray-500">departments</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }: { row: { original: OrgChartNode } }) => {
        const budget = row.original.budget;
        if (!budget || budget === 0) {
          return <span className="text-gray-500">N/A XAF</span>;
        }
        return (
          <span className="font-medium text-[#237804]">
            {budget.toLocaleString()} XAF
          </span>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: { row: { original: OrgChartNode } }) => (
        <span
          className={`px-2 py-1 text-xs font-medium ${
            row.original.is_active
              ? 'bg-[#E6F4E6] text-[#237804]'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: OrgChartNode } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 flex items-center justify-center">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNodeClick(row.original)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {row.original.children && row.original.children.length > 0 && (
              <DropdownMenuItem onClick={() => onNodeClick(row.original)}>
                <Users className="h-4 w-4 mr-2" />
                View Children ({row.original.children.length})
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => console.log('Edit:', row.original.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => console.log('Delete:', row.original.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const tableData = useMemo(() => {
    if (viewMode === 'location') {
      // For location view, show ONLY locations (no departments)
      const locationGroups = new Map<string, OrgChartNode[]>();

      // Group by location, but filter out level 0 and unknown locations
      data.forEach((node) => {
        // Skip level 0 entries and nodes without location_id
        if (
          node.level === 0 ||
          !node.location_id ||
          node.location_id === 'unknown'
        ) {
          return;
        }

        const locationId = node.location_id;
        if (!locationGroups.has(locationId)) {
          locationGroups.set(locationId, []);
        }
        locationGroups.get(locationId)!.push(node);
      });

      // Create table data with ONLY location headers (no departments)
      const result: any[] = [];
      locationGroups.forEach((structuresInLocation, locationId) => {
        // Skip if no valid structures in this location
        if (structuresInLocation.length === 0) {
          return;
        }

        // Calculate total budget and employees properly
        const totalBudget = structuresInLocation.reduce(
          (total, s) => total + (Number(s.budget) || 0),
          0
        );

        // Calculate total employees across all structures in this location
        const totalEmployees = structuresInLocation.reduce(
          (total, s) => total + (s.employees?.length || 0),
          0
        );

        // Check if this location has a level 1 department (main location)
        const hasLevel1 = structuresInLocation.some((s) => s.level === 1);

        // Add ONLY the location header (no departments)
        const locationName = getLocationName
          ? getLocationName(locationId)
          : locationId;

        result.push({
          id: `location-${locationId}`,
          department_name: locationName,
          level: 0,
          current_employees: totalEmployees,
          max_employees: structuresInLocation.reduce(
            (total, s) => total + (s.max_employees || 0),
            0
          ),
          budget: totalBudget,
          is_active: true,
          location_id: locationId,
          employees: structuresInLocation.flatMap((s) => s.employees || []),
          children: [],
          isLocationHeader: true,
          departmentCount: structuresInLocation.length,
          hasLevel1: hasLevel1, // Flag to identify main location
          expandedData: structuresInLocation, // Store departments for expansion
        });
      });

      // Sort locations: main location (with level 1) first, then others
      result.sort((a, b) => {
        if (a.hasLevel1 && !b.hasLevel1) return -1;
        if (!a.hasLevel1 && b.hasLevel1) return 1;
        return a.department_name.localeCompare(b.department_name);
      });

      return result;
    } else if (viewMode === 'business') {
      // For business unit view, group by sub-business
      const businessGroups = new Map<string, OrgChartNode[]>();

      data.forEach((node) => {
        // Find any employee with a business unit assignment (not just PRIMARY)
        const employeeWithBusinessUnit = node.employees?.find(
          (emp) => emp.sub_business_id && emp.sub_business_id !== 'unknown'
        );
        const businessUnitId =
          employeeWithBusinessUnit?.sub_business_id || 'unknown';

        if (!businessGroups.has(businessUnitId)) {
          businessGroups.set(businessUnitId, []);
        }
        businessGroups.get(businessUnitId)!.push(node);
      });

      // Create table data with business unit headers
      const result: any[] = [];
      businessGroups.forEach((structuresInBusiness, businessUnitId) => {
        if (structuresInBusiness.length === 0) return;

        // Skip "unknown" business units if they have no meaningful data
        if (businessUnitId === 'unknown') {
          const hasValidData = structuresInBusiness.some(
            (structure) => structure.employees && structure.employees.length > 0
          );
          if (!hasValidData) return;
        }

        const totalBudget = structuresInBusiness.reduce(
          (total, s) => total + (Number(s.budget) || 0),
          0
        );

        // Calculate total employees across all structures in this business unit
        const totalEmployees = structuresInBusiness.reduce(
          (total, s) => total + (s.employees?.length || 0),
          0
        );

        // Get business unit name from subBusinesses data
        const businessUnit = subBusinesses.find(
          (bus) => bus.id === businessUnitId
        );
        const businessUnitName = businessUnit
          ? businessUnit.sub_business_name || businessUnitId
          : businessUnitId === 'unknown'
          ? 'Unassigned'
          : businessUnitId;

        result.push({
          id: `business-${businessUnitId}`,
          department_name: businessUnitName,
          level: 0,
          current_employees: totalEmployees,
          max_employees: structuresInBusiness.reduce(
            (total, s) => total + (s.max_employees || 0),
            0
          ),
          budget: totalBudget,
          is_active: true,
          location_id: '',
          employees: structuresInBusiness.flatMap((s) => s.employees || []),
          children: [],
          isBusinessHeader: true,
          departmentCount: structuresInBusiness.length,
          expandedData: structuresInBusiness, // Store departments for expansion
        });
      });

      return result;
    } else if (viewMode === 'geographical') {
      // For geographical unit view, group by geographical unit
      const geoGroups = new Map<string, OrgChartNode[]>();

      data.forEach((node) => {
        // Find any employee with a geographical unit assignment (not just PRIMARY)
        const employeeWithGeoUnit = node.employees?.find(
          (emp) =>
            emp.geographical_unit_id && emp.geographical_unit_id !== 'unknown'
        );
        const geoUnitId =
          employeeWithGeoUnit?.geographical_unit_id || 'unknown';

        if (!geoGroups.has(geoUnitId)) {
          geoGroups.set(geoUnitId, []);
        }
        geoGroups.get(geoUnitId)!.push(node);
      });

      // Create table data with geographical unit headers
      const result: any[] = [];
      geoGroups.forEach((structuresInGeo, geoUnitId) => {
        if (structuresInGeo.length === 0) return;

        // Skip "unknown" geographical units if they have no meaningful data
        if (geoUnitId === 'unknown') {
          const hasValidData = structuresInGeo.some(
            (structure) => structure.employees && structure.employees.length > 0
          );
          if (!hasValidData) return;
        }

        const totalBudget = structuresInGeo.reduce(
          (total, s) => total + (Number(s.budget) || 0),
          0
        );

        // Calculate total employees across all structures in this geographical unit
        const totalEmployees = structuresInGeo.reduce(
          (total, s) => total + (s.employees?.length || 0),
          0
        );

        // Get geographical unit name from geographicalUnits data
        const geoUnit = geographicalUnits.find((geo) => geo.id === geoUnitId);
        const geoUnitName = geoUnit
          ? geoUnit.geo_unit_name || geoUnitId
          : geoUnitId === 'unknown'
          ? 'Unassigned'
          : geoUnitId;

        result.push({
          id: `geo-${geoUnitId}`,
          department_name: geoUnitName,
          level: 0,
          current_employees: totalEmployees,
          max_employees: structuresInGeo.reduce(
            (total, s) => total + (s.max_employees || 0),
            0
          ),
          budget: totalBudget,
          is_active: true,
          location_id: '',
          employees: structuresInGeo.flatMap((s) => s.employees || []),
          children: [],
          isGeoHeader: true,
          departmentCount: structuresInGeo.length,
          expandedData: structuresInGeo, // Store departments for expansion
        });
      });

      return result;
    } else {
      // For other views, sort data by level first, then by department name
      const sortedData = [...data].sort((a, b) => {
        if (a.level !== b.level) {
          return a.level - b.level;
        }
        return a.department_name.localeCompare(b.department_name);
      });

      return sortedData.map((node) => ({
        ...node,
        // Flatten the data for the table
        id: node.id,
        department_name: node.department_name,
        level: node.level,
        current_employees: node.employees?.length || 0,
        max_employees: node.max_employees,
        budget: node.budget,
        is_active: node.is_active,
        location_id: node.location_id,
        employees: node.employees || [],
        children: node.children,
        isLocationHeader: false,
        isBusinessHeader: false,
        isGeoHeader: false,
      }));
    }
  }, [
    data,
    viewMode,
    getLocationName,
    getBusinessUnitName,
    getGeographicalUnitName,
    subBusinesses,
    geographicalUnits,
  ]);

  // Create expanded data for DataGrid
  const expandedTableData = useMemo(() => {
    const result: any[] = [];

    tableData.forEach((row) => {
      // Add the main row
      result.push(row);

      // If this row is expanded, add its expanded content as separate rows
      if (expandedRows.has(row.id) && row.expandedData) {
        row.expandedData.forEach((dept: any) => {
          result.push({
            ...dept,
            id: `${row.id}-expanded-${dept.id}`,
            isExpandedRow: true,
            parentRow: row,
          });
        });
      }
    });

    return result;
  }, [tableData, expandedRows]);

  return (
    <div className="w-full">
      <DataGrid
        columns={columns}
        data={expandedTableData}
        onRowClick={(row) => {
          if (row.isExpandedRow) {
            onNodeClick(row);
          } else if (row.expandedData?.length > 0) {
            handleToggleExpanded(row.id);
          } else {
            onNodeClick(row);
          }
        }}
        showPagination={true}
      />
    </div>
  );
}
