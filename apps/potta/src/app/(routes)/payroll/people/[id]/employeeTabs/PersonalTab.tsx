import React from 'react';
import { useRoles } from '../../hooks/useRoles';

const PersonalTab = ({ employee }: { employee: any }) => {
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const roleName =
    roles.find((role) => role.uuid === employee?.role_id)?.name || 'Unknown';

  return (
    <div className="max-w-2xl grid grid-cols-2 gap-6 pb-24">
      <div className="col-span-2">
        <span className="block text-gray-700 font-semibold">
          Employee Matricule
        </span>
        <span className="block text-gray-900">
          {employee?.matricule || '#099333'}
        </span>
      </div>
      <div className="col-span-2">
        <span className="block text-gray-700 font-semibold">Job Title</span>
        <span className="block text-gray-900">
          {loadingRoles ? 'Loading...' : roleName}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">First Name</span>
        <span className="block text-gray-900">{employee?.firstName || ''}</span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">Last Name</span>
        <span className="block text-gray-900">{employee?.lastName || ''}</span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Telephone Number
        </span>
        <span className="block text-gray-900">{employee?.phone || '+237'}</span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">Email Address</span>
        <span className="block text-gray-900">
          {employee?.email || 'youremail@gmail.com'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">Birth Date</span>
        <span className="block text-gray-900">
          {employee?.date_of_birth || ''}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Marital Status
        </span>
        <span className="block text-gray-900">
          {employee?.marital_status || 'Married'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">Gender</span>
        <span className="block text-gray-900">
          {employee?.gender || 'Male'}
        </span>
      </div>
    </div>
  );
};

export default PersonalTab;
