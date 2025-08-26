'use client';

import { useEffect } from 'react';
import {
  IoClose,
  IoLocation,
  IoBusiness,
  IoPeople,
  IoGlobe,
  IoPerson,
} from 'react-icons/io5';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: any;
  entityType: string;
}

export default function DetailsModal({
  isOpen,
  onClose,
  entity,
  entityType,
}: DetailsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getEntityIcon = () => {
    switch (entityType) {
      case 'geographical':
        return <IoGlobe className="h-6 w-6 text-blue-500" />;
      case 'location':
        return <IoLocation className="h-6 w-6 text-green-500" />;
      case 'business':
        return <IoBusiness className="h-6 w-6 text-orange-500" />;
      case 'structure':
        return <IoPeople className="h-6 w-6 text-purple-500" />;
      case 'employee':
        return <IoPerson className="h-6 w-6 text-pink-500" />;
      default:
        return <IoBusiness className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEntityTitle = () => {
    switch (entityType) {
      case 'geographical':
        return entity?.geo_unit_name || 'Geographical Unit';
      case 'location':
        return entity?.location_name || 'Location';
      case 'business':
        return entity?.sub_business_name || 'Business Unit';
      case 'structure':
        return entity?.department_name || 'Department';
      case 'employee':
        return entity?.job_title || 'Employee';
      default:
        return 'Entity Details';
    }
  };

  const renderEntityDetails = () => {
    if (!entity) return null;

    switch (entityType) {
      case 'geographical':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {entity.geo_unit_name}
              </p>
            </div>
            {entity.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-700">{entity.description}</p>
              </div>
            )}
            {entity.level && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Level
                </label>
                <p className="text-gray-700">{entity.level}</p>
              </div>
            )}
            {entity.children_count !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Children Count
                </label>
                <p className="text-gray-700">{entity.children_count}</p>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {entity.location_name}
              </p>
            </div>
            {entity.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-gray-700">{entity.address}</p>
              </div>
            )}
            {entity.city && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  City
                </label>
                <p className="text-gray-700">{entity.city}</p>
              </div>
            )}
            {entity.country && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Country
                </label>
                <p className="text-gray-700">{entity.country}</p>
              </div>
            )}
            {entity.latitude && entity.longitude && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Coordinates
                </label>
                <p className="text-gray-700">
                  {entity.latitude}, {entity.longitude}
                </p>
              </div>
            )}
          </div>
        );

      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {entity.sub_business_name}
              </p>
            </div>
            {entity.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-700">{entity.description}</p>
              </div>
            )}
            {entity.max_employees && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Max Employees
                </label>
                <p className="text-gray-700">{entity.max_employees}</p>
              </div>
            )}
          </div>
        );

      case 'structure':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Department Name
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {entity.department_name}
              </p>
            </div>
            {entity.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-700">{entity.description}</p>
              </div>
            )}
            {entity.max_employees && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Max Employees
                </label>
                <p className="text-gray-700">{entity.max_employees}</p>
              </div>
            )}
          </div>
        );

      case 'employee':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Job Title
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {entity.job_title}
              </p>
            </div>
            {entity.first_name && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-700">
                  {entity.first_name} {entity.last_name}
                </p>
              </div>
            )}
            {entity.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-700">{entity.email}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md overflow-auto">
              {JSON.stringify(entity, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getEntityIcon()}
            <h2 className="text-xl font-semibold text-gray-900">Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {getEntityTitle()}
            </h3>
            <div className="w-full h-px bg-gray-200" />
          </div>

          {renderEntityDetails()}
        </div>
      </div>
    </>
  );
}
