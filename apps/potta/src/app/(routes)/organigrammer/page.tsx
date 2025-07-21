'use client';
import React, { useState } from 'react';
import RootLayout from '../layout';
import { ContextData } from '@potta/components/context';
import OrgSidebarBuilder, {
  OrgChart,
  OrgChartNode,
} from './components/OrgSidebarBuilder';
import OrgChartTree from './components/OrgChartTree';

const initialOrgCharts: OrgChart[] = [
  {
    name: 'Instanvi Inc Main Org Chart',
    description: 'Top-level company structure',
    organizationSlug: 'instanvi-inc',
  },
];

const initialOrgChartNodes: OrgChartNode[] = [
  {
    orgChartName: 'Instanvi Inc Main Org Chart',
    name: 'Abayo Smith',
    title: 'CEO',
    parentName: null,
    roleType: 'standard',
    standardRole: 'CEO',
    email: 'abayojoram696@gmail.com.com',
  },
  {
    orgChartName: 'Instanvi Inc Main Org Chart',
    name: 'Blessed Nur',
    title: 'CTO',
    parentName: 'Abayo Smith',
    roleType: 'standard',
    standardRole: 'VP',
    email: 'blessednur67@gmail.com',
    department: 'Engineering',
  },
  {
    orgChartName: 'Instanvi Inc Main Org Chart',
    name: 'Destiny  Fokundem',
    title: 'HR Manager',
    parentName: 'Abayo Smith',
    roleType: 'standard',
    standardRole: 'MANAGER',
    email: 'fokundem653@gmail.com',
    department: 'HR',
  },
];

function getAllDescendants(nodes: OrgChartNode[], name: string): string[] {
  const children = nodes
    .filter((n) => n.parentName === name)
    .map((n) => n.name);
  return children.reduce(
    (acc, child) => acc.concat(child, getAllDescendants(nodes, child)),
    []
  );
}

export default function OrganigrammerPage() {
  const context = React.useContext(ContextData);
  const [orgCharts, setOrgCharts] = useState<OrgChart[]>(initialOrgCharts);
  const [orgChartNodes, setOrgChartNodes] =
    useState<OrgChartNode[]>(initialOrgChartNodes);
  const [selectedChart, setSelectedChart] = useState<OrgChart | null>(
    orgCharts[0]
  );

  const handleAddNode = (node: OrgChartNode) => {
    setOrgChartNodes((prev) => [...prev, node]);
  };

  const handleEditNode = (updated: OrgChartNode) => {
    setOrgChartNodes((prev) =>
      prev.map((n) => (n.name === updated.name ? { ...n, ...updated } : n))
    );
  };

  const handleDeleteNode = (name: string) => {
    setOrgChartNodes((prev) => {
      const toDelete = [name, ...getAllDescendants(prev, name)];
      return prev.filter((n) => !toDelete.includes(n.name));
    });
  };

  const handleAddChart = (chart: OrgChart) => {
    setOrgCharts((prev) => [...prev, chart]);
    setSelectedChart(chart);
  };

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-5 !mt-4' : 'pl-5 !mt-4'
        } pr-5 w-full flex gap-8`}
      >
        {/* Sidebar Builder (now only org chart management) */}
        <OrgSidebarBuilder
          orgCharts={orgCharts}
          selectedChart={selectedChart}
          onSelectChart={setSelectedChart}
          nodes={orgChartNodes}
          onAddNode={() => {}}
          onAddChart={handleAddChart}
        />
        {/* Org Chart Display with node add/edit/delete */}
        <div className="flex-1 min-w-0">
          <OrgChartTree
            orgChart={selectedChart}
            nodes={orgChartNodes}
            onAddNode={handleAddNode}
            onEditNode={handleEditNode}
            onDeleteNode={handleDeleteNode}
          />
        </div>
      </div>
    </RootLayout>
  );
}
