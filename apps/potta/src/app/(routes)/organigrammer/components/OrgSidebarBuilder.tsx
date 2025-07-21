import React, { useState } from 'react';

export interface OrgChart {
  name: string;
  description: string;
  organizationSlug: string;
}

export interface OrgChartNode {
  orgChartName: string;
  name: string;
  title: string;
  parentName: string | null;
  roleType: string;
  standardRole: string;
  email: string;
  department?: string;
}

interface OrgSidebarBuilderProps {
  orgCharts: OrgChart[];
  selectedChart: OrgChart | null;
  onSelectChart: (chart: OrgChart) => void;
  nodes: OrgChartNode[];
  onAddNode: (node: OrgChartNode) => void;
  onAddChart: (chart: OrgChart) => void;
}

export default function OrgSidebarBuilder({
  orgCharts,
  selectedChart,
  onSelectChart,
  onAddChart,
}: OrgSidebarBuilderProps) {
  const [showAddChart, setShowAddChart] = useState(false);
  const [newChart, setNewChart] = useState({
    name: '',
    description: '',
    organizationSlug: '',
  });

  const handleAddChart = () => {
    if (!newChart.name.trim()) return;
    onAddChart(newChart);
    setNewChart({ name: '', description: '', organizationSlug: '' });
    setShowAddChart(false);
  };

  return (
    <div className="bg-white border-r border-gray-200 p-4 w-72 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#154406]">Org Charts</h3>
        <button
          className="text-[#154406] text-2xl font-bold px-2 hover:bg-gray-100"
          onClick={() => setShowAddChart((v) => !v)}
          title="Add Org Chart"
        >
          +
        </button>
      </div>
      {showAddChart && (
        <div className="mb-4 border p-2">
          <input
            className="border px-2 py-1 w-full mb-2"
            placeholder="Name"
            value={newChart.name}
            onChange={(e) =>
              setNewChart((c) => ({ ...c, name: e.target.value }))
            }
          />
          <input
            className="border px-2 py-1 w-full mb-2"
            placeholder="Description"
            value={newChart.description}
            onChange={(e) =>
              setNewChart((c) => ({ ...c, description: e.target.value }))
            }
          />
          <input
            className="border px-2 py-1 w-full mb-2"
            placeholder="Organization Slug"
            value={newChart.organizationSlug}
            onChange={(e) =>
              setNewChart((c) => ({ ...c, organizationSlug: e.target.value }))
            }
          />
          <button
            className="bg-[#154406] text-white px-4 py-1 w-full"
            onClick={handleAddChart}
          >
            Add
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {orgCharts.map((chart) => (
          <button
            key={chart.name}
            className={`text-left px-3 py-2 rounded-lg border transition-all ${
              selectedChart?.name === chart.name
                ? 'bg-[#F3FBFB] border-[#154406] text-[#154406] font-semibold'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectChart(chart)}
          >
            <div className="truncate">{chart.name}</div>
            <div className="text-xs text-gray-400 truncate">
              {chart.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
