'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  IoChevronDown,
  IoChevronForward,
  IoAdd,
  IoPencil,
  IoTrash,
  IoPeople,
} from 'react-icons/io5';

interface OrgChartNodeData {
  id: string;
  label: string;
  position?: string;
  employeeCount?: number;
  maxEmployees?: number;
  budget?: number;
  isExpanded?: boolean;
  hasChildren?: boolean;
  entity?: any;
  onToggleExpand?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
  onEdit?: (nodeId: string, entity: any) => void;
  onDelete?: (nodeId: string, entity: any) => void;
  onViewEmployees?: (nodeId: string, entity: any) => void;
}

interface OrgChartNodeProps extends NodeProps {
  data: OrgChartNodeData;
}

const OrgChartNode = memo(({ data }: OrgChartNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleExpand) {
      data.onToggleExpand(data.id);
    }
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onAddChild) {
      data.onAddChild(data.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onEdit) {
      data.onEdit(data.id, data.entity);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(data.id, data.entity);
    }
  };

  const handleViewEmployees = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onViewEmployees) {
      data.onViewEmployees(data.id, data.entity);
    }
  };

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-300 shadow-sm"
        style={{ top: '-6px' }}
      />

      <div
        className={`
          bg-white border border-gray-200 shadow-sm
          min-w-[200px] max-w-[280px]
          transition-all duration-200 ease-in-out
          ${isHovered ? 'shadow-md border-gray-300' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            {data.hasChildren && (
              <button
                onClick={handleToggleExpand}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {data.isExpanded ? (
                  <IoChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <IoChevronForward className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {data.label}
              </h3>
              {data.position && (
                <p className="text-xs text-gray-500 truncate">
                  {data.position}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Employee Count */}
          {data.employeeCount !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <IoPeople className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">Employees</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {data.employeeCount}
                {data.maxEmployees && `/${data.maxEmployees}`}
              </span>
            </div>
          )}

          {/* Budget */}
          {data.budget && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Budget</span>
              <span className="text-sm font-medium text-gray-900">
                ${(data.budget / 1000).toFixed(0)}k
              </span>
            </div>
          )}

          {/* Action Buttons */}
          {isHovered && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex space-x-1">
                <button
                  onClick={handleAddChild}
                  className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                  title="Add Child"
                >
                  <IoAdd className="w-3 h-3" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-gray-50 text-gray-600 rounded transition-colors"
                  title="Edit"
                >
                  <IoPencil className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                  title="Delete"
                >
                  <IoTrash className="w-3 h-3" />
                </button>
              </div>
              {data.employeeCount && data.employeeCount > 0 && (
                <button
                  onClick={handleViewEmployees}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Team
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-gray-300 shadow-sm"
        style={{ bottom: '-6px' }}
      />
    </div>
  );
});

OrgChartNode.displayName = 'OrgChartNode';

export default OrgChartNode;
