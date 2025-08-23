'use client';

import CreateDepartmentForm from './CreateDepartmentForm';
import CreateLocationForm from './CreateLocationForm';
import CreateSubBusinessForm from './CreateSubBusinessForm';
import CreateGeographicalUnitForm from './CreateGeographicalUnitForm';
import CreateTemplateForm from './CreateTemplateForm';
// import CreateRoleForm from './CreateRoleForm';
import CreateBusinessGeoAssignmentForm from './CreateBusinessGeoAssignmentForm';
import {
  OrganizationalStructure,
  Location,
  SubBusiness,
  GeographicalUnit,
  BusinessGeoAssignment,
} from '../types';

interface CreateModalProps {
  isOpen: boolean;
  createType: string;
  isCreating: boolean;
  onClose: () => void;
  onCreateDepartment: (data: Partial<OrganizationalStructure>) => Promise<void>;
  onCreateLocation: (data: Partial<Location>) => Promise<void>;
  onCreateSubBusiness: (data: Partial<SubBusiness>) => Promise<void>;
  onCreateGeographicalUnit: (data: Partial<GeographicalUnit>) => Promise<void>;
  onCreateTemplate: (data: any) => Promise<void>;
  onCreateRole: (data: any) => Promise<void>;
  onCreateBusinessGeoAssignment: (
    data: Partial<BusinessGeoAssignment>
  ) => Promise<void>;
  onCreateUserAssignment: () => void;
}

export default function CreateModal({
  isOpen,
  createType,
  isCreating,
  onClose,
  onCreateDepartment,
  onCreateLocation,
  onCreateSubBusiness,
  onCreateGeographicalUnit,
  onCreateTemplate,
  onCreateRole,
  onCreateBusinessGeoAssignment,
  onCreateUserAssignment,
}: CreateModalProps) {
  const getModalTitle = () => {
    switch (createType) {
      case 'department':
        return 'Create New Department';
      case 'location':
        return 'Create New Location';
      case 'sub-business':
        return 'Create New Business Unit';
      case 'geographical-unit':
        return 'Create New Geographical Unit';
      case 'template':
        return 'Create New Template';
      case 'role':
        return 'Create New Role';
      case 'business-geo-assignment':
        return 'Create Business-Geographical Assignment';
      case 'user-assignment':
        return 'Assign Employee';
      default:
        return 'Create New Item';
    }
  };

  // no we just fetch roles pls we dont create it here we will just be assigning roles
  const renderForm = () => {
    switch (createType) {
      case 'department':
        return (
          <CreateDepartmentForm
            onSubmit={onCreateDepartment}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'location':
        return (
          <CreateLocationForm
            onSubmit={onCreateLocation}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'sub-business':
        return (
          <CreateSubBusinessForm
            onSubmit={onCreateSubBusiness}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'geographical-unit':
        return (
          <CreateGeographicalUnitForm
            onSubmit={onCreateGeographicalUnit}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'template':
        return (
          <CreateTemplateForm
            onSubmit={onCreateTemplate}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'role':
        return (
          // <CreateRoleForm
          //   onSubmit={onCreateRole}
          //   onCancel={onClose}
          //   isCreating={isCreating}
          // />
          null
        );
      case 'business-geo-assignment':
        return (
          <CreateBusinessGeoAssignmentForm
            onSubmit={onCreateBusinessGeoAssignment}
            onCancel={onClose}
            isCreating={isCreating}
          />
        );
      case 'user-assignment':
        // For user assignments, we'll call the parent handler to open the UserAssignmentModal
        onCreateUserAssignment();
        onClose();
        return null;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isCreating}
          >
            ✕
          </button>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
