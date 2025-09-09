'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  UserAssignment,
  OrganizationalStructure,
  Location,
  GeographicalUnit,
  SubBusiness,
  User,
} from '../types';
import { orgChartApi } from '../utils/api';
import SearchableUserSelect from './SearchableUserSelect';
import InvitationManager from './InvitationManager';

interface UserAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: UserAssignment | null;
  onSave: (assignment: Partial<UserAssignment>) => void;
  preselectedDepartment?: OrganizationalStructure | null;
  preselectedLocation?: Location | null;
  preselectedBusinessUnit?: SubBusiness | null;
  preselectedGeographicalUnit?: GeographicalUnit | null;
  organizationId: string;
}

export default function UserAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSave,
  preselectedDepartment,
  preselectedLocation,
  preselectedBusinessUnit,
  preselectedGeographicalUnit,
  organizationId,
}: UserAssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<UserAssignment>>({
    user_id: '',
    organizational_structure_id: '',
    location_id: '',
    geographical_unit_id: '',
    sub_business_id: '',
    job_title: '',
    responsibilities: '',
    assignment_type: 'PRIMARY',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inheritedFields, setInheritedFields] = useState<Set<string>>(
    new Set()
  );
  const [invitationManagerOpen, setInvitationManagerOpen] = useState(false);

  // Data for dropdowns
  const [departments, setDepartments] = useState<OrganizationalStructure[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [geographicalUnits, setGeographicalUnits] = useState<
    GeographicalUnit[]
  >([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);

  // Load dropdown data
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  const loadDropdownData = async () => {
    try {
      setLoadingData(true);
      const [departmentsRes, locationsRes, geoUnitsRes, subBusinessesRes] =
        await Promise.all([
          orgChartApi.getStructures(organizationId),
          orgChartApi.getLocations(organizationId),
          orgChartApi.getGeographicalUnits(organizationId),
          orgChartApi.getSubBusinesses(organizationId),
        ]);

      setDepartments(departmentsRes.data || []);
      setLocations(locationsRes.data || []);
      setGeographicalUnits(geoUnitsRes.data || []);
      setSubBusinesses(subBusinessesRes.data || []);

      // Debug logging to see the actual data structure
      console.log('Loaded departments:', departmentsRes.data);
      console.log('Loaded locations:', locationsRes.data);
      console.log('Loaded geographical units:', geoUnitsRes.data);
      console.log('Loaded sub-businesses:', subBusinessesRes.data);

      if (departmentsRes.data && departmentsRes.data.length > 0) {
        console.log('First department structure:', departmentsRes.data[0]);
        console.log(
          'First department keys:',
          Object.keys(departmentsRes.data[0])
        );
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        setFormData(assignment);
        // If editing, we need to load the user data
        if (assignment.user_id) {
          loadUserData(assignment.user_id);
        }
      } else {
        // Set initial form data with preselected values
        const initialFormData: Partial<UserAssignment> = {
          user_id: '',
          organizational_structure_id: preselectedDepartment?.id || '',
          location_id: preselectedLocation?.id || '',
          geographical_unit_id: preselectedGeographicalUnit?.id || '',
          sub_business_id: preselectedBusinessUnit?.id || '',
          job_title: '',
          responsibilities: '',
          assignment_type: 'PRIMARY' as const,
          start_date: '',
          end_date: '',
          is_active: true,
        };

        setFormData(initialFormData);
        setSelectedUser(null);

        // If we have a preselected department, trigger inheritance
        if (preselectedDepartment?.id) {
          console.log(
            '🎯 Preselected department detected, triggering inheritance...'
          );
          // Use setTimeout to ensure the form data is set first
          setTimeout(() => {
            handleDepartmentChange(preselectedDepartment.id);
          }, 100);
        }
      }
      setErrors({});
    }
  }, [
    isOpen,
    assignment,
    preselectedDepartment,
    preselectedLocation,
    preselectedBusinessUnit,
    preselectedGeographicalUnit,
  ]);

  // Trigger inheritance when dropdown data is loaded and we have a preselected department
  useEffect(() => {
    if (
      isOpen &&
      !assignment &&
      preselectedDepartment?.id &&
      departments.length > 0 &&
      locations.length > 0 &&
      geographicalUnits.length > 0
    ) {
      console.log(
        '🚀 Data loaded, triggering inheritance for preselected department...'
      );
      handleDepartmentChange(preselectedDepartment.id);
    }
  }, [
    isOpen,
    assignment,
    preselectedDepartment?.id,
    departments.length,
    locations.length,
    geographicalUnits.length,
  ]);

  const loadUserData = async (userId: string) => {
    try {
      const result = await orgChartApi.getUser(organizationId, userId);
      setSelectedUser(result.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // If user manually changes an inherited field, remove it from inherited set
    if (inheritedFields.has(field)) {
      setInheritedFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    console.log('🔄 handleDepartmentChange called with:', departmentId);

    if (!departmentId) {
      console.log('❌ No department ID provided, clearing fields');
      // Clear all related fields if no department selected
      setFormData((prev) => ({
        ...prev,
        organizational_structure_id: '',
        location_id: '',
        geographical_unit_id: '',
        sub_business_id: '',
      }));
      setInheritedFields(new Set());
      return;
    }

    // Find the selected department
    const selectedDepartment = departments.find(
      (dept) => dept.id === departmentId
    );

    if (!selectedDepartment) {
      console.log('❌ Department not found for ID:', departmentId);
      console.log(
        'Available departments:',
        departments.map((d) => ({ id: d.id, name: d.department_name }))
      );
      return;
    }

    console.log('✅ Found selected department:', selectedDepartment);
    console.log('📋 Available fields:', Object.keys(selectedDepartment));

    // Auto-populate related fields based on department's relationships
    const updatedFormData: Partial<UserAssignment> = {
      organizational_structure_id: departmentId,
    };

    const newInheritedFields = new Set<string>();

    // Inherit location from department (direct inheritance)
    console.log('🔍 Checking location_id:', selectedDepartment.location_id);
    if (selectedDepartment.location_id) {
      updatedFormData.location_id = selectedDepartment.location_id;
      newInheritedFields.add('location_id');
      console.log(
        '✅ Inherited location_id from department:',
        selectedDepartment.location_id
      );
    } else {
      console.log('❌ No location_id found in department');
    }

    // Inherit business unit from department (with parent fallback)
    console.log(
      '🔍 Checking sub_business_unit_id:',
      selectedDepartment.sub_business_unit_id
    );
    if (selectedDepartment.sub_business_unit_id) {
      const finalBusinessUnitId = getBusinessUnitWithParentFallback(
        selectedDepartment.sub_business_unit_id
      );
      if (finalBusinessUnitId) {
        updatedFormData.sub_business_id = finalBusinessUnitId;
        newInheritedFields.add('sub_business_id');
        console.log(
          '✅ Inherited sub_business_id from department:',
          finalBusinessUnitId
        );
      }
    } else {
      console.log('❌ No sub_business_unit_id found in department');
    }

    // Find the location to get its geographical unit (cascading inheritance)
    console.log(
      '🔍 Looking for location with ID:',
      selectedDepartment.location_id
    );
    console.log(
      '📋 Available locations:',
      locations.map((l) => ({ id: l.id, name: l.location_name }))
    );

    if (selectedDepartment.location_id) {
      const departmentLocation = locations.find(
        (loc) => loc.id === selectedDepartment.location_id
      );

      if (departmentLocation) {
        console.log('✅ Found department location:', departmentLocation);
        console.log('🔍 Checking geo_unit_id:', departmentLocation.geo_unit_id);

        // Get the geo unit from the location (direct inheritance - no parent fallback)
        if (departmentLocation.geo_unit_id) {
          updatedFormData.geographical_unit_id = departmentLocation.geo_unit_id;
          newInheritedFields.add('geographical_unit_id');
          console.log(
            '✅ Inherited geographical_unit_id from location (direct):',
            departmentLocation.geo_unit_id
          );
        } else {
          console.log('❌ No geo_unit_id found in location');
        }
      } else {
        console.log(
          '❌ Location not found for ID:',
          selectedDepartment.location_id
        );
      }
    }

    console.log('📊 Final updated form data:', updatedFormData);
    console.log('🏷️ Inherited fields:', Array.from(newInheritedFields));

    console.log('🔄 Updating form state...');
    setFormData((prev) => {
      const newFormData = { ...prev, ...updatedFormData };
      console.log('📝 Previous form data:', prev);
      console.log('📝 New form data:', newFormData);
      return newFormData;
    });
    setInheritedFields(newInheritedFields);
    console.log('✅ Form state updated successfully!');

    // Clear any errors for the updated fields
    const fieldsToUpdate = Object.keys(updatedFormData);
    setErrors((prev) => {
      const newErrors = { ...prev };
      fieldsToUpdate.forEach((field) => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  };

  const handleUserSelect = (userId: string, user: User | null) => {
    setSelectedUser(user);
    handleInputChange('user_id', userId);
  };

  const handleInvitationUserSelect = (userId: string, user: any) => {
    setSelectedUser(user);
    handleInputChange('user_id', userId);
    setInvitationManagerOpen(false);
  };

  // Helper function to get business unit with parent fallback
  const getBusinessUnitWithParentFallback = (
    businessUnitId: string
  ): string | null => {
    const businessUnit = subBusinesses.find((sb) => sb.id === businessUnitId);
    if (!businessUnit) return null;

    // If business unit has a parent, return the parent's business unit
    if (businessUnit.parent_sub_business_id) {
      return getBusinessUnitWithParentFallback(
        businessUnit.parent_sub_business_id
      );
    }

    return businessUnitId;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id?.trim()) {
      newErrors.user_id = 'User ID is required';
    }

    if (!formData.organizational_structure_id?.trim()) {
      newErrors.organizational_structure_id = 'Department is required';
    }

    if (!formData.job_title?.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to clean form data by removing empty strings and null values
  const cleanFormData = (
    data: Partial<UserAssignment>
  ): Partial<UserAssignment> => {
    const cleaned: Partial<UserAssignment> = {};

    Object.entries(data).forEach(([key, value]) => {
      // Only include the field if it has a meaningful value
      if (value !== null && value !== undefined && value !== '') {
        (cleaned as any)[key] = value;
      }
    });

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Clean the form data to remove empty strings and null values
      const cleanedFormData = cleanFormData(formData);
      await onSave(cleanedFormData);
      onClose();
    } catch (error) {
      console.error('Error saving user assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {assignment ? 'Edit User Assignment' : 'Add New User Assignment'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inheritance Info */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-blue-500 text-lg">💡</div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Smart Inheritance:</p>
                  <p>
                    When you select a department, the system automatically
                    inherits the department's location, business unit, and
                    geographical unit. You can override any inherited values by
                    changing them manually.
                  </p>
                </div>
              </div>
            </div> */}

            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User *
              </label>
              <SearchableUserSelect
                value={formData.user_id || ''}
                onChange={handleUserSelect}
                placeholder="Search and select a user..."
                error={errors.user_id}
                disabled={loadingData}
                organizationId={organizationId}
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setInvitationManagerOpen(true)}
                  className="text-sm text-[#237804] hover:text-[#1D6303] hover:underline transition-colors"
                >
                  User not found? Manage invitations
                </button>
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.organizational_structure_id || ''}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.organizational_structure_id
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                disabled={loadingData}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              {errors.organizational_structure_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.organizational_structure_id}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.job_title || ''}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.job_title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter job title"
              />
              {errors.job_title && (
                <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>
              )}
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities
              </label>
              <textarea
                value={formData.responsibilities || ''}
                onChange={(e) =>
                  handleInputChange('responsibilities', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                placeholder="Describe the responsibilities for this role"
                rows={3}
              />
            </div>

            {/* Two Column Layout for Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                  {inheritedFields.has('location_id') && (
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Inherited
                    </span>
                  )}
                </label>
                <select
                  value={formData.location_id || ''}
                  onChange={(e) =>
                    handleInputChange('location_id', e.target.value)
                  }
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    inheritedFields.has('location_id')
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  disabled={loadingData}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.location_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Unit Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Unit
                  {inheritedFields.has('sub_business_id') && (
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Inherited
                    </span>
                  )}
                </label>
                <select
                  value={formData.sub_business_id || ''}
                  onChange={(e) =>
                    handleInputChange('sub_business_id', e.target.value)
                  }
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    inheritedFields.has('sub_business_id')
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  disabled={loadingData}
                >
                  <option value="">Select Business Unit</option>
                  {subBusinesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.sub_business_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Geographical Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographical Unit
                {inheritedFields.has('geographical_unit_id') && (
                  <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Inherited
                  </span>
                )}
              </label>
              <select
                value={formData.geographical_unit_id || ''}
                onChange={(e) =>
                  handleInputChange('geographical_unit_id', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  inheritedFields.has('geographical_unit_id')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
                disabled={loadingData}
              >
                <option value="">Select Geographical Unit</option>
                {geographicalUnits.map((geoUnit) => (
                  <option key={geoUnit.id} value={geoUnit.id}>
                    {geoUnit.geo_unit_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Type and Active Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Type
                </label>
                <select
                  value={formData.assignment_type || 'PRIMARY'}
                  onChange={(e) =>
                    handleInputChange('assignment_type', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                >
                  <option value="PRIMARY">Primary</option>
                  <option value="SECONDARY">Secondary</option>
                  <option value="TEMPORARY">Temporary</option>
                  <option value="CONSULTANT">Consultant</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active || false}
                  onChange={(e) =>
                    handleInputChange('is_active', e.target.checked)
                  }
                  className="h-4 w-4 text-[#237804] focus:ring-[#237804] border-gray-300"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active Assignment
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) =>
                    handleInputChange('start_date', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) =>
                    handleInputChange('end_date', e.target.value)
                  }
                  className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingData}
                className="px-4 py-2 text-sm font-medium text-white bg-[#237804] hover:bg-[#1D6303] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? 'Saving...'
                  : assignment
                  ? 'Update Assignment'
                  : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Invitation Manager */}
      <InvitationManager
        isOpen={invitationManagerOpen}
        onClose={() => setInvitationManagerOpen(false)}
        onUserSelect={handleInvitationUserSelect}
        organizationId={organizationId}
      />
    </div>
  );
}
