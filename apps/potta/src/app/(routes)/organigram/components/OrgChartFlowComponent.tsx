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

interface OrgChartFlowComponentProps {
  viewMode: ViewMode;
  searchTerm: string;
  filters: OrgChartFilters;
  refreshTrigger: number;
  onNodeSelect?: (node: any) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onAction?: (action: string, nodeId: string, entity?: any) => void;
  onViewEmployees?: (filters: any) => void;
}

export default function OrgChartFlowComponent({
  viewMode,
  searchTerm,
  filters,
  refreshTrigger,
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
  const [hierarchicalGeoData, setHierarchicalGeoData] = useState<{
    nodes: Node[];
    edges: Edge[];
    geoUnitTree: (GeographicalUnit & { children: GeographicalUnit[] })[];
  } | null>(null);

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
          orgChartApi.getOrganization(),
          orgChartApi.getStructures(),
          orgChartApi.getAssignments(),
          orgChartApi.getLocations(),
          orgChartApi.getSubBusinesses(),
          orgChartApi.getGeographicalUnitsHierarchy(), // Use hierarchy endpoint for proper tree structure
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

      // Include unit if it matches search OR has matching children
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

    // Apply location filter
    if (filters.location) {
      filteredStructures = filteredStructures.filter(
        (s) => s.location_id === filters.location
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.location_id === filters.location
      );
    }

    // Apply business unit filter
    if (filters.businessUnit) {
      filteredStructures = filteredStructures.filter(
        (s) => s.sub_business_unit_id === filters.businessUnit
      );
      filteredAssignments = filteredAssignments.filter(
        (a) => a.sub_business_id === filters.businessUnit
      );
    }

    // Apply geographical unit filter
    if (filters.geographicalUnit) {
      filteredLocations = filteredLocations.filter(
        (l) => l.geo_unit_id === filters.geographicalUnit
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

  // Action handlers for enhanced nodes
  const handleNodeAction = useCallback(
    (action: string, nodeId: string, entity?: any) => {
      if (onAction) {
        onAction(action, nodeId, entity);
      }
    },
    [onAction]
  );

  const handleViewEmployees = useCallback(
    (filters: any) => {
      if (onViewEmployees) {
        onViewEmployees(filters);
      }
      if (onViewModeChange) {
        onViewModeChange('employees');
      }
    },
    [onViewEmployees, onViewModeChange]
  );

  // Create nodes based on view mode
  const nodes = useMemo(() => {
    if (loading) return [];

    const reactFlowNodes: Node[] = [];
    let nodeId = 0;

    // Always start with the main organization
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
          treeNodes.push(mainOrgNode);

          // Level 1: Geographical Units (Hierarchical)
          const geoUnitTree = filteredData.geoUnits;

          // Debug logs
          console.log('=== GENERAL VIEW DEBUG ===');
          console.log('Geo unit tree:', geoUnitTree);
          console.log('Filtered locations:', filteredData.locations);
          console.log('Filtered structures:', filteredData.structures);
          console.log('Filtered sub businesses:', filteredData.subBusinesses);
          console.log('======================');

          let geoXOffset = 0;
          const geoSpacing = 300;

          const createGeoUnitTree = (
            units: any[],
            level: number = 1,
            parentX: number = 400,
            parentId?: string
          ) => {
            let currentX = parentX - ((units.length - 1) * geoSpacing) / 2;

            units.forEach((unit) => {
              const geoNode: Node = {
                id: `geo-${unit.id}`,
                type: 'headerValueNode',
                position: { x: currentX, y: 50 + level * 120 },
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
                  currentX,
                  `geo-${unit.id}`
                );
              }

              // Add locations under this geographical unit
              const unitLocations = filteredData.locations.filter(
                (l) => l.geo_unit_id === unit.id
              );

              console.log(
                `Locations for geo unit ${unit.geo_unit_name} (${unit.id}):`,
                unitLocations
              );

              if (unitLocations.length > 0) {
                const locationSpacing = 200;
                let locationX =
                  currentX - ((unitLocations.length - 1) * locationSpacing) / 2;

                unitLocations.forEach((location, locIndex) => {
                  const locationNode: Node = {
                    id: `location-${location.id}`,
                    type: 'headerValueNode',
                    position: { x: locationX, y: 50 + (level + 1) * 120 },
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

                  // Add business units under this location
                  const locationStructures = filteredData.structures.filter(
                    (s) => s.location_id === location.id
                  );

                  if (locationStructures.length > 0) {
                    const businessSpacing = 180;
                    let businessX =
                      locationX -
                      ((locationStructures.length - 1) * businessSpacing) / 2;

                    locationStructures.forEach((structure) => {
                      const businessNode: Node = {
                        id: `business-${
                          structure.sub_business_unit_id || structure.id
                        }`,
                        type: 'headerValueNode',
                        position: { x: businessX, y: 50 + (level + 2) * 120 },
                        data: {
                          header: 'Business Unit',
                          value: structure.sub_business_unit_id
                            ? filteredData.subBusinesses.find(
                                (b) => b.id === structure.sub_business_unit_id
                              )?.sub_business_name || 'Business Unit'
                            : 'Business Unit',
                          icon: '🏢',
                          color: '#f59e0b',
                          entity: structure,
                        },
                      };
                      treeNodes.push(businessNode);

                      // Connect business unit to location
                      treeEdges.push({
                        id: `edge-location-${location.id}-business-${
                          structure.sub_business_unit_id || structure.id
                        }`,
                        source: `location-${location.id}`,
                        target: `business-${
                          structure.sub_business_unit_id || structure.id
                        }`,
                        type: 'orgEdge',
                        style: { stroke: '#f59e0b', strokeWidth: 2 },
                      });

                      // Add department under business unit
                      const departmentNode: Node = {
                        id: `structure-${structure.id}`,
                        type: 'headerValueNode',
                        position: { x: businessX, y: 50 + (level + 3) * 120 },
                        data: {
                          header: 'Department',
                          value: structure.department_name,
                          icon: '📊',
                          color: '#8b5cf6',
                          entity: structure,
                        },
                      };
                      treeNodes.push(departmentNode);

                      // Connect department to business unit
                      treeEdges.push({
                        id: `edge-business-${
                          structure.sub_business_unit_id || structure.id
                        }-structure-${structure.id}`,
                        source: `business-${
                          structure.sub_business_unit_id || structure.id
                        }`,
                        target: `structure-${structure.id}`,
                        type: 'orgEdge',
                        style: { stroke: '#8b5cf6', strokeWidth: 2 },
                      });

                      businessX += businessSpacing;
                    });
                  }

                  locationX += locationSpacing;
                });
              }

              currentX += geoSpacing;
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
          const geoSpacing = 300;

          const createGeoHierarchy = (
            units: any[],
            level: number = 0,
            parentX: number = 400,
            parentId?: string
          ) => {
            let currentX = parentX - ((units.length - 1) * geoSpacing) / 2;

            units.forEach((unit) => {
              const geoNode: Node = {
                id: `geo-${unit.id}`,
                type: 'headerValueNode',
                position: { x: currentX, y: 50 + level * 120 },
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
                  currentX,
                  `geo-${unit.id}`
                );
              }

              // Add locations under this geographical unit
              const unitLocations = filteredData.locations.filter(
                (l) => l.geo_unit_id === unit.id
              );

              if (unitLocations.length > 0) {
                const locationSpacing = 200;
                let locationX =
                  currentX - ((unitLocations.length - 1) * locationSpacing) / 2;

                unitLocations.forEach((location) => {
                  const locationNode: Node = {
                    id: `location-${location.id}`,
                    type: 'headerValueNode',
                    position: { x: locationX, y: 50 + (level + 1) * 120 },
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

                  locationX += locationSpacing;
                });
              }

              currentX += geoSpacing;
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
        // Show business units
        const businessNodes = filteredData.subBusinesses.map(
          (business, index) => ({
            id: `business-${business.id}`,
            type: 'headerValueNode',
            position: { x: 200 + index * 300, y: 150 },
            data: {
              header: 'Business Unit',
              value: business.sub_business_name,
              icon: '🏢',
              color: '#f59e0b',
              entity: business,
            },
          })
        );
        reactFlowNodes.push(...businessNodes);
        break;

      case 'organizational':
        // Show organizational structures with hierarchy
        const orgNodes = filteredData.structures.map((structure, index) => {
          const employeeCount = filteredData.assignments.filter(
            (a) => a.organizational_structure_id === structure.id
          ).length;

          return {
            id: `org-${structure.id}`,
            type: 'headerValueNode',
            position: { x: 200 + index * 300, y: 150 },
            data: {
              header: 'Department',
              value: structure.department_name,
              icon: '📊',
              color: '#8b5cf6',
              entity: structure,
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

        let employeeIndex = 0;
        Object.entries(employeeGroups).forEach(
          ([deptName, deptEmployees], deptIndex) => {
            // Add department node
            const deptNode: Node = {
              id: `dept-${deptIndex}`,
              type: 'headerValueNode',
              position: { x: 200 + deptIndex * 400, y: 150 },
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

            // Add employee nodes under department
            deptEmployees.forEach((employee, empIndex) => {
              const employeeNode: Node = {
                id: `employee-${employee.id}`,
                type: 'headerValueNode',
                position: {
                  x: 150 + deptIndex * 400 + (empIndex % 3) * 120,
                  y: 250 + Math.floor(empIndex / 3) * 80,
                },
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
        // Connect main org to business units
        filteredData.subBusinesses.forEach((business) => {
          reactFlowEdges.push({
            id: `main-to-business-${business.id}`,
            source: 'main-org',
            target: `business-${business.id}`,
            type: 'orgEdge',
            style: { stroke: '#f59e0b', strokeWidth: 2 },
          });
        });
        break;

      case 'organizational':
        // Connect main org to organizational structures
        filteredData.structures.forEach((structure) => {
          reactFlowEdges.push({
            id: `main-to-org-${structure.id}`,
            source: 'main-org',
            target: `org-${structure.id}`,
            type: 'orgEdge',
            style: { stroke: '#8b5cf6', strokeWidth: 2 },
          });
        });
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
        onNodeSelect(nodeData);
      }

      // Add double-click functionality for "View Employees"
      if (event.detail === 2) {
        // Double click - switch to employees view with filters
        if (nodeData.type === 'structure' || nodeData.type === 'business') {
          const entity = nodeData.data.entity as any;
          const filters = {
            location: entity?.location_id || '',
            businessUnit: entity?.sub_business_unit_id || entity?.id || '',
            geographicalUnit: entity?.geo_unit_id || '',
          };

          // Trigger view mode change to employees
          if (onViewModeChange) {
            onViewModeChange('employees');
          }

          // You can also update the filters here if needed
          toast.success(
            `Switched to Employees view for ${nodeData.data.label}`
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
