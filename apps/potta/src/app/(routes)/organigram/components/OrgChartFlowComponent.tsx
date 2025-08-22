'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ViewMode,
  OrgChartFilters,
  OrganizationalStructure,
  UserAssignment,
  Location,
  SubBusiness,
  GeographicalUnit,
} from '../types';
import { orgChartApi } from '../utils/api';
import OrgChartTable from './OrgChartTable';
import { CustomOrgEdge } from './CustomOrgEdge';
import { toast } from 'react-hot-toast';

// Define edgeTypes outside component to prevent React Flow warnings
const edgeTypes = {
  orgEdge: CustomOrgEdge,
};

interface OrgChartFlowComponentProps {
  viewMode: ViewMode;
  searchTerm: string;
  filters: OrgChartFilters;
}

export default function OrgChartFlowComponent({
  viewMode,
  searchTerm,
  filters,
}: OrgChartFlowComponentProps) {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStructure, setSelectedStructure] =
    useState<OrganizationalStructure | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          structuresRes,
          assignmentsRes,
          locationsRes,
          subBusinessesRes,
          geoUnitsRes,
          templatesRes,
        ] = await Promise.all([
          orgChartApi.getStructures(),
          orgChartApi.getAssignments(),
          orgChartApi.getLocations(),
          orgChartApi.getSubBusinesses(),
          orgChartApi.getGeographicalUnits(),
          orgChartApi.getTemplates(),
        ]);

        const structuresData = Array.isArray(structuresRes.data)
          ? structuresRes.data
          : (structuresRes.data as any)?.data || [];

        const assignmentsData = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : (assignmentsRes.data as any)?.data || [];

        const locationsData = Array.isArray(locationsRes.data)
          ? locationsRes.data
          : (locationsRes.data as any)?.data || [];

        const subBusinessesData = Array.isArray(subBusinessesRes.data)
          ? subBusinessesRes.data
          : (subBusinessesRes.data as any)?.data || [];

        const geoUnitsData = Array.isArray(geoUnitsRes.data)
          ? geoUnitsRes.data
          : (geoUnitsRes.data as any)?.data || [];

        const templatesData = Array.isArray(templatesRes.data)
          ? templatesRes.data
          : (templatesRes.data as any)?.data || [];

        setStructures(structuresData);
        setAssignments(assignmentsData);
        setLocations(locationsData);
        setSubBusinesses(subBusinessesData);
        setGeographicalUnits(geoUnitsData);
        setTemplates(templatesData);

        // Debug logging
        console.log('=== ORG CHART DEBUG ===');
        console.log('Structures:', structuresData);
        console.log('Assignments:', assignmentsData);
        console.log('Locations:', locationsData);
        console.log('Sub-Businesses:', subBusinessesData);
        console.log('Geographical Units:', geoUnitsData);
        console.log('Templates:', templatesData);
        console.log('Total structures:', structuresData.length);
        console.log('Total assignments:', assignmentsData.length);
        console.log('Total locations:', locationsData.length);
        console.log('Total sub-businesses:', subBusinessesData.length);
        console.log('Total geo units:', geoUnitsData.length);
        console.log('Total templates:', templatesData.length);

        // Enhanced logging with user context
        console.log('=== ENHANCED USER CONTEXT ===');
        for (const assignment of assignmentsData.slice(0, 3)) {
          // Log first 3 assignments
          try {
            const userContext = await orgChartApi.getFullUserContext(
              assignment.user_id
            );
            console.log(
              `User ${assignment.user_id} context:`,
              userContext.data
            );
          } catch (err) {
            console.log(
              `Could not load context for user ${assignment.user_id}:`,
              err
            );
          }
        }

        // Log employees per structure with enhanced data
        structuresData.forEach((structure: OrganizationalStructure) => {
          const structureEmployees = assignmentsData.filter(
            (assignment: UserAssignment) =>
              assignment.organizational_structure_id === structure.id
          );
          console.log(
            `Structure "${structure.department_name}" (${structure.id}):`,
            {
              level: structure.level,
              location_id: structure.location_id,
              location_name: structure.location_id
                ? getLocationName(structure.location_id)
                : 'N/A',
              employees: structureEmployees,
              employeeCount: structureEmployees.length,
              business_units: structureEmployees.map((emp: UserAssignment) => ({
                id: emp.sub_business_id,
                name: emp.sub_business_id
                  ? getBusinessUnitName(emp.sub_business_id)
                  : 'N/A',
              })),
            }
          );
        });

        // Log location and business unit mappings
        console.log('=== LOCATION MAPPINGS ===');
        locationsData.forEach((location: Location) => {
          console.log(
            `Location ID: ${location.id} -> Name: ${location.location_name}`
          );
        });

        console.log('=== BUSINESS UNIT MAPPINGS ===');
        subBusinessesData.forEach((business: SubBusiness) => {
          console.log(
            `Business ID: ${business.id} -> Name: ${business.sub_business_name}`
          );
        });

        console.log('=== GEOGRAPHICAL UNITS ===');
        geoUnitsData.forEach((geoUnit: any) => {
          console.log(
            `Geo Unit ID: ${geoUnit.id} -> Name: ${geoUnit.unit_name}`
          );
        });

        console.log('=== TEMPLATES ===');
        templatesData.forEach((template: any) => {
          console.log(
            `Template ID: ${template.id} -> Name: ${template.template_name}`
          );
        });

        console.log('=== END DEBUG ===');
      } catch (err) {
        console.error('Error loading org chart data:', err);
        setError('Failed to load organizational data. Please try again.');
        toast.error('Failed to load organizational data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to get location name by ID
  const getLocationName = useCallback(
    (locationId: string) => {
      const location = locations.find((loc) => loc.id === locationId);
      return location ? location.location_name : locationId;
    },
    [locations]
  );

  // Helper function to get business unit name by ID
  const getBusinessUnitName = useCallback(
    (businessUnitId: string) => {
      const businessUnit = subBusinesses.find(
        (bus) => bus.id === businessUnitId
      );
      return businessUnit ? businessUnit.sub_business_name : businessUnitId;
    },
    [subBusinesses]
  );

  // Helper function to get geographical unit name by ID
  const getGeographicalUnitName = useCallback(
    (geoUnitId: string) => {
      const geoUnit = geographicalUnits.find((geo) => geo.id === geoUnitId);
      return geoUnit ? geoUnit.geo_unit_name : geoUnitId;
    },
    [geographicalUnits]
  );

  // Convert data to React Flow format
  const { nodes, edges } = useMemo(() => {
    if (!structures.length) return { nodes: [], edges: [] };

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // Handle different view modes
    if (viewMode === 'hierarchy') {
      // Find root structure (level 1)
      const rootStructure = structures.find((s) => s.level === 1);

      if (rootStructure) {
        // Add root node
        const rootEmployees = assignments.filter(
          (assignment) =>
            assignment.organizational_structure_id === rootStructure.id
        );

        flowNodes.push({
          id: rootStructure.id,
          type: 'default',
          position: { x: 0, y: 0 },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-bold text-[#237804] text-sm">
                  {rootStructure.department_name}
                </div>
                <div className="text-gray-600 text-xs">
                  {rootEmployees.length} employee
                  {rootEmployees.length !== 1 ? 's' : ''}
                </div>
                {rootEmployees.length > 0 && (
                  <div className="text-gray-500 text-xs mt-1">
                    {rootEmployees.slice(0, 2).map((emp, idx) => (
                      <div key={idx} className="text-xs">
                        • {emp.job_title || 'Employee'}
                        {emp.assignment_type && ` (${emp.assignment_type})`}
                      </div>
                    ))}
                    {rootEmployees.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{rootEmployees.length - 2} more
                      </div>
                    )}
                  </div>
                )}
                <div className="text-gray-500 text-xs">CEO</div>
              </div>
            ),
            // Store original structure data for table view
            originalData: {
              ...rootStructure,
              employees: rootEmployees,
              children: [],
            },
          },
          style: {
            background: '#F0F9FF',
            border: '2px solid #237804',
            borderRadius: '8px',
            minWidth: '180px',
          },
        });

        // Get all structures (not just level 2)
        const allStructures = structures.filter((s) => s.level > 1);

        // Calculate positions for balanced tree layout
        const totalWidth = allStructures.length * 250; // 250px spacing between nodes
        const startX = -totalWidth / 2; // Start from left to center the tree

        allStructures.forEach((structure, index) => {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          // Calculate x position for balanced distribution
          const x = startX + index * 250;
          const y = structure.level * 150; // Position based on level

          flowNodes.push({
            id: structure.id,
            type: 'default',
            position: { x, y },
            data: {
              label: (
                <div className="text-center p-2">
                  <div
                    className={`font-semibold text-sm ${
                      structure.level === 2
                        ? 'text-[#548F2B]'
                        : structure.level === 3
                        ? 'text-[#65A30D]'
                        : 'text-[#84CC16]'
                    }`}
                  >
                    {structure.department_name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nodeEmployees.length} employee
                    {nodeEmployees.length !== 1 ? 's' : ''}
                  </div>
                  {nodeEmployees.length > 0 && (
                    <div className="text-gray-500 text-xs mt-1">
                      {nodeEmployees.slice(0, 2).map((emp, idx) => (
                        <div key={idx} className="text-xs">
                          • {emp.job_title || 'Employee'}
                          {emp.assignment_type && ` (${emp.assignment_type})`}
                        </div>
                      ))}
                      {nodeEmployees.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{nodeEmployees.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-gray-500 text-xs">
                    Level {structure.level}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Budget: {(structure.budget || 0).toLocaleString()} XAF
                  </div>
                </div>
              ),
              // Store original structure data for table view
              originalData: {
                ...structure,
                employees: nodeEmployees,
                children: [],
              },
            },
            style: {
              background:
                structure.level === 2
                  ? '#F0FDF4'
                  : structure.level === 3
                  ? '#F7FEE7'
                  : '#FAFAFA',
              border: `2px solid ${
                structure.level === 2
                  ? '#548F2B'
                  : structure.level === 3
                  ? '#65A30D'
                  : '#84CC16'
              }`,
              borderRadius: '8px',
              minWidth: '180px',
              maxWidth: '220px',
            },
          });

          // Add edge from parent to this department
          if (structure.parent_structure_id) {
            flowEdges.push({
              id: `${structure.parent_structure_id}-${structure.id}`,
              source: structure.parent_structure_id,
              target: structure.id,
              type: 'orgEdge',
            });
          } else {
            // If no parent, connect to root
            flowEdges.push({
              id: `${rootStructure.id}-${structure.id}`,
              source: rootStructure.id,
              target: structure.id,
              type: 'orgEdge',
            });
          }
        });
      } else {
        // Fallback: create virtual root
        const virtualRootId = 'virtual-root';

        flowNodes.push({
          id: virtualRootId,
          type: 'default',
          position: { x: 0, y: 0 },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-medium text-gray-500 text-sm">
                  Organization
                </div>
                <div className="text-gray-400 text-xs">Virtual Root</div>
              </div>
            ),
            // Store original structure data for table view
            originalData: {
              id: virtualRootId,
              department_name: 'Organization',
              level: 0,
              current_employees: 0,
              max_employees: 0,
              budget: 0,
              is_active: true,
              location_id: '',
              employees: [],
              children: [],
            },
          },
          style: {
            background: '#F9FAFB',
            border: '2px solid #9CA3AF',
            borderRadius: '8px',
            minWidth: '180px',
          },
        });

        // Calculate positions for balanced tree layout
        const totalWidth = structures.length * 250;
        const startX = -totalWidth / 2;

        structures.forEach((structure, index) => {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          // Calculate x position for balanced distribution
          const x = startX + index * 250;

          flowNodes.push({
            id: structure.id,
            type: 'default',
            position: { x, y: 150 },
            data: {
              label: (
                <div className="text-center p-2">
                  <div className="font-semibold text-[#548F2B] text-sm">
                    {structure.department_name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nodeEmployees.length} employee
                    {nodeEmployees.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Level {structure.level}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Budget: {(structure.budget || 0).toLocaleString()} XAF
                  </div>
                </div>
              ),
              // Store original structure data for table view
              originalData: {
                ...structure,
                employees: nodeEmployees,
                children: [],
              },
            },
            style: {
              background: '#F0FDF4',
              border: '2px solid #548F2B',
              borderRadius: '8px',
              minWidth: '180px',
            },
          });

          flowEdges.push({
            id: `${virtualRootId}-${structure.id}`,
            source: virtualRootId,
            target: structure.id,
            type: 'orgEdge',
          });
        });
      }
    } else if (viewMode === 'location') {
      // Fallback: create virtual root
      const virtualRootId = 'virtual-root';

      flowNodes.push({
        id: virtualRootId,
        type: 'default',
        position: { x: 0, y: 0 },
        data: {
          label: (
            <div className="text-center p-2">
              <div className="font-medium text-gray-500 text-sm">
                Organization
              </div>
              <div className="text-gray-400 text-xs">Virtual Root</div>
            </div>
          ),
          // Store original structure data for table view
          originalData: {
            id: virtualRootId,
            department_name: 'Organization',
            level: 0,
            current_employees: 0,
            max_employees: 0,
            budget: 0,
            is_active: true,
            location_id: '',
            employees: [],
            children: [],
          },
        },
        style: {
          background: '#F9FAFB',
          border: '2px solid #9CA3AF',
          borderRadius: '8px',
          minWidth: '180px',
        },
      });

      // Calculate positions for balanced tree layout
      const totalWidth = structures.length * 250;
      const startX = -totalWidth / 2;

      structures.forEach((structure, index) => {
        const nodeEmployees = assignments.filter(
          (assignment) =>
            assignment.organizational_structure_id === structure.id
        );

        // Calculate x position for balanced distribution
        const x = startX + index * 250;

        flowNodes.push({
          id: structure.id,
          type: 'default',
          position: { x, y: 150 },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-semibold text-[#548F2B] text-sm">
                  {structure.department_name}
                </div>
                <div className="text-gray-600 text-xs">
                  {nodeEmployees.length} employee
                  {nodeEmployees.length !== 1 ? 's' : ''}
                </div>
                <div className="text-gray-500 text-xs">
                  Level {structure.level}
                </div>
                <div className="text-gray-600 text-xs">
                  Budget: {(structure.budget || 0).toLocaleString()} XAF
                </div>
              </div>
            ),
            // Store original structure data for table view
            originalData: {
              ...structure,
              employees: nodeEmployees,
              children: [],
            },
          },
          style: {
            background: '#F0FDF4',
            border: '2px solid #548F2B',
            borderRadius: '8px',
            minWidth: '180px',
          },
        });

        flowEdges.push({
          id: `${virtualRootId}-${structure.id}`,
          source: virtualRootId,
          target: structure.id,
          type: 'orgEdge',
        });
      });
    } else if (viewMode === 'location') {
      // Location view: Show only actual locations with their departments
      const locationGroups = new Map<string, OrganizationalStructure[]>();

      // Group structures by location
      structures.forEach((structure) => {
        const locationId = structure.location_id || 'unknown';
        if (!locationGroups.has(locationId)) {
          locationGroups.set(locationId, []);
        }
        locationGroups.get(locationId)!.push(structure);
      });

      // Find which location contains the level 1 organization
      const level1Structure = structures.find((s) => s.level === 1);
      const mainLocationId = level1Structure?.location_id || 'unknown';

      let yOffset = 0;
      locationGroups.forEach((structuresInLocation, locationId) => {
        // Sort structures within location by level
        const sortedLocationStructures = structuresInLocation.sort(
          (a, b) => a.level - b.level
        );

        // Check if this location contains the level 1 organization
        const hasLevel1 = sortedLocationStructures.some((s) => s.level === 1);
        const isMainLocation = locationId === mainLocationId;

        // Create location header node
        const locationHeaderId = `location-${locationId}`;
        flowNodes.push({
          id: locationHeaderId,
          type: 'default',
          position: { x: 0, y: yOffset },
          data: {
            label: (
              <div className="text-center p-2">
                <div
                  className={`font-bold text-sm ${
                    isMainLocation ? 'text-[#237804]' : 'text-[#1E40AF]'
                  }`}
                >
                  {getLocationName(locationId)}
                  {isMainLocation && (
                    <span className="ml-2 text-xs bg-[#E6F4E6] text-[#237804] px-2 py-1 rounded">
                      Main Office
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {sortedLocationStructures.length} department
                  {sortedLocationStructures.length !== 1 ? 's' : ''}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Budget:{' '}
                  {sortedLocationStructures
                    .reduce(
                      (total, structure) => total + (structure.budget || 0),
                      0
                    )
                    .toLocaleString()}{' '}
                  XAF
                </div>
              </div>
            ),
            originalData: {
              id: locationHeaderId,
              department_name: getLocationName(locationId),
              level: 0,
              current_employees: 0,
              max_employees: 0,
              budget: 0,
              is_active: true,
              location_id: locationId,
              employees: [],
              children: [],
            },
          },
          style: {
            background: isMainLocation ? '#E6F4E6' : '#DBEAFE',
            border: `2px solid ${isMainLocation ? '#237804' : '#1E40AF'}`,
            borderRadius: '8px',
            minWidth: '200px',
          },
        });

        yOffset += 100;

        // Add departments under this location
        const totalWidth = sortedLocationStructures.length * 250;
        const startX = -totalWidth / 2;

        sortedLocationStructures.forEach((structure, index) => {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          const x = startX + index * 250;
          const isLevel1 = structure.level === 1;

          flowNodes.push({
            id: structure.id,
            type: 'default',
            position: { x, y: yOffset },
            data: {
              label: (
                <div className="text-center p-2">
                  <div
                    className={`font-semibold text-sm ${
                      isLevel1 ? 'text-[#237804]' : 'text-[#548F2B]'
                    }`}
                  >
                    {structure.department_name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Level {structure.level}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nodeEmployees.length} employee
                    {nodeEmployees.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Budget: {(structure.budget || 0).toLocaleString()} XAF
                  </div>
                </div>
              ),
              originalData: {
                ...structure,
                employees: nodeEmployees,
                children: [],
              },
            },
            style: {
              background: isLevel1 ? '#E6F4E6' : '#F0FDF4',
              border: `2px solid ${isLevel1 ? '#237804' : '#548F2B'}`,
              borderRadius: '8px',
              minWidth: '180px',
            },
          });

          // Add edge from location header to department
          flowEdges.push({
            id: `${locationHeaderId}-${structure.id}`,
            source: locationHeaderId,
            target: structure.id,
            type: 'orgEdge',
          });
        });

        yOffset += 150;
      });
    } else if (viewMode === 'business') {
      // Business unit view: Group departments by business unit
      const businessGroups = new Map<string, OrganizationalStructure[]>();

      structures.forEach((structure) => {
        const structureEmployees = assignments.filter(
          (assignment) =>
            assignment.organizational_structure_id === structure.id
        );

        // Find the primary business unit for this structure
        const primaryEmployee = structureEmployees.find(
          (emp) => emp.assignment_type === 'PRIMARY'
        );
        const businessUnitId = primaryEmployee?.sub_business_id || 'unknown';

        if (!businessGroups.has(businessUnitId)) {
          businessGroups.set(businessUnitId, []);
        }
        businessGroups.get(businessUnitId)!.push(structure);
      });

      let yOffset = 0;
      businessGroups.forEach((structuresInBusiness, businessUnitId) => {
        // Create business unit header node
        const businessHeaderId = `business-${businessUnitId}`;
        flowNodes.push({
          id: businessHeaderId,
          type: 'default',
          position: { x: 0, y: yOffset },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-bold text-[#7C3AED] text-sm">
                  Business Unit: {getBusinessUnitName(businessUnitId)}
                </div>
                <div className="text-gray-500 text-xs">
                  {structuresInBusiness.length} department
                  {structuresInBusiness.length !== 1 ? 's' : ''}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Budget:{' '}
                  {structuresInBusiness
                    .reduce(
                      (total, structure) => total + (structure.budget || 0),
                      0
                    )
                    .toLocaleString()}{' '}
                  XAF
                </div>
              </div>
            ),
            originalData: {
              id: businessHeaderId,
              department_name: `Business Unit: ${getBusinessUnitName(
                businessUnitId
              )}`,
              level: 0,
              current_employees: 0,
              max_employees: 0,
              budget: 0,
              is_active: true,
              location_id: '',
              employees: [],
              children: [],
            },
          },
          style: {
            background: '#EDE9FE',
            border: '2px solid #7C3AED',
            borderRadius: '8px',
            minWidth: '200px',
          },
        });

        yOffset += 100;

        // Add departments under this business unit
        const totalWidth = structuresInBusiness.length * 250;
        const startX = -totalWidth / 2;

        structuresInBusiness.forEach((structure, index) => {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          const x = startX + index * 250;

          flowNodes.push({
            id: structure.id,
            type: 'default',
            position: { x, y: yOffset },
            data: {
              label: (
                <div className="text-center p-2">
                  <div className="font-semibold text-[#548F2B] text-sm">
                    {structure.department_name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nodeEmployees.length} employee
                    {nodeEmployees.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Business: {getBusinessUnitName(businessUnitId)}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Budget: {(structure.budget || 0).toLocaleString()} XAF
                  </div>
                </div>
              ),
              originalData: {
                ...structure,
                employees: nodeEmployees,
                children: [],
              },
            },
            style: {
              background: '#F0FDF4',
              border: '2px solid #548F2B',
              borderRadius: '8px',
              minWidth: '180px',
            },
          });

          // Add edge from business unit header to department
          flowEdges.push({
            id: `${businessHeaderId}-${structure.id}`,
            source: businessHeaderId,
            target: structure.id,
            type: 'orgEdge',
          });
        });

        yOffset += 150;
      });
    } else if (viewMode === 'geographical') {
      // Geographical unit view: Group departments by geographical unit
      const geoGroups = new Map<string, OrganizationalStructure[]>();

      structures.forEach((structure) => {
        const structureEmployees = assignments.filter(
          (assignment) =>
            assignment.organizational_structure_id === structure.id
        );

        // Find the geographical unit for this structure
        const geoUnitId =
          structureEmployees.find((emp) => emp.geographical_unit_id)
            ?.geographical_unit_id || 'unknown';

        if (!geoGroups.has(geoUnitId)) {
          geoGroups.set(geoUnitId, []);
        }
        geoGroups.get(geoUnitId)!.push(structure);
      });

      let yOffset = 0;
      geoGroups.forEach((structuresInGeo, geoUnitId) => {
        // Create geographical unit header node
        const geoHeaderId = `geo-${geoUnitId}`;
        flowNodes.push({
          id: geoHeaderId,
          type: 'default',
          position: { x: 0, y: yOffset },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-bold text-[#DC2626] text-sm">
                  Geographical Unit: {getGeographicalUnitName(geoUnitId)}
                </div>
                <div className="text-gray-500 text-xs">
                  {structuresInGeo.length} department
                  {structuresInGeo.length !== 1 ? 's' : ''}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Budget:{' '}
                  {structuresInGeo
                    .reduce(
                      (total, structure) => total + (structure.budget || 0),
                      0
                    )
                    .toLocaleString()}{' '}
                  XAF
                </div>
              </div>
            ),
            originalData: {
              id: geoHeaderId,
              department_name: `Geographical Unit: ${getGeographicalUnitName(
                geoUnitId
              )}`,
              level: 0,
              current_employees: 0,
              max_employees: 0,
              budget: 0,
              is_active: true,
              location_id: '',
              employees: [],
              children: [],
            },
          },
          style: {
            background: '#FEE2E2',
            border: '2px solid #DC2626',
            borderRadius: '8px',
            minWidth: '200px',
          },
        });

        yOffset += 100;

        // Add departments under this geographical unit
        const totalWidth = structuresInGeo.length * 250;
        const startX = -totalWidth / 2;

        structuresInGeo.forEach((structure, index) => {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          const x = startX + index * 250;

          flowNodes.push({
            id: structure.id,
            type: 'default',
            position: { x, y: yOffset },
            data: {
              label: (
                <div className="text-center p-2">
                  <div className="font-semibold text-[#548F2B] text-sm">
                    {structure.department_name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nodeEmployees.length} employee
                    {nodeEmployees.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Geo: {getGeographicalUnitName(geoUnitId)}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Budget: {(structure.budget || 0).toLocaleString()} XAF
                  </div>
                </div>
              ),
              originalData: {
                ...structure,
                employees: nodeEmployees,
                children: [],
              },
            },
            style: {
              background: '#F0FDF4',
              border: '2px solid #548F2B',
              borderRadius: '8px',
              minWidth: '180px',
            },
          });

          // Add edge from geographical unit header to department
          flowEdges.push({
            id: `${geoHeaderId}-${structure.id}`,
            source: geoHeaderId,
            target: structure.id,
            type: 'orgEdge',
          });
        });

        yOffset += 150;
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    structures,
    assignments,
    viewMode,
    locations,
    subBusinesses,
    geographicalUnits,
  ]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    if (!nodes.length) return { nodes: [], edges: [] };

    let filteredNodes = nodes;
    let filteredEdges = edges;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredNodes = nodes.filter((node) => {
        const nodeData = node.data as any;
        const labelText =
          nodeData.label?.props?.children?.[0]?.props?.children || '';
        return labelText.toLowerCase().includes(searchLower);
      });

      // Filter edges to only include connections between filtered nodes
      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredEdges = edges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );
    }

    // Apply location filter
    if (filters.location) {
      filteredNodes = filteredNodes.filter((node) => {
        const structure = structures.find((s) => s.id === node.id);
        return structure?.location_id === filters.location;
      });

      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredEdges = filteredEdges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );
    }

    // Apply business unit filter
    if (filters.businessUnit) {
      filteredNodes = filteredNodes.filter((node) => {
        const nodeEmployees = assignments.filter(
          (assignment) => assignment.organizational_structure_id === node.id
        );
        return nodeEmployees.some(
          (emp) => emp.sub_business_id === filters.businessUnit
        );
      });

      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredEdges = filteredEdges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );
    }

    // Apply geographical unit filter
    if (filters.geographicalUnit) {
      filteredNodes = filteredNodes.filter((node) => {
        const nodeEmployees = assignments.filter(
          (assignment) => assignment.organizational_structure_id === node.id
        );
        return nodeEmployees.some(
          (emp) => emp.geographical_unit_id === filters.geographicalUnit
        );
      });

      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredEdges = filteredEdges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );
    }

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [nodes, edges, structures, assignments, searchTerm, filters]);

  // React Flow state management
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);

  // Update React Flow nodes and edges when filtered data changes
  useEffect(() => {
    setReactFlowNodes(filteredData.nodes);
    setReactFlowEdges(filteredData.edges);
  }, [filteredData, setReactFlowNodes, setReactFlowEdges]);

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => setReactFlowEdges((eds) => addEdge(params, eds)),
    [setReactFlowEdges]
  );

  // Handle node click with enhanced user context
  const onNodeClick = useCallback(
    async (event: any, node: Node) => {
      console.log('Node clicked:', node);
      setSelectedNode(node.id);
      const structure = structures.find((s) => s.id === node.id);
      if (structure) {
        toast.success(`Selected: ${structure.department_name}`);

        // Load enhanced department data
        try {
          const departmentAssignments =
            await orgChartApi.getAssignmentsByDepartment(structure.id);
          console.log(
            `Department ${structure.department_name} assignments:`,
            departmentAssignments.data
          );

          // Show department details in a more detailed way
          if (
            departmentAssignments.data &&
            departmentAssignments.data.length > 0
          ) {
            const employeeDetails = departmentAssignments.data.map(
              (assignment: UserAssignment) => ({
                id: assignment.id,
                user_id: assignment.user_id,
                job_title: assignment.job_title,
                assignment_type: assignment.assignment_type,
                is_active: assignment.is_active,
              })
            );

            console.log(
              `Department ${structure.department_name} employee details:`,
              employeeDetails
            );
            toast.success(
              `${structure.department_name}: ${employeeDetails.length} employees`
            );
          }
        } catch (err) {
          console.log('Could not load department assignments:', err);
        }
      }
    },
    [structures]
  );

  // Enhanced function to get user context
  const getUserContext = useCallback(async (userId: string) => {
    try {
      const context = await orgChartApi.getFullUserContext(userId);
      return context.data;
    } catch (err) {
      console.error('Error loading user context:', err);
      return null;
    }
  }, []);

  // Enhanced function to get department assignments
  const getDepartmentAssignments = useCallback(async (structureId: string) => {
    try {
      const assignments = await orgChartApi.getAssignmentsByDepartment(
        structureId
      );
      return assignments.data;
    } catch (err) {
      console.error('Error loading department assignments:', err);
      return [];
    }
  }, []);

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0].id);
    } else {
      setSelectedNode(null);
    }
  }, []);

  // Handle node double click for editing
  const onNodeDoubleClick = useCallback(
    (event: any, node: Node) => {
      const structure = structures.find((s) => s.id === node.id);
      if (structure) {
        setSelectedStructure(structure);
        setShowEditModal(true);
        toast.success(`Editing: ${structure.department_name}`);
      }
    },
    [structures]
  );

  // Handle delete structure
  const handleDeleteStructure = useCallback(async (structureId: string) => {
    try {
      setIsDeleting(true);
      console.log('🗑️ Attempting to delete structure:', structureId);
      const result = await orgChartApi.deleteStructure(structureId);
      console.log('✅ Delete result:', result);

      // Refresh data
      const [structuresRes, assignmentsRes, locationsRes, subBusinessesRes] =
        await Promise.all([
          orgChartApi.getStructures(),
          orgChartApi.getAssignments(),
          orgChartApi.getLocations(),
          orgChartApi.getSubBusinesses(),
        ]);

      const structuresData = Array.isArray(structuresRes.data)
        ? structuresRes.data
        : (structuresRes.data as any)?.data || [];

      const assignmentsData = Array.isArray(assignmentsRes.data)
        ? assignmentsRes.data
        : (assignmentsRes.data as any)?.data || [];

      const locationsData = Array.isArray(locationsRes.data)
        ? locationsRes.data
        : (locationsRes.data as any)?.data || [];

      const subBusinessesData = Array.isArray(subBusinessesRes.data)
        ? subBusinessesRes.data
        : (subBusinessesRes.data as any)?.data || [];

      setStructures(structuresData);
      setAssignments(assignmentsData);
      setLocations(locationsData);
      setSubBusinesses(subBusinessesData);
      setShowDeleteModal(false);
      setSelectedStructure(null);
      toast.success('Department deleted successfully!');
    } catch (err) {
      console.error('Error deleting structure:', err);
      setError('Failed to delete department. Please try again.');
      toast.error('Failed to delete department. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Handle add new structure
  const handleAddStructure = useCallback(
    async (data: Partial<OrganizationalStructure>) => {
      try {
        console.log('➕ Attempting to create structure:', data);
        const result = await orgChartApi.createStructure(data);
        console.log('✅ Create result:', result);

        // Refresh data
        const [structuresRes, assignmentsRes, locationsRes, subBusinessesRes] =
          await Promise.all([
            orgChartApi.getStructures(),
            orgChartApi.getAssignments(),
            orgChartApi.getLocations(),
            orgChartApi.getSubBusinesses(),
          ]);

        const structuresData = Array.isArray(structuresRes.data)
          ? structuresRes.data
          : (structuresRes.data as any)?.data || [];

        const assignmentsData = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : (assignmentsRes.data as any)?.data || [];

        const locationsData = Array.isArray(locationsRes.data)
          ? locationsRes.data
          : (locationsRes.data as any)?.data || [];

        const subBusinessesData = Array.isArray(subBusinessesRes.data)
          ? subBusinessesRes.data
          : (subBusinessesRes.data as any)?.data || [];

        setStructures(structuresData);
        setAssignments(assignmentsData);
        setLocations(locationsData);
        setSubBusinesses(subBusinessesData);
        setShowAddModal(false);
        toast.success('Department created successfully!');
      } catch (err) {
        console.error('Error creating structure:', err);
        setError('Failed to create department. Please try again.');
        toast.error('Failed to create department. Please try again.');
      }
    },
    []
  );

  // Handle update structure
  const handleUpdateStructure = useCallback(
    async (structureId: string, data: Partial<OrganizationalStructure>) => {
      try {
        console.log('✏️ Attempting to update structure:', structureId, data);
        const result = await orgChartApi.updateStructure(structureId, data);
        console.log('✅ Update result:', result);

        // Refresh data
        const [structuresRes, assignmentsRes, locationsRes, subBusinessesRes] =
          await Promise.all([
            orgChartApi.getStructures(),
            orgChartApi.getAssignments(),
            orgChartApi.getLocations(),
            orgChartApi.getSubBusinesses(),
          ]);

        const structuresData = Array.isArray(structuresRes.data)
          ? structuresRes.data
          : (structuresRes.data as any)?.data || [];

        const assignmentsData = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : (assignmentsRes.data as any)?.data || [];

        const locationsData = Array.isArray(locationsRes.data)
          ? locationsRes.data
          : (locationsRes.data as any)?.data || [];

        const subBusinessesData = Array.isArray(subBusinessesRes.data)
          ? subBusinessesRes.data
          : (subBusinessesRes.data as any)?.data || [];

        setStructures(structuresData);
        setAssignments(assignmentsData);
        setLocations(locationsData);
        setSubBusinesses(subBusinessesData);
        setShowEditModal(false);
        setSelectedStructure(null);
        toast.success('Department updated successfully!');
      } catch (err) {
        console.error('Error updating structure:', err);
        setError('Failed to update department. Please try again.');
        toast.error('Failed to update department. Please try again.');
      }
    },
    []
  );

  // Handle template generation
  const handleGenerateFromTemplate = useCallback(
    async (templateId: string) => {
      try {
        console.log(
          '🎯 Attempting to generate structures from template:',
          templateId
        );

        // Get the template first
        const templateRes = await orgChartApi.getTemplate(templateId);
        console.log('📋 Template data:', templateRes.data);

        // Generate structures from template
        const generateData = {
          locationId: locations[0]?.id || '', // Use first available location
          organizationId: '500e05a0-c688-4c4a-9661-ae152e00d0c5', // Default org ID
          totalBudget: 10000000, // 10M XAF
          employeeAllocations: {
            Engineering: 40,
            Sales: 25,
            Marketing: 15,
            HR: 10,
            Finance: 10,
          },
          budgetAllocations: {
            Engineering: 4500000,
            Sales: 2000000,
            Marketing: 2000000,
            HR: 750000,
            Finance: 750000,
          },
        };

        const result = await orgChartApi.generateStructuresFromTemplate(
          templateId,
          generateData
        );
        console.log('✅ Template generation result:', result);

        // Refresh data after generation
        const [structuresRes, assignmentsRes, locationsRes, subBusinessesRes] =
          await Promise.all([
            orgChartApi.getStructures(),
            orgChartApi.getAssignments(),
            orgChartApi.getLocations(),
            orgChartApi.getSubBusinesses(),
          ]);

        const structuresData = Array.isArray(structuresRes.data)
          ? structuresRes.data
          : (structuresRes.data as any)?.data || [];

        const assignmentsData = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : (assignmentsRes.data as any)?.data || [];

        const locationsData = Array.isArray(locationsRes.data)
          ? locationsRes.data
          : (locationsRes.data as any)?.data || [];

        const subBusinessesData = Array.isArray(subBusinessesRes.data)
          ? subBusinessesRes.data
          : (subBusinessesRes.data as any)?.data || [];

        setStructures(structuresData);
        setAssignments(assignmentsData);
        setLocations(locationsData);
        setSubBusinesses(subBusinessesData);

        toast.success(
          'Organizational structure generated from template successfully!'
        );
      } catch (err) {
        console.error('Error generating from template:', err);
        setError(
          'Failed to generate structure from template. Please try again.'
        );
        toast.error(
          'Failed to generate structure from template. Please try again.'
        );
      }
    },
    [locations]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237804]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!filteredData.nodes.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-2">No data found</div>
          <div className="text-gray-500">
            {searchTerm || Object.values(filters).some((f) => f)
              ? 'Try adjusting your search or filters'
              : 'No organizational data available'}
          </div>
        </div>
        {/* Add Department Modal */}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Edit Department Modal */}
      {showEditModal &&
        selectedStructure &&
        (console.log('📋 Edit modal is showing for:', selectedStructure),
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Department</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log('✏️ Edit form submitted');
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    department_name: formData.get('department_name') as string,
                    max_employees:
                      parseInt(formData.get('max_employees') as string) ||
                      selectedStructure.max_employees,
                    budget:
                      parseInt(formData.get('budget') as string) ||
                      selectedStructure.budget,
                    is_active: formData.get('is_active') === 'true',
                  };
                  console.log('✏️ Edit form data:', data);
                  handleUpdateStructure(selectedStructure.id, data);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      name="department_name"
                      defaultValue={selectedStructure.department_name}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Employees
                      </label>
                      <input
                        type="number"
                        name="max_employees"
                        defaultValue={selectedStructure.max_employees}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget
                      </label>
                      <input
                        type="number"
                        name="budget"
                        defaultValue={selectedStructure.budget}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        value="true"
                        defaultChecked={selectedStructure.is_active}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedStructure(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#548F2B] text-white hover:bg-[#3A621E]"
                  >
                    Update Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        ))}

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        selectedStructure &&
        (console.log('📋 Delete modal is showing for:', selectedStructure),
        (
          <div className="fixed top-0 left-0 h-screen w-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Delete Department
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "
                {selectedStructure.department_name}"? This action cannot be
                undone and will remove all associated employee assignments.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedStructure(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log(
                      '🗑️ Delete button clicked for:',
                      selectedStructure.id
                    );
                    handleDeleteStructure(selectedStructure.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Department'}
                </button>
              </div>
            </div>
          </div>
        ))}
      {/* Management Controls - Hide in location view for cleaner display */}
      {viewMode !== 'location' && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {structures.length} department{structures.length !== 1 ? 's' : ''}{' '}
              found
            </div>
            {selectedNode && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Selected:</span>
                <span className="text-sm font-medium text-[#237804]">
                  {
                    structures.find((s) => s.id === selectedNode)
                      ?.department_name
                  }
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Template Generation Button */}
            {/* <button
              onClick={() => {
                console.log('🎯 Template generation button clicked');
                // For now, use the first available template
                const firstTemplate = templates?.[0];
                if (firstTemplate) {
                  handleGenerateFromTemplate(firstTemplate.id);
                } else {
                  toast.error(
                    'No templates available. Please create a template first.'
                  );
                }
              }}
              className="px-4 py-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] text-sm font-medium transition-colors"
            >
              🎯 Generate from Template
            </button> */}

            {/* Edit Button */}
            {selectedNode && (
              <button
                onClick={() => {
                  console.log('🔘 Edit button clicked for node:', selectedNode);
                  console.log('🔍 All structures:', structures);
                  console.log(
                    '🔍 Looking for structure with id:',
                    selectedNode
                  );
                  const structure = structures.find(
                    (s) => s.id === selectedNode
                  );
                  console.log('🔍 Structure found:', structure);
                  console.log('🔍 Structure type:', typeof structure);
                  console.log(
                    '🔍 Structure keys:',
                    structure ? Object.keys(structure) : 'null'
                  );
                  if (structure && structure.id) {
                    console.log('🔘 Found structure:', structure);
                    setSelectedStructure(structure);
                    setShowEditModal(true);
                    toast.success(`Editing: ${structure.department_name}`);
                  } else {
                    console.log(
                      '❌ No structure found for node:',
                      selectedNode
                    );
                    console.log(
                      '❌ Available structure IDs:',
                      structures.map((s) => s.id)
                    );
                  }
                }}
                className="px-4 py-2 bg-[#548F2B] text-white hover:bg-[#3A621E] text-sm font-medium transition-colors"
              >
                Edit
              </button>
            )}

            {/* Delete Button */}
            {selectedNode && selectedNode !== 'virtual-root' && (
              <button
                onClick={() => {
                  console.log(
                    '🔘 Delete button clicked for node:',
                    selectedNode
                  );
                  console.log('🔍 All structures:', structures);
                  console.log(
                    '🔍 Looking for structure with id:',
                    selectedNode
                  );
                  const structure = structures.find(
                    (s) => s.id === selectedNode
                  );
                  console.log('🔍 Structure found:', structure);
                  console.log('🔍 Structure type:', typeof structure);
                  console.log(
                    '🔍 Structure keys:',
                    structure ? Object.keys(structure) : 'null'
                  );
                  if (structure && structure.id) {
                    console.log('🔘 Found structure for delete:', structure);
                    setSelectedStructure(structure);
                    setShowDeleteModal(true);
                    toast.error(
                      `Delete confirmation for: ${structure.department_name}`
                    );
                  } else {
                    console.log(
                      '❌ No structure found for delete node:',
                      selectedNode
                    );
                    console.log(
                      '❌ Available structure IDs:',
                      structures.map((s) => s.id)
                    );
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}

            {/* View Mode Toggle */}
          </div>
        </div>
      )}

      {/* Org Chart Display */}
      <div className="min-h-[600px] overflow-hidden">
        {viewMode === 'hierarchy' ? (
          <div className="border border-gray-200 rounded-lg bg-gray-50 h-[600px]">
            <ReactFlowProvider>
              <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                onSelectionChange={onSelectionChange}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                defaultEdgeOptions={{
                  type: 'orgEdge',
                  animated: false,
                }}
                proOptions={{ hideAttribution: true }}
              >
                <Controls />
                <Background color="#aaa" gap={16} />
                <MiniMap
                  nodeColor="#237804"
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        ) : (
          <OrgChartTable
            data={filteredData.nodes.map((node) => {
              // Extract original data from React Flow node
              const originalData = (node.data as any).originalData;
              return (
                originalData || {
                  id: node.id,
                  department_name: 'Unknown Department',
                  level: 1,
                  current_employees: 0,
                  max_employees: 0,
                  budget: 0,
                  is_active: true,
                  location_id: '',
                  employees: [],
                  children: [],
                }
              );
            })}
            viewMode={viewMode}
            onNodeClick={(node) => {
              console.log('Table node clicked:', node);
            }}
            getLocationName={getLocationName}
            getBusinessUnitName={getBusinessUnitName}
            getGeographicalUnitName={getGeographicalUnitName}
            subBusinesses={subBusinesses}
            geographicalUnits={geographicalUnits}
          />
        )}
      </div>
    </div>
  );
}
