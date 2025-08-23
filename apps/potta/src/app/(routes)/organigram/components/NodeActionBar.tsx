'use client';

import { OrgChartNode } from '../types';

interface NodeActionBarProps {
  selectedNode: OrgChartNode | null;
  onAssignEmployee: (nodeId: string) => void;
  onEditDepartment: (nodeId: string) => void;
  onDeleteDepartment: (nodeId: string) => void;
  onAddSubDepartment: (parentId: string) => void;
  onViewDetails: (nodeId: string) => void;
  onClose: () => void;
}

export default function NodeActionBar({
  selectedNode,
  onAssignEmployee,
  onEditDepartment,
  onDeleteDepartment,
  onAddSubDepartment,
  onViewDetails,
  onClose,
}: NodeActionBarProps) {
  if (!selectedNode) return null;

  const getNodeTypeLabel = () => {
    if (selectedNode.level === 1) return 'Root Department';
    if (selectedNode.level === 2) return 'Department';
    if (selectedNode.level === 3) return 'Sub-Department';
    return 'Team';
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#237804]" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedNode.department_name}
              </h3>
              <p className="text-sm text-gray-600">{getNodeTypeLabel()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-[#237804]">
              {selectedNode.current_employees}
            </div>
            <div className="text-xs text-gray-600">Employees</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#237804]">
              ${(selectedNode.budget / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-600">Budget</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#237804]">
              {selectedNode.level}
            </div>
            <div className="text-xs text-gray-600">Level</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Primary Actions */}
          <button
            onClick={() => onAssignEmployee(selectedNode.id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#237804] text-white rounded-lg hover:bg-[#1D6303] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Assign Employee</span>
          </button>

          <button
            onClick={() => onEditDepartment(selectedNode.id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#A0E86F] text-black rounded-lg hover:bg-[#89D353] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Department</span>
          </button>

          {/* Secondary Actions */}
          <button
            onClick={() => onAddSubDepartment(selectedNode.id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Add Sub-Department</span>
          </button>

          <button
            onClick={() => onViewDetails(selectedNode.id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>View Details</span>
          </button>

          {/* Danger Action */}
          <button
            onClick={() => onDeleteDepartment(selectedNode.id)}
            className="col-span-2 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Delete Department</span>
          </button>
        </div>
      </div>
    </div>
  );
}
