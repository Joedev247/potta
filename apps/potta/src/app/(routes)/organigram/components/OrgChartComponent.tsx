'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';
import {
  ViewMode,
  OrgChartFilters,
  OrgChartNode as OrgChartNodeData,
  OrganizationalStructure,
  UserAssignment,
} from '../types';
import { orgChartApi } from '../utils/api';
import OrgChartTable from './OrgChartTable';

interface OrgChartComponentProps {
  viewMode: ViewMode;
  searchTerm: string;
  filters: OrgChartFilters;
}

export default function OrgChartComponent({
  viewMode,
  searchTerm,
  filters,
}: OrgChartComponentProps) {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [structuresRes, assignmentsRes] = await Promise.all([
          orgChartApi.getStructures(),
          orgChartApi.getAssignments(),
        ]);

        console.log('API Response - Structures:', structuresRes);
        console.log('API Response - Assignments:', assignmentsRes);

        // Handle different response formats
        const structuresData = Array.isArray(structuresRes.data)
          ? structuresRes.data
          : (structuresRes.data as any)?.data || [];

        const assignmentsData = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : (assignmentsRes.data as any)?.data || [];

        setStructures(structuresData);
        setAssignments(assignmentsData);
      } catch (err) {
        console.error('Error loading org chart data:', err);
        setError('Failed to load organizational data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convert data to d3-org-chart format
  const orgChartData = useMemo(() => {
    if (!structures.length) return [];

    console.log('Converting data to d3-org-chart format');

    // Create a flat array of nodes in the format expected by d3-org-chart
    const chartData: any[] = [];

    // Add root node (HQ)
    const rootStructure = structures.find((s) => s.level === 1);
    if (rootStructure) {
      const rootEmployees = assignments.filter(
        (assignment) =>
          assignment.organizational_structure_id === rootStructure.id
      );

      chartData.push({
        id: rootStructure.id,
        parentId: null, // Root has no parent
        name: rootStructure.department_name,
        imageUrl:
          'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg',
        department: 'Corporate',
        profileUrl: 'http://example.com/employee/profile',
        office: 'CEO office',
        tags: 'Ceo,tag1, tag2',
        isManager: true,
        jobTitle: 'CEO',
        employees: rootEmployees,
        structure: rootStructure,
      });

      // Add all level 2 departments as children of root
      structures.forEach((structure) => {
        if (structure.level === 2) {
          const nodeEmployees = assignments.filter(
            (assignment) =>
              assignment.organizational_structure_id === structure.id
          );

          chartData.push({
            id: structure.id,
            parentId: rootStructure.id, // Parent is the root
            name: structure.department_name,
            imageUrl:
              'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg',
            department: 'Corporate',
            profileUrl: 'http://example.com/employee/profile',
            office: 'CEO office',
            tags: 'Department,tag1, tag2',
            isManager: false,
            jobTitle: 'Department Head',
            employees: nodeEmployees,
            structure: structure,
          });
        }
      });
    } else {
      // Fallback: if no root, create one and add all as children
      const virtualRootId = 'virtual-root';

      chartData.push({
        id: virtualRootId,
        parentId: null,
        name: 'Organization',
        imageUrl:
          'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg',
        department: 'Corporate',
        profileUrl: 'http://example.com/employee/profile',
        office: 'CEO office',
        tags: 'Ceo,tag1, tag2',
        isManager: true,
        jobTitle: 'CEO',
        employees: [],
        structure: null,
      });

      structures.forEach((structure) => {
        const nodeEmployees = assignments.filter(
          (assignment) =>
            assignment.organizational_structure_id === structure.id
        );

        chartData.push({
          id: structure.id,
          parentId: virtualRootId,
          name: structure.department_name,
          imageUrl:
            'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg',
          department: 'Corporate',
          profileUrl: 'http://example.com/employee/profile',
          office: 'CEO office',
          tags: 'Department,tag1, tag2',
          isManager: false,
          jobTitle: 'Department Head',
          employees: nodeEmployees,
          structure: structure,
        });
      });
    }

    console.log('Chart data:', chartData);
    return chartData;
  }, [structures, assignments]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    if (!orgChartData.length) return [];

    let filtered = orgChartData;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchLower) ||
          node.employees.some((emp: any) =>
            emp.job_title?.toLowerCase().includes(searchLower)
          );
        return matchesSearch;
      });
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((node) => {
        const matchesLocation =
          node.structure?.location_id === filters.location;
        return matchesLocation;
      });
    }

    // Apply business unit filter
    if (filters.businessUnit) {
      filtered = filtered.filter((node) => {
        const matchesBusinessUnit = node.employees.some(
          (emp: any) => emp.sub_business_id === filters.businessUnit
        );
        return matchesBusinessUnit;
      });
    }

    // Apply geographical unit filter
    if (filters.geographicalUnit) {
      filtered = filtered.filter((node) => {
        const matchesGeoUnit = node.employees.some(
          (emp: any) => emp.geographical_unit_id === filters.geographicalUnit
        );
        return matchesGeoUnit;
      });
    }

    return filtered;
  }, [orgChartData, searchTerm, filters]);

  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const newExpanded = new Set(expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      setExpandedNodes(newExpanded);
    },
    [expandedNodes]
  );

  const handleNodeClick = useCallback((node: OrgChartNodeData) => {
    console.log('Node clicked:', node);
    // TODO: Implement node click handler (e.g., show details modal)
  }, []);

  // Initialize d3-org-chart
  useEffect(() => {
    if (!chartRef.current || viewMode !== 'hierarchy' || !filteredData.length)
      return;

    // Clear previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.clear();
    }

    const chart = new OrgChart();

    // Available positioning options for d3-org-chart:
    // .childrenMargin(() => 80) - Distance between parent and children
    // .compactMarginBetween(() => 40) - Distance between sibling nodes
    // .compactMarginPair(() => 50) - Distance for compact layout
    // .nodeWidth(() => 220) - Width of each node
    // .nodeHeight(() => 140) - Height of each node
    // .buttonContent() - Custom expand/collapse button
    // .nodeContent() - Custom node content
    // .linkUpdate() - Custom link styling
    // .onNodeClick() - Node click handler
    // .onNodeUpdate() - Node update handler
    // .onLinkUpdate() - Link update handler
    // .onButtonClick() - Button click handler
    // .onNodeMouseOver() - Node hover handler
    // .onNodeMouseOut() - Node leave handler
    // .onLinkMouseOver() - Link hover handler
    // .onLinkMouseOut() - Link leave handler
    // .onZoom() - Zoom handler
    // .onPan() - Pan handler
    // .onFit() - Fit handler
    // .onCenter() - Center handler
    // .onExpand() - Expand handler
    // .onCollapse() - Collapse handler
    // .onAdd() - Add node handler
    // .onRemove() - Remove node handler
    // .onUpdate() - Update handler
    // .onRender() - Render handler
    // .onClear() - Clear handler
    // .onDestroy() - Destroy handler

    chart
      .container(chartRef.current as any)
      .data(filteredData)
      .nodeWidth(() => 220)
      .nodeHeight(() => 140)
      .childrenMargin(() => 80) // Increased spacing between parent and children
      .compactMarginBetween(() => 40) // Increased spacing between sibling nodes
      .compactMarginPair(() => 50) // Increased spacing for compact layout
      .nodeContent((d: any) => {
        return `
            <div style="
              background-color: white;
              border: 2px solid #237804;
              border-radius: 0;
              padding: 10px;
              width: 200px;
              height: 120px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
                             cursor: pointer;
              position: relative;
            ">
              
              <div style="
                font-weight: bold;
                color: #237804;
                font-size: 14px;
                margin-bottom: 5px;
                text-align: center;
              ">${d.data.name}</div>
              <div style="
                color: #666;
                font-size: 12px;
                text-align: center;
              ">${d.data.employees?.length || 0} employee${
          (d.data.employees?.length || 0) !== 1 ? 's' : ''
        }</div>
              <div style="
                color: #999;
                font-size: 10px;
                text-align: center;
                margin-top: 5px;
              ">${d.data.jobTitle}</div>
            </div>
          `;
      })
      .linkUpdate(function (this: any, d: any, i: any, arr: any) {
        d3.select(this).attr('stroke', '#237804').attr('stroke-width', 2);
      })
      .onNodeClick((d: any) => {
        handleNodeClick(d.data);
      })
      .render();

    // Add basic interactivity
    setTimeout(() => {
      try {
        // Add hover effects to nodes
        const nodes = d3.select(chartRef.current).selectAll('.node');
        if (nodes.size() > 0) {
          nodes
            .on('mouseover', function () {
              d3.select(this).style('opacity', 0.8);
            })
            .on('mouseout', function () {
              d3.select(this).style('opacity', 1);
            });
        }
      } catch (error) {
        console.log('Interactivity not available:', error);
      }
    }, 100);

    chartInstanceRef.current = chart;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.clear();
      }
    };
  }, [filteredData, viewMode, handleNodeToggle, handleNodeClick]);

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
            className="mt-4 px-4 py-2 bg-[#237804]  text-white hover:bg-[#1D6303]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!filteredData.length) {
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
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* View Mode Toggle */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {structures.length} department{structures.length !== 1 ? 's' : ''}{' '}
          found
        </div>
      </div>

      {/* Org Chart Display */}
      <div className="min-h-[600px] overflow-auto">
        {viewMode === 'hierarchy' ? (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div ref={chartRef} className="w-full h-full"></div>
          </div>
        ) : (
          <OrgChartTable
            data={filteredData}
            viewMode={viewMode}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#E6F4E6] p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#237804]">
              {structures.length}
            </div>
            <div className="text-sm text-[#1D6303]">Total Departments</div>
          </div>
          <div className="bg-[#F3FCE9] p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#548F2B]">
              {assignments.length}
            </div>
            <div className="text-sm text-[#3A621E]">Total Employees</div>
          </div>
          <div className="bg-[#E6F4E6] p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#237804]">
              {structures.filter((s) => s.is_active).length}
            </div>
            <div className="text-sm text-[#1D6303]">Active Departments</div>
          </div>
          <div className="bg-[#F3FCE9] p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#548F2B]">
              {assignments.filter((a) => a.is_active).length}
            </div>
            <div className="text-sm text-[#3A621E]">Active Employees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
