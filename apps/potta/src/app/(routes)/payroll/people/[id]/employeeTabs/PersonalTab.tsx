import React from 'react';
import { useRoles } from '../../hooks/useRoles';

const PersonalTab = ({ employee }: { employee: any }) => {
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  
  // Use roleName directly from employee data instead of looking up by role_id
  const roleName = employee?.role_name || 'Unknown';

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
        <span className="block text-gray-700 font-semibold">Gender</span>
        <span className="block text-gray-900">
          {employee?.gender || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Marital Status
        </span>
        <span className="block text-gray-900">
          {employee?.marital_status || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Employment Type
        </span>
        <span className="block text-gray-900">
          {employee?.employment_type || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Employment Date
        </span>
        <span className="block text-gray-900">
          {employee?.start_date || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          Tax Payer Number
        </span>
        <span className="block text-gray-900">
          {employee?.tax_payer_number || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold">
          National ID
        </span>
        <span className="block text-gray-900">
          {employee?.national_identification_number || 'Not specified'}
        </span>
      </div>
    </div>
  );
};

export default PersonalTab;
