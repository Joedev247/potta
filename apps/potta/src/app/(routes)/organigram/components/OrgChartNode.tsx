'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { OrgChartNode as OrgChartNodeType } from '../types';

interface CustomNodeProps extends NodeProps {
  data: OrgChartNodeType;
  onToggle?: (nodeId: string) => void;
  onClick?: (node: OrgChartNodeType) => void;
}

const OrgChartNode = memo(({ data, onToggle, onClick }: CustomNodeProps) => {
  const hasChildren = data.children && data.children.length > 0;
  const isExpanded = data.expanded;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(data.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(data);
    }
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-[#237804]', // CEO - Primary green
      'bg-[#3C9D39]', // VP - Darker green
      'bg-[#53B550]', // Director - Medium green
      'bg-[#78C576]', // Manager - Light green
      'bg-[#9DD59C]', // Team Lead - Lighter green
      'bg-[#C2E5C1]', // Employee - Lightest green
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />

      <div
        className={`
          bg-white border-2 border-gray-200 rounded-lg shadow-md p-4 min-w-[200px] max-w-[250px]
          hover:shadow-lg transition-all duration-200 cursor-pointer
          ${data.is_active ? 'border-[#237804]' : 'border-gray-300 opacity-75'}
        `}
        onClick={handleClick}
      >
        {/* Department Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getLevelColor(data.level)}`}
            />
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {data.department_name}
            </h3>
          </div>
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Employee Count */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Employees</span>
          <span className="text-sm font-medium text-gray-900">
            {data.current_employees}/{data.max_employees}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600">Budget</span>
          <span className="text-sm font-medium text-[#237804]">
            ${data.budget.toLocaleString()}
          </span>
        </div>

        {/* Employee List */}
        {data.employees.length > 0 && (
          <div className="border-t border-gray-100 pt-2">
            <div className="text-xs text-gray-500 mb-1">Team Members:</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {data.employees.slice(0, 3).map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-2 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-[#237804]" />
                  <span className="text-gray-700 truncate">
                    {employee.job_title || 'Employee'}
                  </span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      employee.assignment_type === 'PRIMARY'
                        ? 'bg-[#237804] text-white'
                        : employee.assignment_type === 'SECONDARY'
                        ? 'bg-[#A0E86F] text-black'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {employee.assignment_type}
                  </span>
                </div>
              ))}
              {data.employees.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{data.employees.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              data.is_active
                ? 'bg-[#E6F4E6] text-[#237804]'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {data.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
});

OrgChartNode.displayName = 'OrgChartNode';

export default OrgChartNode;
