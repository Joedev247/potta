'use client';

import { useState } from 'react';
import {
  IoClose,
  IoPencil,
  IoTrash,
  IoAdd,
  IoPeople,
  IoInformation,
  IoLocation,
  IoBusiness,
  IoGlobe,
  IoPerson,
  IoChevronForward,
  IoCopy,
  IoEye,
  IoShieldCheckmark,
} from 'react-icons/io5';
import {
  OrganizationalStructure,
  SubBusiness,
  GeographicalUnit,
  Location,
  UserAssignment,
  Organization,
  NodeAction,
} from '../types';

interface NodeActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: {
    id: string;
    type: string;
    data: {
      label: string;
      description?: string;
      icon?: string;
      color?: string;
      entity?: any;
    };
    position: { x: number; y: number };
  };
  onAction: (action: NodeAction, nodeId: string, entity?: any) => void;
  position?: { x: number; y: number };
}

export default function NodeActionPanel({
  isOpen,
  onClose,
  node,
  onAction,
  position,
}: NodeActionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !node) return null;

  const entity = node.data.entity;
  const nodeType = node.type;

  // Helper function to get entity type
  const getEntityType = () => {
    if (entity?.department_name) return 'department';
    if (entity?.sub_business_name) return 'business';
    if (entity?.geo_unit_name) return 'geographical';
    if (entity?.location_name) return 'location';
    if (entity?.job_title || entity?.user_id) return 'employee';
    if (entity?.name) return 'organization';
    return nodeType;
  };

  const entityType = getEntityType();

  // Get actions based on entity type
  const getActions = () => {
    const baseActions = [
      {
        id: 'view_details',
        label: 'View Details',
        icon: IoEye,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100',
      },
    ];

    switch (entityType) {
      case 'organization':
        return [
          ...baseActions,
          {
            id: 'view_employees',
            label: 'View All Employees',
            icon: IoPeople,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100',
          },
          {
            id: 'view_departments',
            label: 'View All Departments',
            icon: IoBusiness,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 hover:bg-indigo-100',
          },
          {
            id: 'view_locations',
            label: 'View All Locations',
            icon: IoLocation,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 hover:bg-orange-100',
          },
        ];

      case 'department':
        return [
          ...baseActions,
          {
            id: 'edit_department',
            label: 'Edit Department',
            icon: IoPencil,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100',
          },
          {
            id: 'delete_department',
            label: 'Delete Department',
            icon: IoTrash,
            color: 'text-red-600',
            bgColor: 'bg-red-50 hover:bg-red-100',
          },
          {
            id: 'add_child_department',
            label: 'Add Sub-Department',
            icon: IoAdd,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
          {
            id: 'assign_employee',
            label: 'Assign Employee',
            icon: IoPerson,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100',
          },
          {
            id: 'view_employees',
            label: 'View Employees',
            icon: IoPeople,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 hover:bg-indigo-100',
          },
        ];

      case 'business':
        return [
          ...baseActions,
          {
            id: 'edit_business',
            label: 'Edit Business Unit',
            icon: IoPencil,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100',
          },
          {
            id: 'delete_business',
            label: 'Delete Business Unit',
            icon: IoTrash,
            color: 'text-red-600',
            bgColor: 'bg-red-50 hover:bg-red-100',
          },
          {
            id: 'add_child_business',
            label: 'Add Sub-Business Unit',
            icon: IoAdd,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
          {
            id: 'assign_employee',
            label: 'Assign Employee',
            icon: IoPerson,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100',
          },
          {
            id: 'view_employees',
            label: 'View Employees',
            icon: IoPeople,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 hover:bg-indigo-100',
          },
          {
            id: 'view_geo_assignments',
            label: 'View Geo Assignments',
            icon: IoGlobe,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50 hover:bg-teal-100',
          },
        ];

      case 'geographical':
        return [
          ...baseActions,
          {
            id: 'edit_geo_unit',
            label: 'Edit Geographical Unit',
            icon: IoPencil,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100',
          },
          {
            id: 'delete_geo_unit',
            label: 'Delete Geographical Unit',
            icon: IoTrash,
            color: 'text-red-600',
            bgColor: 'bg-red-50 hover:bg-red-100',
          },
          {
            id: 'add_child_geo_unit',
            label: 'Add Sub-Geographical Unit',
            icon: IoAdd,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
          {
            id: 'view_employees',
            label: 'View Employees in Region',
            icon: IoPeople,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100',
          },
          {
            id: 'view_business_assignments',
            label: 'View Business Assignments',
            icon: IoBusiness,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 hover:bg-orange-100',
          },
        ];

      case 'location':
        return [
          ...baseActions,
          {
            id: 'edit_location',
            label: 'Edit Location',
            icon: IoPencil,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100',
          },
          {
            id: 'delete_location',
            label: 'Delete Location',
            icon: IoTrash,
            color: 'text-red-600',
            bgColor: 'bg-red-50 hover:bg-red-100',
          },
          {
            id: 'add_child_location',
            label: 'Add Sub-Location',
            icon: IoAdd,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
          {
            id: 'view_employees',
            label: 'View Employees at Location',
            icon: IoPeople,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100',
          },
          {
            id: 'get_coordinates',
            label: 'Get Coordinates',
            icon: IoLocation,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
        ];

      case 'employee':
        return [
          ...baseActions,
          {
            id: 'edit_employee',
            label: 'Edit Assignment',
            icon: IoPencil,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100',
          },
          {
            id: 'delete_employee',
            label: 'Deactivate Assignment',
            icon: IoShieldCheckmark,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 hover:bg-orange-100',
          },
          {
            id: 'view_user_details',
            label: 'View User Details',
            icon: IoPerson,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100',
          },
          {
            id: 'view_department',
            label: 'View Department',
            icon: IoBusiness,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 hover:bg-indigo-100',
          },
          {
            id: 'view_location',
            label: 'View Location',
            icon: IoLocation,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50 hover:bg-teal-100',
          },
        ];

      default:
        return baseActions;
    }
  };

  const actions = getActions();

  const handleActionClick = (actionId: string) => {
    onAction(actionId as NodeAction, node.id, entity);
    onClose();
  };

  const panelPosition = position || {
    x: node.position.x + 250,
    y: node.position.y - 50,
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white shadow-xl border border-gray-200 min-w-64 max-w-80"
        style={{
          left: `${panelPosition.x}px`,
          top: `${panelPosition.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: node.data.color || '#237804' }}
            >
              {node.data.icon || '🏢'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">
                {node.data.label}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {entityType.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-2">
          <div className="space-y-1">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  disabled={action.disabled}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                    `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{action.label}</span>
                  <IoChevronForward className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with entity info */}
        {entity && (
          <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="text-xs text-gray-600 space-y-1">
              {entity.description && (
                <p className="line-clamp-2">{entity.description}</p>
              )}
              {entity.is_active !== undefined && (
                <p className="flex items-center space-x-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      entity.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span>{entity.is_active ? 'Active' : 'Inactive'}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
