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
  NodeTypes,
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
  OrgChartNode,
  Organization,
  NodeAction,
} from '../types';
import { orgChartApi } from '../utils/api';
import { CustomOrgEdge } from './CustomOrgEdge';
import EnhancedOrgChartNode from './EnhancedOrgChartNode';
import { toast } from 'react-hot-toast';

// Define node types
const nodeTypes: NodeTypes = {
  enhancedNode: EnhancedOrgChartNode,
};

// Define edge types
const edgeTypes = {
  orgEdge: CustomOrgEdge,
};

interface EnhancedOrgChartFlowComponentProps {
  viewMode: ViewMode;
  searchTerm: string;
  filters: OrgChartFilters;
  refreshTrigger: number;
  onNodeSelect?: (node: OrgChartNode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onAction?: (action: NodeAction, nodeId: string, entity?: any) => void;
}

export default function EnhancedOrgChartFlowComponent({
  viewMode,
  searchTerm,
  filters,
  refreshTrigger,
  onNodeSelect,
  onViewModeChange,
  onAction,
}: EnhancedOrgChartFlowComponentProps) {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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
        ] = await Promise.all([
          orgChartApi.getStructures(),
          orgChartApi.getAssignments(),
          orgChartApi.getLocations(),
          orgChartApi.getSubBusinesses(),
          orgChartApi.getGeographicalUnits(),
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

        setStructures(structuresData);
        setAssignments(assignmentsData);
        setLocations(locationsData);
        setSubBusinesses(subBusinessesData);
        setGeographicalUnits(geoUnitsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
        toast.error('Failed to load organigram data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshTrigger]);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filteredStructures = structures;
    let filteredAssignments = assignments;
    let filteredLocations = locations;
    let filteredSubBusinesses = subBusinesses;
    let filteredGeoUnits = geographicalUnits;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredStructures = structures.filter(
        (s) =>
          s.department_name.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower)
      );
      filteredAssignments = assignments.filter((a) =>
        a.job_title?.toLowerCase().includes(searchLower)
      );
      filteredLocations = locations.filter((l) =>
        l.location_name.toLowerCase().includes(searchLower)
      );
      filteredSubBusinesses = subBusinesses.filter((s) =>
        s.sub_business_name.toLowerCase().includes(searchLower)
      );
      filteredGeoUnits = geographicalUnits.filter((g) =>
        g.geo_unit_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.location) {
      filteredStructures = filteredStructures.filter(
        (s) => s.location_id === filters.location
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.location_id === filters.location
      );
    }

    if (filters.businessUnit) {
      filteredStructures = filteredStructures.filter(
        (s) => s.sub_business_unit_id === filters.businessUnit
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.sub_business_id === filters.businessUnit
      );
    }

    if (filters.geographicalUnit) {
      filteredLocations = filteredLocations.filter(
        (l) => l.geographical_unit_id === filters.geographicalUnit
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.geographical_unit_id === filters.geographicalUnit
      );
    }

    return {
      structures: filteredStructures,
      assignments: filteredAssignments,
      locations: filteredLocations,
      subBusinesses: filteredSubBusinesses,
      geoUnits: filteredGeoUnits,
    };
  }, [
    structures,
    assignments,
    locations,
    subBusinesses,
    geographicalUnits,
    searchTerm,
    filters,
  ]);

  // Handle view employees action
  const handleViewEmployees = useCallback(
    (filters: any) => {
      if (onViewModeChange) {
        onViewModeChange('employees');
      }
    },
    [onViewModeChange]
  );

  // Create nodes based on view mode
  const nodes = useMemo(() => {
    if (loading) return [];

    const reactFlowNodes: Node[] = [];

    // Always start with the main organization
    const mainOrgNode: Node = {
      id: 'main-org',
      type: 'enhancedNode',
      position: { x: 400, y: 50 },
      data: {
        id: 'main-org',
        type: 'organization',
        label: '🏢 INSTANVI',
        description: 'Main Organization',
        icon: '🏢',
        color: '#1f2937',
        isActive: true,
      },
    };
    reactFlowNodes.push(mainOrgNode);

    switch (viewMode) {
      case 'general':
        // Show complete hierarchy: Organization -> Geo Units -> Locations -> Business Units -> Structures
        let yOffset = 150;

        // Level 1: Geographical Units
        const geoNodes = filteredData.geoUnits.map((unit, index) => {
          const unitLocations = filteredData.locations.filter(
            (l) => l.geographical_unit_id === unit.id
          );
          const unitStructures = filteredData.structures.filter((s) =>
            unitLocations.some((l) => l.id === s.location_id)
          );
          const unitEmployees = filteredData.assignments.filter((a) =>
            unitStructures.some((s) => s.id === a.organizational_structure_id)
          );

          return {
            id: `geo-${unit.id}`,
            type: 'enhancedNode',
            position: { x: 200 + index * 350, y: yOffset },
            data: {
              id: `geo-${unit.id}`,
              type: 'geographical',
              label: `🌍 ${unit.geo_unit_name}`,
              description: unit.description,
              icon: '🌍',
              color: '#3b82f6',
              entity: unit,
              employeeCount: unitEmployees.length,
              geoUnit: unit.id,
              isActive: unit.is_active,
              children: unitLocations.map((l) => ({
                id: l.id,
                type: 'location',
              })),
            },
          };
        });
        reactFlowNodes.push(...geoNodes);

        // Level 2: Locations under each geo unit
        yOffset += 120;
        filteredData.locations.forEach((location, index) => {
          const parentGeoIndex = filteredData.geoUnits.findIndex(
            (g) => g.id === location.geographical_unit_id
          );
          const locationStructures = filteredData.structures.filter(
            (s) => s.location_id === location.id
          );
          const locationEmployees = filteredData.assignments.filter((a) =>
            locationStructures.some(
              (s) => s.id === a.organizational_structure_id
            )
          );

          const locationNode: Node = {
            id: `location-${location.id}`,
            type: 'enhancedNode',
            position: {
              x: 150 + parentGeoIndex * 350 + (index % 2) * 150,
              y: yOffset,
            },
            data: {
              id: `location-${location.id}`,
              type: 'location',
              label: `🏢 ${location.location_name}`,
              description: `${location.city}, ${location.country}`,
              icon: '🏢',
              color: '#10b981',
              entity: location,
              employeeCount: locationEmployees.length,
              location: location.id,
              geoUnit: location.geographical_unit_id,
              isActive: true,
              children: locationStructures.map((s) => ({
                id: s.id,
                type: 'structure',
              })),
            },
          };
          reactFlowNodes.push(locationNode);
        });

        // Level 3: Business Units
        yOffset += 120;
        filteredData.subBusinesses.forEach((business, index) => {
          const businessStructures = filteredData.structures.filter(
            (s) => s.sub_business_unit_id === business.id
          );
          const businessEmployees = filteredData.assignments.filter((a) =>
            businessStructures.some(
              (s) => s.id === a.organizational_structure_id
            )
          );

          const businessNode: Node = {
            id: `business-${business.id}`,
            type: 'enhancedNode',
            position: { x: 200 + index * 350, y: yOffset },
            data: {
              id: `business-${business.id}`,
              type: 'business',
              label: `🏢 ${business.sub_business_name}`,
              description: business.description,
              icon: '🏢',
              color: '#f59e0b',
              entity: business,
              employeeCount: businessEmployees.length,
              maxEmployees: business.max_employees,
              budget: business.annual_revenue,
              businessUnit: business.id,
              isActive: business.is_active,
              children: businessStructures.map((s) => ({
                id: s.id,
                type: 'structure',
              })),
            },
          };
          reactFlowNodes.push(businessNode);
        });

        // Level 4: Organizational Structures
        yOffset += 120;
        filteredData.structures.forEach((structure, index) => {
          const structureEmployees = filteredData.assignments.filter(
            (a) => a.organizational_structure_id === structure.id
          );

          const structureNode: Node = {
            id: `structure-${structure.id}`,
            type: 'enhancedNode',
            position: { x: 200 + index * 350, y: yOffset },
            data: {
              id: `structure-${structure.id}`,
              type: 'structure',
              label: `📊 ${structure.department_name}`,
              description: structure.description,
              icon: '📊',
              color: '#8b5cf6',
              entity: structure,
              employeeCount: structureEmployees.length,
              maxEmployees: structure.max_employees,
              budget: structure.budget,
              location: structure.location_id,
              businessUnit: structure.sub_business_unit_id,
              isActive: structure.is_active,
              employees: structureEmployees,
            },
          };
          reactFlowNodes.push(structureNode);
        });
        break;

      case 'geographical':
        // Show geographical hierarchy
        const geoNodesGeo = filteredData.geoUnits.map((unit, index) => {
          const unitEmployees = filteredData.assignments.filter((a) =>
            filteredData.structures.some(
              (s) =>
                s.id === a.organizational_structure_id &&
                filteredData.locations.some(
                  (l) => l.id === s.location_id && l.geographical_unit_id === unit.id
                )
            )
          );

          return {
            id: `geo-${unit.id}`,
            type: 'enhancedNode',
            position: { x: 200 + index * 300, y: 150 },
            data: {
              id: `geo-${unit.id}`,
              type: 'geographical',
              label: `🌍 ${unit.geo_unit_name}`,
              description: unit.description,
              icon: '🌍',
              color: '#3b82f6',
              entity: unit,
              employeeCount: unitEmployees.length,
              geoUnit: unit.id,
              isActive: unit.is_active,
            },
          };
        });
        reactFlowNodes.push(...geoNodesGeo);

        // Add locations under geographical units
        filteredData.locations.forEach((location, index) => {
          const parentIndex = filteredData.geoUnits.findIndex(
            (g) => g.id === location.geographical_unit_id
          );
          const locationEmployees = filteredData.assignments.filter((a) =>
            filteredData.structures.some(
              (s) =>
                s.id === a.organizational_structure_id &&
                s.location_id === location.id
            )
          );

          const locationNode: Node = {
            id: `location-${location.id}`,
            type: 'enhancedNode',
            position: {
              x: 150 + parentIndex * 300 + (index % 2) * 100,
              y: 250,
            },
            data: {
              id: `location-${location.id}`,
              type: 'location',
              label: `🏢 ${location.location_name}`,
              description: `${location.city}, ${location.country}`,
              icon: '🏢',
              color: '#10b981',
              entity: location,
              employeeCount: locationEmployees.length,
              location: location.id,
              geoUnit: location.geographical_unit_id,
              isActive: true,
            },
          };
          reactFlowNodes.push(locationNode);
        });
        break;

      case 'business':
        // Show business units
        const businessNodes = filteredData.subBusinesses.map(
          (business, index) => {
            const businessEmployees = filteredData.assignments.filter((a) =>
              filteredData.structures.some(
                (s) =>
                  s.id === a.organizational_structure_id &&
                  s.sub_business_unit_id === business.id
              )
            );

            return {
              id: `business-${business.id}`,
              type: 'enhancedNode',
              position: { x: 200 + index * 300, y: 150 },
              data: {
                id: `business-${business.id}`,
                type: 'business',
                label: `🏢 ${business.sub_business_name}`,
                description: business.description,
                icon: '🏢',
                color: '#f59e0b',
                entity: business,
                employeeCount: businessEmployees.length,
                maxEmployees: business.max_employees,
                budget: business.annual_revenue,
                businessUnit: business.id,
                isActive: business.is_active,
              },
            };
          }
        );
        reactFlowNodes.push(...businessNodes);
        break;

      case 'organizational':
        // Show organizational structures with hierarchy
        const orgNodes = filteredData.structures.map((structure, index) => {
          const structureEmployees = filteredData.assignments.filter(
            (a) => a.organizational_structure_id === structure.id
          );

          return {
            id: `org-${structure.id}`,
            type: 'enhancedNode',
            position: { x: 200 + index * 300, y: 150 },
            data: {
              id: `org-${structure.id}`,
              type: 'structure',
              label: `📊 ${structure.department_name}`,
              description: structure.description,
              icon: '📊',
              color: '#8b5cf6',
              entity: structure,
              employeeCount: structureEmployees.length,
              maxEmployees: structure.max_employees,
              budget: structure.budget,
              location: structure.location_id,
              businessUnit: structure.sub_business_unit_id,
              isActive: structure.is_active,
              employees: structureEmployees,
            },
          };
        });
        reactFlowNodes.push(...orgNodes);
        break;

      case 'employees':
        // Show employees grouped by department
        const employeeGroups = filteredData.assignments.reduce(
          (groups, assignment) => {
            const structure = filteredData.structures.find(
              (s) => s.id === assignment.organizational_structure_id
            );
            const deptName = structure?.department_name || 'Unassigned';
            if (!groups[deptName]) {
              groups[deptName] = [];
            }
            groups[deptName].push(assignment);
            return groups;
          },
          {} as Record<string, UserAssignment[]>
        );

        Object.entries(employeeGroups).forEach(
          ([deptName, deptEmployees], deptIndex) => {
            // Add department node
            const deptNode: Node = {
              id: `dept-${deptIndex}`,
              type: 'enhancedNode',
              position: { x: 200 + deptIndex * 400, y: 150 },
              data: {
                id: `dept-${deptIndex}`,
                type: 'structure',
                label: `📊 ${deptName}`,
                description: `${deptEmployees.length} employees`,
                icon: '📊',
                color: '#8b5cf6',
                entity: {
                  department_name: deptName,
                  employee_count: deptEmployees.length,
                },
                employeeCount: deptEmployees.length,
              },
            };
            reactFlowNodes.push(deptNode);

            // Add employee nodes under department
            deptEmployees.forEach((employee, empIndex) => {
              const employeeNode: Node = {
                id: `employee-${employee.id}`,
                type: 'enhancedNode',
                position: {
                  x: 150 + deptIndex * 400 + (empIndex % 3) * 120,
                  y: 250 + Math.floor(empIndex / 3) * 80,
                },
                data: {
                  id: `employee-${employee.id}`,
                  type: 'employee',
                  label: `👤 ${employee.job_title || 'Employee'}`,
                  description: employee.assignment_type,
                  icon: '👤',
                  color: '#ec4899',
                  entity: employee,
                },
              };
              reactFlowNodes.push(employeeNode);
            });
          }
        );
        break;
    }

    return reactFlowNodes;
  }, [viewMode, filteredData, loading]);

  // Create edges based on view mode
  const edges = useMemo(() => {
    const reactFlowEdges: Edge[] = [];

    switch (viewMode) {
      case 'general':
        // Connect main org to geographical units
        filteredData.geoUnits.forEach((unit) => {
          reactFlowEdges.push({
            id: `main-org-to-geo-${unit.id}`,
            source: 'main-org',
            target: `geo-${unit.id}`,
            type: 'orgEdge',
          });
        });

        // Connect geographical units to locations
        filteredData.locations.forEach((location) => {
          const parentGeo = filteredData.geoUnits.find(
            (g) => g.id === location.geographical_unit_id
          );
          if (parentGeo) {
            reactFlowEdges.push({
              id: `geo-${parentGeo.id}-to-location-${location.id}`,
              source: `geo-${parentGeo.id}`,
              target: `location-${location.id}`,
              type: 'orgEdge',
            });
          }
        });

        // Connect locations to business units (if they have structures with business units)
        filteredData.structures.forEach((structure) => {
          if (structure.location_id && structure.sub_business_unit_id) {
            const business = filteredData.subBusinesses.find(
              (b) => b.id === structure.sub_business_unit_id
            );
            if (business) {
              reactFlowEdges.push({
                id: `location-${structure.location_id}-to-business-${business.id}`,
                source: `location-${structure.location_id}`,
                target: `business-${business.id}`,
                type: 'orgEdge',
              });
            }
          }
        });

        // Connect business units to structures
        filteredData.structures.forEach((structure) => {
          if (structure.sub_business_unit_id) {
            reactFlowEdges.push({
              id: `business-${structure.sub_business_unit_id}-to-structure-${structure.id}`,
              source: `business-${structure.sub_business_unit_id}`,
              target: `structure-${structure.id}`,
              type: 'orgEdge',
            });
          }
        });
        break;

      case 'geographical':
        // Connect main org to geographical units
        filteredData.geoUnits.forEach((unit) => {
          reactFlowEdges.push({
            id: `main-org-to-geo-${unit.id}`,
            source: 'main-org',
            target: `geo-${unit.id}`,
            type: 'orgEdge',
          });
        });

        // Connect geographical units to locations
        filteredData.locations.forEach((location) => {
          const parentGeo = filteredData.geoUnits.find(
            (g) => g.id === location.geographical_unit_id
          );
          if (parentGeo) {
            reactFlowEdges.push({
              id: `geo-${parentGeo.id}-to-location-${location.id}`,
              source: `geo-${parentGeo.id}`,
              target: `location-${location.id}`,
              type: 'orgEdge',
            });
          }
        });
        break;

      case 'business':
        // Connect main org to business units
        filteredData.subBusinesses.forEach((business) => {
          reactFlowEdges.push({
            id: `main-org-to-business-${business.id}`,
            source: 'main-org',
            target: `business-${business.id}`,
            type: 'orgEdge',
          });
        });
        break;

      case 'organizational':
        // Connect main org to organizational structures
        filteredData.structures.forEach((structure) => {
          reactFlowEdges.push({
            id: `main-org-to-org-${structure.id}`,
            source: 'main-org',
            target: `org-${structure.id}`,
            type: 'orgEdge',
          });
        });
        break;

      case 'employees':
        // Connect departments to employees
        const employeeGroups = filteredData.assignments.reduce(
          (groups, assignment) => {
            const structure = filteredData.structures.find(
              (s) => s.id === assignment.organizational_structure_id
            );
            const deptName = structure?.department_name || 'Unassigned';
            if (!groups[deptName]) {
              groups[deptName] = [];
            }
            groups[deptName].push(assignment);
            return groups;
          },
          {} as Record<string, UserAssignment[]>
        );

        Object.entries(employeeGroups).forEach(
          ([deptName, deptEmployees], deptIndex) => {
            deptEmployees.forEach((employee) => {
              reactFlowEdges.push({
                id: `dept-${deptIndex}-to-employee-${employee.id}`,
                source: `dept-${deptIndex}`,
                target: `employee-${employee.id}`,
                type: 'orgEdge',
              });
            });
          }
        );
        break;
    }

    return reactFlowEdges;
  }, [viewMode, filteredData]);

  // Handle node actions
  const handleNodeAction = useCallback(
    (action: NodeAction, nodeId: string, entity?: any) => {
      if (onAction) {
        onAction(action, nodeId, entity);
      }
    },
    [onAction]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237804] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organizational chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#237804] text-white rounded-lg hover:bg-[#1D6303] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        onNodeClick={(event, node) => {
          setSelectedNode(node.id);
          if (onNodeSelect) {
            onNodeSelect(node as any);
          }
        }}
        onNodeAction={handleNodeAction}
        onViewEmployees={handleViewEmployees}
        className="bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <Controls className="bg-white shadow-lg rounded-lg border border-gray-200" />
        <Background color="#e5e7eb" gap={20} size={1} className="opacity-30" />
        <MiniMap
          nodeColor="#237804"
          nodeStrokeColor="#1D6303"
          nodeStrokeWidth={2}
          className="bg-white shadow-lg rounded-lg border border-gray-200"
        />
      </ReactFlow>
    </div>
  );
}
