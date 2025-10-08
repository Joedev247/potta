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
  Organization,
} from '../types';
import { orgChartApi } from '../utils/api';
import { CustomOrgEdge } from './CustomOrgEdge';
import OrgChartNode from './OrgChartNode';
import HeaderValueNode from './HeaderValueNode';
import { toast } from 'react-hot-toast';

// Define edgeTypes and nodeTypes outside component to prevent React Flow warnings
const edgeTypes = {
  orgEdge: CustomOrgEdge,
};

const nodeTypes = {
  orgChartNode: OrgChartNode,
  headerValueNode: HeaderValueNode,
};

// Spacing constants to prevent node overlap
const NODE_SPACING = {
  HORIZONTAL: 500, // Minimum horizontal space between nodes (increased from 400)
  VERTICAL: 250, // Minimum vertical space between levels (increased from 200)
  NODE_WIDTH: 280, // Approximate node width
  NODE_HEIGHT: 120, // Approximate node height
  MAX_CHILDREN_PER_ROW: 8, // Maximum children per row before creating new rows
};

interface OrgChartFlowComponentProps {
  viewMode: ViewMode;
  searchTerm: string;
  filters: OrgChartFilters;
  refreshTrigger: number;
  organizationId: string;
  onNodeSelect?: (node: any, event?: React.MouseEvent) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onAction?: (action: string, nodeId: string, entity?: any) => void;
  onViewEmployees?: (filters: any) => void;
}

export default function OrgChartFlowComponent({
  viewMode,
  searchTerm,
  filters,
  refreshTrigger,
  organizationId,
  onNodeSelect,
  onViewModeChange,
  onAction,
  onViewEmployees,
}: OrgChartFlowComponentProps) {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
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
          organizationRes,
          structuresRes,
          assignmentsRes,
          locationsRes,
          subBusinessesRes,
          geoUnitsRes,
        ] = await Promise.all([
          orgChartApi.getOrganization(organizationId),
          orgChartApi.getStructures(organizationId),
          orgChartApi.getAssignments(organizationId),
          orgChartApi.getLocations(organizationId),
          orgChartApi.getSubBusinesses(organizationId),
          orgChartApi.getGeographicalUnitsHierarchy(organizationId),
        ]);

        const organizationData = organizationRes.data;

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

        setOrganization(organizationData);
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

  // Filter hierarchical geographical units while preserving structure
  const filterHierarchicalGeoUnits = (
    units: (GeographicalUnit & { children: GeographicalUnit[] })[],
    searchTerm: string
  ): (GeographicalUnit & { children: GeographicalUnit[] })[] => {
    if (!searchTerm) return units;

    const searchLower = searchTerm.toLowerCase();

    const filterUnit = (
      unit: GeographicalUnit & { children: GeographicalUnit[] }
    ): (GeographicalUnit & { children: GeographicalUnit[] }) | null => {
      const matchesSearch =
        unit.geo_unit_name.toLowerCase().includes(searchLower) ||
        unit.description?.toLowerCase().includes(searchLower);

      const filteredChildren = unit.children
        .map((child) =>
          filterUnit(
            child as GeographicalUnit & { children: GeographicalUnit[] }
          )
        )
        .filter((child) => child !== null) as (GeographicalUnit & {
        children: GeographicalUnit[];
      })[];

      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...unit,
          children: filteredChildren,
        };
      }

      return null;
    };

    return units
      .map((unit) => filterUnit(unit))
      .filter((unit) => unit !== null) as (GeographicalUnit & {
      children: GeographicalUnit[];
    })[];
  };

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filteredStructures = structures;
    let filteredAssignments = assignments;
    let filteredLocations = locations;
    let filteredSubBusinesses = subBusinesses;
    let filteredGeoUnits = geographicalUnits as (GeographicalUnit & {
      children: GeographicalUnit[];
    })[];

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
      filteredGeoUnits = filterHierarchicalGeoUnits(
        geographicalUnits as (GeographicalUnit & {
          children: GeographicalUnit[];
        })[],
        searchTerm
      );
    }

    // Apply geographical unit filter first (higher level)
    if (filters.geographicalUnit) {
      // Filter locations that belong to this geographical unit
      filteredLocations = filteredLocations.filter(
        (l) => l.geographical_unit_id === filters.geographicalUnit
      );

      // Filter assignments that belong to this geographical unit
      filteredAssignments = filteredAssignments.filter(
        (a) => a.geographical_unit_id === filters.geographicalUnit
      );

      // Filter structures that are in locations belonging to this geographical unit
      const locationIdsInGeoUnit = filteredLocations.map((l) => l.id);
      filteredStructures = filteredStructures.filter(
        (s) => s.locationId && locationIdsInGeoUnit.includes(s.locationId)
      );

      // Filter business units that are in locations belonging to this geographical unit
      filteredSubBusinesses = filteredSubBusinesses.filter(
        (b) => b.location_id && locationIdsInGeoUnit.includes(b.location_id)
      );
    }

    // Apply location filter (more specific)
    if (filters.location) {
      // Filter structures that belong to this specific location
      filteredStructures = filteredStructures.filter(
        (s) => s.locationId === filters.location
      );

      // Filter business units that belong to this specific location
      filteredSubBusinesses = filteredSubBusinesses.filter(
        (b) => b.location_id === filters.location
      );

      // Filter assignments that belong to this specific location
      filteredAssignments = filteredAssignments.filter(
        (a) => a.location_id === filters.location
      );
    }

    // Apply business unit filter (most specific)
    if (filters.businessUnit) {
      filteredStructures = filteredStructures.filter(
        (s) => s.sub_business_unit_id === filters.businessUnit
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.sub_business_id === filters.businessUnit
      );
    }

    // Apply enhanced filters
    // Department filter
    if (filters.department) {
      filteredStructures = filteredStructures.filter(
        (s) => s.id === filters.department
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.organizational_structure_id === filters.department
      );
    }

    // Employee status filter
    if (filters.employeeStatus && filters.employeeStatus !== 'all') {
      filteredAssignments = filteredAssignments.filter((a) => {
        if (filters.employeeStatus === 'active') {
          return a.is_active !== false; // Show active (true or undefined)
        } else if (filters.employeeStatus === 'inactive') {
          return a.is_active === false; // Show only inactive
        }
        return true;
      });
    }

    // Structure type filter
    if (filters.structureType) {
      filteredStructures = filteredStructures.filter(
        (s) => s.structure_type === filters.structureType
      );
    }

    // Show only active structures
    if (filters.showOnlyActive) {
      filteredStructures = filteredStructures.filter(
        (s) => s.is_active !== false
      );
      filteredSubBusinesses = filteredSubBusinesses.filter(
        (b) => b.is_active !== false
      );
      // Note: Location interface doesn't have is_active property, so we skip it
      filteredGeoUnits = filteredGeoUnits.filter((g) => g.is_active !== false);
    }

    // Show only structures with employees
    if (filters.showOnlyWithEmployees) {
      const structuresWithEmployees = new Set(
        filteredAssignments.map((a) => a.organizational_structure_id)
      );
      filteredStructures = filteredStructures.filter((s) =>
        structuresWithEmployees.has(s.id)
      );
    }

    // Show only structures with budget
    if (filters.showOnlyWithBudget) {
      filteredStructures = filteredStructures.filter(
        (s) => s.budget && s.budget > 0
      );
    }

    // Max employees filter
    if (filters.maxEmployees) {
      filteredStructures = filteredStructures.filter(
        (s) => !s.max_employees || s.max_employees <= filters.maxEmployees!
      );
    }

    // Budget range filter
    if (filters.budgetRange) {
      filteredStructures = filteredStructures.filter((s) => {
        if (!s.budget) return false;
        const budget = s.budget;
        const min = filters.budgetRange!.min;
        const max = filters.budgetRange!.max;

        if (min !== null && budget < min) return false;
        if (max !== null && budget > max) return false;
        return true;
      });
    }

    // Debug log for employees view
    if (viewMode === 'employees') {
      console.log('Employees View - Filters applied:', filters);
      console.log(
        'Employees View - Filtered assignments count:',
        filteredAssignments.length
      );
      console.log(
        'Employees View - All assignments count:',
        assignments.length
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

  // Helper function to calculate tree layout positions with better space distribution
  const calculateTreeLayout = (
    children: any[],
    parentX: number,
    level: number,
    maxChildrenPerRow: number = NODE_SPACING.MAX_CHILDREN_PER_ROW,
    availableWidth?: number
  ) => {
    if (children.length === 0) return [];

    const positions: Array<{ x: number; y: number; index: number }> = [];

    // For root level children (level 1), use wider spacing to prevent collision
    const horizontalSpacing =
      level === 1 ? NODE_SPACING.HORIZONTAL * 1.6 : NODE_SPACING.HORIZONTAL;
    const effectiveWidth =
      availableWidth || children.length * horizontalSpacing;

    if (children.length <= maxChildrenPerRow) {
      // Single row layout with better distribution
      const totalWidth = (children.length - 1) * horizontalSpacing;
      const startX = parentX - totalWidth / 2;

      children.forEach((_, index) => {
        positions.push({
          x: startX + index * horizontalSpacing,
          y: 100 + level * NODE_SPACING.VERTICAL, // Ensure no nodes above main org (y=50)
          index,
        });
      });
    } else {
      // Multi-row layout - ALWAYS start from the top of the level, never center vertically
      const rows = Math.ceil(children.length / maxChildrenPerRow);
      const startY = 100 + level * NODE_SPACING.VERTICAL; // Start from the top of the level

      children.forEach((_, index) => {
        const row = Math.floor(index / maxChildrenPerRow);
        const col = index % maxChildrenPerRow;
        const childrenInThisRow = Math.min(
          maxChildrenPerRow,
          children.length - row * maxChildrenPerRow
        );

        const totalWidth = (childrenInThisRow - 1) * horizontalSpacing;
        const startX = parentX - totalWidth / 2;

        positions.push({
          x: startX + col * horizontalSpacing,
          y: startY + row * NODE_SPACING.VERTICAL, // Each row goes down from the start
          index,
        });
      });
    }

    return positions;
  };

  // Create nodes based on view mode
  const nodes = useMemo(() => {
    if (loading) return [];

    const reactFlowNodes: Node[] = [];

    // Always start with the main organization at the top
    const mainOrgNode: Node = {
      id: 'main-org',
      type: 'headerValueNode',
      position: { x: 400, y: 50 },
      data: {
        header: 'Main Organization',
        value: organization?.name || 'Organization',
        icon: '🏢',
        color: '#1f2937',
      },
    };
    reactFlowNodes.push(mainOrgNode);

    switch (viewMode) {
      case 'general':
        // Create a proper tree structure with hierarchical positioning
        const createTreeStructure = () => {
          const treeNodes: Node[] = [];
          const treeEdges: Edge[] = [];

          // Level 0: Main Organization (Root)
          treeNodes.push(mainOrgNode);

          // Level 1: Geographical Units (Hierarchical)
          const geoUnitTree = filteredData.geoUnits;

          const createGeoUnitTree = (
            units: any[],
            level: number = 1,
            parentX: number = 400,
            parentId?: string
          ) => {
            // Calculate positions using tree layout algorithm with wider spacing for root level
            const positions = calculateTreeLayout(
              units,
              parentX,
              level,
              8,
              level === 1 ? 1600 : undefined
            );

            units.forEach((unit, index) => {
              const position = positions[index];
              const geoNode: Node = {
                id: `geo-${unit.id}`,
                type: 'headerValueNode',
                position: { x: position.x, y: position.y },
                data: {
                  header: 'Geographical Unit',
                  value: unit.geo_unit_name,
                  icon: '🌍',
                  color: '#3b82f6',
                  entity: unit,
                },
              };
              treeNodes.push(geoNode);

              // Create edge from parent
              if (parentId) {
                treeEdges.push({
                  id: `edge-${parentId}-${unit.id}`,
                  source: parentId,
                  target: `geo-${unit.id}`,
                  type: 'orgEdge',
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                });
              } else {
                // Connect to main org
                treeEdges.push({
                  id: `edge-main-org-${unit.id}`,
                  source: 'main-org',
                  target: `geo-${unit.id}`,
                  type: 'orgEdge',
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                });
              }

              // Recursively create child geographical units
              if (unit.children && unit.children.length > 0) {
                createGeoUnitTree(
                  unit.children,
                  level + 1,
                  position.x,
                  `geo-${unit.id}`
                );
              }

              // Add locations under this geographical unit
              const unitLocations = filteredData.locations.filter(
                (l) => l.geographical_unit_id === unit.id
              );

              if (unitLocations.length > 0) {
                // Calculate location positions using tree layout
                const locationPositions = calculateTreeLayout(
                  unitLocations,
                  position.x,
                  level + 1,
                  3
                );

                unitLocations.forEach((location, locIndex) => {
                  const locationPosition = locationPositions[locIndex];
                  const locationNode: Node = {
                    id: `location-${location.id}`,
                    type: 'headerValueNode',
                    position: { x: locationPosition.x, y: locationPosition.y },
                    data: {
                      header: 'Location',
                      value: location.location_name,
                      icon: '🏢',
                      color: '#10b981',
                      entity: location,
                    },
                  };
                  treeNodes.push(locationNode);

                  // Connect location to geographical unit
                  treeEdges.push({
                    id: `edge-geo-${unit.id}-location-${location.id}`,
                    source: `geo-${unit.id}`,
                    target: `location-${location.id}`,
                    type: 'orgEdge',
                    style: { stroke: '#10b981', strokeWidth: 2 },
                  });

                  // Add departments and business units under this location
                  const locationStructures = filteredData.structures.filter(
                    (s) => s.locationId === location.id
                  );

                  const locationSubBusinesses =
                    filteredData.subBusinesses.filter(
                      (b) => b.location_id === location.id
                    );

                  // Separate departments that belong to business units vs standalone departments
                  const departmentsUnderBusiness = locationStructures.filter(
                    (s) => s.sub_business_unit_id
                  );
                  const standaloneDepartments = locationStructures.filter(
                    (s) => !s.sub_business_unit_id
                  );

                  // Create business units (both direct and from departments)
                  const allBusinessUnits: Array<
                    | {
                        id: string;
                        name: string;
                        type: 'from_structure';
                        structure: OrganizationalStructure;
                      }
                    | {
                        id: string;
                        name: string;
                        type: 'direct';
                        business: SubBusiness;
                      }
                  > = [
                    ...departmentsUnderBusiness.map((structure) => ({
                      id: structure.sub_business_unit_id!,
                      name:
                        filteredData.subBusinesses.find(
                          (b) => b.id === structure.sub_business_unit_id
                        )?.sub_business_name || 'Business Unit',
                      type: 'from_structure' as const,
                      structure: structure,
                    })),
                    ...locationSubBusinesses.map((business) => ({
                      id: business.id,
                      name: business.sub_business_name,
                      type: 'direct' as const,
                      business: business,
                    })),
                  ];

                  // Remove duplicates based on ID
                  const uniqueBusinessUnits = allBusinessUnits.filter(
                    (unit, index, self) =>
                      index === self.findIndex((u) => u.id === unit.id)
                  );

                  // Add standalone departments directly under location
                  if (standaloneDepartments.length > 0) {
                    // Position departments to the left side of the location
                    const departmentPositions = calculateTreeLayout(
                      standaloneDepartments,
                      position.x - NODE_SPACING.HORIZONTAL * 1.2, // More offset to the left
                      level + 2,
                      8
                    );

                    standaloneDepartments.forEach((department, deptIndex) => {
                      const departmentPosition = departmentPositions[deptIndex];
                      const departmentNode: Node = {
                        id: `structure-${department.id}`,
                        type: 'headerValueNode',
                        position: {
                          x: departmentPosition.x,
                          y: departmentPosition.y,
                        },
                        data: {
                          header: 'Department',
                          value: department.department_name,
                          icon: '📊',
                          color: '#8b5cf6',
                          entity: department,
                        },
                      };
                      treeNodes.push(departmentNode);

                      // Connect department directly to location
                      treeEdges.push({
                        id: `edge-location-${location.id}-structure-${department.id}`,
                        source: `location-${location.id}`,
                        target: `structure-${department.id}`,
                        type: 'orgEdge',
                        style: { stroke: '#8b5cf6', strokeWidth: 2 },
                      });
                    });
                  }

                  // Add business units
                  if (uniqueBusinessUnits.length > 0) {
                    // Calculate business unit positions using tree layout
                    // Position business units to the right side of the location
                    const businessPositions = calculateTreeLayout(
                      uniqueBusinessUnits,
                      position.x + NODE_SPACING.HORIZONTAL * 1.2, // More offset to the right
                      level + 2, // Same level as departments but different horizontal position
                      8
                    );

                    uniqueBusinessUnits.forEach((unit, businessIndex) => {
                      const businessPosition = businessPositions[businessIndex];
                      const businessNode: Node = {
                        id: `business-${unit.id}`,
                        type: 'headerValueNode',
                        position: {
                          x: businessPosition.x,
                          y: businessPosition.y,
                        },
                        data: {
                          header: 'Business Unit',
                          value: unit.name,
                          icon: '🏢',
                          color: '#f59e0b',
                          entity:
                            unit.type === 'direct'
                              ? unit.business
                              : unit.structure,
                        },
                      };
                      treeNodes.push(businessNode);

                      // Connect business unit to location
                      treeEdges.push({
                        id: `edge-location-${location.id}-business-${unit.id}`,
                        source: `location-${location.id}`,
                        target: `business-${unit.id}`,
                        type: 'orgEdge',
                        style: { stroke: '#f59e0b', strokeWidth: 2 },
                      });

                      // If this business unit came from a structure, add the department under it
                      if (unit.type === 'from_structure') {
                        const departmentNode: Node = {
                          id: `structure-${unit.structure.id}`,
                          type: 'headerValueNode',
                          position: {
                            x: businessPosition.x,
                            y: businessPosition.y + NODE_SPACING.VERTICAL,
                          },
                          data: {
                            header: 'Department',
                            value: unit.structure.department_name,
                            icon: '📊',
                            color: '#8b5cf6',
                            entity: unit.structure,
                          },
                        };
                        treeNodes.push(departmentNode);

                        // Connect department to business unit
                        treeEdges.push({
                          id: `edge-business-${unit.id}-structure-${unit.structure.id}`,
                          source: `business-${unit.id}`,
                          target: `structure-${unit.structure.id}`,
                          type: 'orgEdge',
                          style: { stroke: '#8b5cf6', strokeWidth: 2 },
                        });
                      }
                    });
                  }
                });
              }
            });
          };

          // Start creating the tree from root geographical units
          createGeoUnitTree(geoUnitTree);

          return { nodes: treeNodes, edges: treeEdges };
        };

        const treeResult = createTreeStructure();
        reactFlowNodes.push(...treeResult.nodes);

        // Store edges for later use
        (window as any).treeEdges = treeResult.edges;
        break;

      case 'geographical':
        // Create hierarchical geographical tree
        const createGeographicalTree = () => {
          const geoNodes: Node[] = [];
          const geoEdges: Edge[] = [];

          const geoUnitTree = filteredData.geoUnits;

          const createGeoHierarchy = (
            units: any[],
            level: number = 1, // Start at level 1 to ensure below main org
            parentX: number = 400,
            parentId?: string
          ) => {
            // Calculate positions using tree layout algorithm with wider spacing for root level
            const positions = calculateTreeLayout(
              units,
              parentX,
              level,
              8,
              level === 1 ? 1600 : undefined
            );

            units.forEach((unit, index) => {
              const position = positions[index];
              const geoNode: Node = {
                id: `geo-${unit.id}`,
                type: 'headerValueNode',
                position: { x: position.x, y: position.y },
                data: {
                  header: 'Geographical Unit',
                  value: unit.geo_unit_name,
                  icon: '🌍',
                  color: '#3b82f6',
                  entity: unit,
                },
              };
              geoNodes.push(geoNode);

              // Create edge from parent
              if (parentId) {
                geoEdges.push({
                  id: `edge-${parentId}-${unit.id}`,
                  source: parentId,
                  target: `geo-${unit.id}`,
                  type: 'orgEdge',
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                });
              } else {
                // Connect to main org
                geoEdges.push({
                  id: `edge-main-org-${unit.id}`,
                  source: 'main-org',
                  target: `geo-${unit.id}`,
                  type: 'orgEdge',
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                });
              }

              // Recursively create child geographical units
              if (unit.children && unit.children.length > 0) {
                createGeoHierarchy(
                  unit.children,
                  level + 1,
                  position.x,
                  `geo-${unit.id}`
                );
              }

              // Add locations under this geographical unit
              const unitLocations = filteredData.locations.filter(
                (l) => l.geo_unit_id === unit.id
              );

              if (unitLocations.length > 0) {
                // Calculate location positions using tree layout
                const locationPositions = calculateTreeLayout(
                  unitLocations,
                  position.x,
                  level + 1,
                  3
                );

                unitLocations.forEach((location, locIndex) => {
                  const locationPosition = locationPositions[locIndex];
                  const locationNode: Node = {
                    id: `location-${location.id}`,
                    type: 'headerValueNode',
                    position: { x: locationPosition.x, y: locationPosition.y },
                    data: {
                      header: 'Location',
                      value: location.location_name,
                      icon: '🏢',
                      color: '#10b981',
                      entity: location,
                    },
                  };
                  geoNodes.push(locationNode);

                  // Connect location to geographical unit
                  geoEdges.push({
                    id: `edge-geo-${unit.id}-location-${location.id}`,
                    source: `geo-${unit.id}`,
                    target: `location-${location.id}`,
                    type: 'orgEdge',
                    style: { stroke: '#10b981', strokeWidth: 2 },
                  });
                });
              }
            });
          };

          // Start creating the tree from root geographical units
          createGeoHierarchy(geoUnitTree);

          return { nodes: geoNodes, edges: geoEdges };
        };

        const geoTreeResult = createGeographicalTree();
        reactFlowNodes.push(...geoTreeResult.nodes);
        (window as any).geoTreeEdges = geoTreeResult.edges;
        break;

      case 'business':
        // Show business units with complete hierarchy (Business Units → Departments → Employees)
        const createBusinessTree = () => {
          const businessNodes: Node[] = [];
          const businessEdges: Edge[] = [];

          if (filteredData.subBusinesses.length > 0) {
            const businessPositions = calculateTreeLayout(
              filteredData.subBusinesses,
              400,
              1,
              8
            );

            filteredData.subBusinesses.forEach((business, index) => {
              const position = businessPositions[index];
              const businessNode: Node = {
                id: `business-${business.id}`,
                type: 'headerValueNode',
                position: { x: position.x, y: position.y },
                data: {
                  header: 'Business Unit',
                  value: business.sub_business_name,
                  icon: '🏢',
                  color: '#f59e0b',
                  entity: business,
                },
              };
              businessNodes.push(businessNode);

              // Connect business unit to main org
              businessEdges.push({
                id: `edge-main-org-business-${business.id}`,
                source: 'main-org',
                target: `business-${business.id}`,
                type: 'orgEdge',
                style: { stroke: '#f59e0b', strokeWidth: 2 },
              });

              // Add departments under this business unit
              const businessDepartments = filteredData.structures.filter(
                (s) => s.sub_business_unit_id === business.id
              );

              if (businessDepartments.length > 0) {
                const departmentPositions = calculateTreeLayout(
                  businessDepartments,
                  position.x,
                  2,
                  8
                );

                businessDepartments.forEach((department, deptIndex) => {
                  const departmentPosition = departmentPositions[deptIndex];
                  const departmentNode: Node = {
                    id: `structure-${department.id}`,
                    type: 'headerValueNode',
                    position: {
                      x: departmentPosition.x,
                      y: departmentPosition.y,
                    },
                    data: {
                      header: 'Department',
                      value: department.department_name,
                      icon: '📊',
                      color: '#8b5cf6',
                      entity: department,
                    },
                  };
                  businessNodes.push(departmentNode);

                  // Connect department to business unit
                  businessEdges.push({
                    id: `edge-business-${business.id}-structure-${department.id}`,
                    source: `business-${business.id}`,
                    target: `structure-${department.id}`,
                    type: 'orgEdge',
                    style: { stroke: '#8b5cf6', strokeWidth: 2 },
                  });

                  // Add employees under this department
                  const departmentEmployees = filteredData.assignments.filter(
                    (a) => a.organizational_structure_id === department.id
                  );

                  if (departmentEmployees.length > 0) {
                    const employeePositions = calculateTreeLayout(
                      departmentEmployees,
                      departmentPosition.x,
                      3,
                      8
                    );

                    departmentEmployees.forEach((employee, empIndex) => {
                      const employeePosition = employeePositions[empIndex];
                      const employeeNode: Node = {
                        id: `employee-${employee.id}`,
                        type: 'headerValueNode',
                        position: {
                          x: employeePosition.x,
                          y: employeePosition.y,
                        },
                        data: {
                          header: 'Employee',
                          value: employee.job_title || 'Employee',
                          icon: '👤',
                          color: '#ec4899',
                          entity: employee,
                        },
                      };
                      businessNodes.push(employeeNode);

                      // Connect employee to department
                      businessEdges.push({
                        id: `edge-structure-${department.id}-employee-${employee.id}`,
                        source: `structure-${department.id}`,
                        target: `employee-${employee.id}`,
                        type: 'orgEdge',
                        style: { stroke: '#ec4899', strokeWidth: 1.5 },
                      });
                    });
                  }
                });
              }
            });
          }

          return { nodes: businessNodes, edges: businessEdges };
        };

        const businessTreeResult = createBusinessTree();
        reactFlowNodes.push(...businessTreeResult.nodes);
        (window as any).businessTreeEdges = businessTreeResult.edges;
        break;

      case 'organizational':
        // Show departments grouped by business units with complete hierarchy
        const createOrganizationalTree = () => {
          const orgNodes: Node[] = [];
          const orgEdges: Edge[] = [];

          // Group departments by business units
          const departmentsByBusiness = filteredData.structures.reduce(
            (groups, structure) => {
              const businessId = structure.sub_business_unit_id || 'standalone';
              if (!groups[businessId]) {
                groups[businessId] = [];
              }
              groups[businessId].push(structure);
              return groups;
            },
            {} as Record<string, OrganizationalStructure[]>
          );

          // Get business unit names for grouping
          const businessUnits = filteredData.subBusinesses;
          const businessPositions = calculateTreeLayout(
            Object.keys(departmentsByBusiness),
            400,
            1,
            8
          );

          Object.entries(departmentsByBusiness).forEach(
            ([businessId, departments], index) => {
              const position = businessPositions[index];
              const businessUnit = businessUnits.find(
                (b) => b.id === businessId
              );
              const businessName = businessUnit
                ? businessUnit.sub_business_name
                : 'Standalone Departments';

              // Add business unit node (or standalone group)
              const businessNode: Node = {
                id: `business-group-${businessId}`,
                type: 'headerValueNode',
                position: { x: position.x, y: position.y },
                data: {
                  header: businessUnit ? 'Business Unit' : 'Department Group',
                  value: businessName,
                  icon: businessUnit ? '🏢' : '📊',
                  color: businessUnit ? '#f59e0b' : '#06b6d4', // Different color for standalone departments
                  entity: businessUnit || {
                    id: businessId,
                    name: businessName,
                  },
                },
              };
              orgNodes.push(businessNode);

              // Connect business unit to main org
              orgEdges.push({
                id: `edge-main-org-business-group-${businessId}`,
                source: 'main-org',
                target: `business-group-${businessId}`,
                type: 'orgEdge',
                style: {
                  stroke: businessUnit ? '#f59e0b' : '#06b6d4', // Different color for standalone departments
                  strokeWidth: 2,
                },
              });

              // Add departments under this business unit
              if (departments.length > 0) {
                const departmentPositions = calculateTreeLayout(
                  departments,
                  position.x,
                  2,
                  8
                );

                departments.forEach((department, deptIndex) => {
                  const departmentPosition = departmentPositions[deptIndex];
                  const departmentNode: Node = {
                    id: `structure-${department.id}`,
                    type: 'headerValueNode',
                    position: {
                      x: departmentPosition.x,
                      y: departmentPosition.y,
                    },
                    data: {
                      header: 'Department',
                      value: department.department_name,
                      icon: '📊',
                      color: '#8b5cf6',
                      entity: department,
                    },
                  };
                  orgNodes.push(departmentNode);

                  // Connect department to business unit
                  orgEdges.push({
                    id: `edge-business-group-${businessId}-structure-${department.id}`,
                    source: `business-group-${businessId}`,
                    target: `structure-${department.id}`,
                    type: 'orgEdge',
                    style: { stroke: '#8b5cf6', strokeWidth: 2 },
                  });

                  // Note: Employees are not shown in organizational view to keep it focused on department structure
                });
              }
            }
          );

          return { nodes: orgNodes, edges: orgEdges };
        };

        const orgTreeResult = createOrganizationalTree();
        reactFlowNodes.push(...orgTreeResult.nodes);
        (window as any).orgTreeEdges = orgTreeResult.edges;
        break;

      case 'employees':
        // Show employees grouped by department with tree layout
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

        // Calculate department positions using tree layout
        const departmentNames = Object.keys(employeeGroups);
        if (departmentNames.length > 0) {
          const deptPositions = calculateTreeLayout(departmentNames, 400, 1, 8);

          Object.entries(employeeGroups).forEach(
            ([deptName, deptEmployees], deptIndex) => {
              const deptPosition = deptPositions[deptIndex];

              // Add department node
              const deptNode: Node = {
                id: `dept-${deptIndex}`,
                type: 'headerValueNode',
                position: { x: deptPosition.x, y: deptPosition.y },
                data: {
                  header: 'Department',
                  value: deptName,
                  icon: '📊',
                  color: '#8b5cf6',
                  entity: {
                    department_name: deptName,
                    employee_count: deptEmployees.length,
                  },
                },
              };
              reactFlowNodes.push(deptNode);

              // Calculate employee positions using tree layout
              if (deptEmployees.length > 0) {
                const employeePositions = calculateTreeLayout(
                  deptEmployees,
                  deptPosition.x,
                  2,
                  8
                );

                // Add employee nodes under department
                deptEmployees.forEach((employee, empIndex) => {
                  const employeePosition = employeePositions[empIndex];
                  const employeeNode: Node = {
                    id: `employee-${employee.id}`,
                    type: 'headerValueNode',
                    position: { x: employeePosition.x, y: employeePosition.y },
                    data: {
                      header: 'Employee',
                      value: employee.job_title || 'Employee',
                      icon: '👤',
                      color: '#ec4899',
                      entity: employee,
                    },
                  };
                  reactFlowNodes.push(employeeNode);
                });
              }
            }
          );
        }
        break;
    }

    return reactFlowNodes;
  }, [viewMode, filteredData, loading, organization]);

  // Create edges based on view mode
  const edges = useMemo(() => {
    const reactFlowEdges: Edge[] = [];

    switch (viewMode) {
      case 'general':
        // Use the tree edges created in the nodes useMemo
        const treeEdges = (window as any).treeEdges || [];
        reactFlowEdges.push(...treeEdges);
        break;

      case 'geographical':
        // Use the geographical tree edges created in the nodes useMemo
        const geoTreeEdges = (window as any).geoTreeEdges || [];
        reactFlowEdges.push(...geoTreeEdges);
        break;

      case 'business':
        // Use the business tree edges created in the nodes useMemo
        const businessTreeEdges = (window as any).businessTreeEdges || [];
        reactFlowEdges.push(...businessTreeEdges);
        break;

      case 'organizational':
        // Use the organizational tree edges created in the nodes useMemo
        const orgTreeEdges = (window as any).orgTreeEdges || [];
        reactFlowEdges.push(...orgTreeEdges);
        break;

      case 'employees':
        // Connect main org to departments, then departments to employees
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
            // Connect main org to department
            reactFlowEdges.push({
              id: `main-to-dept-${deptIndex}`,
              source: 'main-org',
              target: `dept-${deptIndex}`,
              type: 'orgEdge',
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
            });

            // Connect department to employees
            deptEmployees.forEach((employee) => {
              reactFlowEdges.push({
                id: `dept-to-employee-${employee.id}`,
                source: `dept-${deptIndex}`,
                target: `employee-${employee.id}`,
                type: 'orgEdge',
                style: { stroke: '#ec4899', strokeWidth: 1.5 },
              });
            });
          }
        );
        break;
    }

    return reactFlowEdges;
  }, [viewMode, filteredData]);

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] =
    useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(edges);

  // Update nodes and edges when they change
  useEffect(() => {
    setReactFlowNodes(nodes);
  }, [nodes, setReactFlowNodes]);

  useEffect(() => {
    setReactFlowEdges(edges);
  }, [edges, setReactFlowEdges]);

  const onConnect = useCallback(
    (params: Connection) => setReactFlowEdges((eds) => addEdge(params, eds)),
    [setReactFlowEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);

      // Create node object for the action bar
      const nodeData: any = {
        id: node.id,
        type: node.data.entity
          ? (node.data.entity as any).department_name
            ? 'structure'
            : (node.data.entity as any).geo_unit_name
            ? 'geographical'
            : (node.data.entity as any).location_name
            ? 'location'
            : (node.data.entity as any).sub_business_name
            ? 'business'
            : (node.data.entity as any).job_title
            ? 'employee'
            : 'organization'
          : 'organization',
        data: {
          label: node.data.label,
          description: node.data.description,
          icon: node.data.icon,
          color: node.data.color,
          entity: node.data.entity,
        },
        position: node.position,
        children: [],
        employees: [],
      };

      if (onNodeSelect) {
        onNodeSelect(nodeData, event);
      }

      // Add double-click functionality for "View Employees"
      if (event.detail === 2) {
        // Double click - switch to employees view with filters
        if (
          nodeData.type === 'structure' ||
          nodeData.type === 'business' ||
          nodeData.type === 'location'
        ) {
          const entity = nodeData.data.entity as any;

          // Call the onViewEmployees callback with proper filters
          if (onViewEmployees) {
            const filters: any = {};

            // For locations, set both location and geographical unit filters
            if (nodeData.type === 'location') {
              filters.location = entity.id; // Use the location's own ID
              filters.geographicalUnit = entity.geo_unit_id; // Also set the geographical unit
            } else {
              // For other entity types, use the existing logic
              if (entity?.location_id) {
                filters.location = entity.location_id;
              }
              if (entity?.sub_business_unit_id) {
                filters.businessUnit = entity.sub_business_unit_id;
              } else if (entity?.id && entity?.sub_business_name) {
                // If it's a business unit entity itself
                filters.businessUnit = entity.id;
              }
              if (entity?.geo_unit_id) {
                filters.geographicalUnit = entity.geo_unit_id;
              }
            }

            onViewEmployees(filters);
          }

          toast.success(
            `Switched to Employees view for ${
              nodeData.data.value || nodeData.data.label
            }`
          );
        }
      }
    },
    [onNodeSelect, onViewModeChange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237804] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organigram...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
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
    <div className="h-full w-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls className="bg-white shadow-lg rounded-lg border border-gray-200" />
          <Background
            color="#e5e7eb"
            gap={20}
            size={1}
            className="opacity-30"
          />
          <MiniMap
            nodeColor="#237804"
            nodeStrokeColor="#1D6303"
            nodeStrokeWidth={2}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            zoomable
            pannable
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
