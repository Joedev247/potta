'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { orgChartApi } from '../utils/api';
import CreateDropdown from './CreateDropdown';

interface OrgChartActionsProps {
  onAddDepartment: () => void;
  onEditDepartment: (id: string) => void;
  onDeleteDepartment: (id: string) => void;
  onAddLocation: () => void;
  onAddGeographicalUnit: () => void;
  onAddSubBusiness: () => void;
  onAddUserAssignment: () => void;
  onImportData: () => void;
  onExportData: () => void;
  onRefreshData: () => void;
}

export default function OrgChartActions({
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddLocation,
  onAddGeographicalUnit,
  onAddSubBusiness,
  onAddUserAssignment,
  onImportData,
  onExportData,
  onRefreshData,
}: OrgChartActionsProps) {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDepartment = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating department with data:', data);

      // Prepare create data
      const createData = {
        department_name: data.department_name,
        description: data.description,
        structure_type: data.structure_type || 'STANDARD_OFFICE',
        parent_structure_id: data.parent_structure_id || null,
        location_id: data.location_id || null,
        sub_business_unit_id: data.sub_business_unit_id || null,
        max_employees: data.max_employees || 25,
        budget: data.budget || 500000,
        is_active: true,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated department data:', createData);
      const result = await orgChartApi.createStructure(createData);
      console.log('✅ Department created:', result);

      toast.success('Department created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating department:', err);
      toast.error('Failed to create department. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateLocation = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating location with data:', data);

      // Prepare create data
      const createData = {
        location_name: data.location_name,
        address: data.address,
        city: data.city,
        state: data.state || null,
        country: data.country,
        postal_code: data.postal_code || null,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        description: data.description || null,
        capacity: data.capacity || null,
        geo_unit_id: data.geo_unit_id || null,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated location data:', createData);
      const result = await orgChartApi.createLocation(createData);
      console.log('✅ Location created:', result);

      toast.success('Location created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating location:', err);
      toast.error('Failed to create location. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSubBusiness = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating sub-business with data:', data);

      // Prepare create data
      const createData = {
        sub_business_name: data.sub_business_name,
        description: data.description || null,
        industry: data.industry || 'Technology',
        parent_sub_business_id: data.parent_sub_business_id || null,
        location_id: data.location_id || null,
        max_employees: data.max_employees || 50,
        current_employees: data.current_employees || 0,
        annual_revenue: data.annual_revenue || 5000000,
        established_year: data.established_year || new Date().getFullYear(),
        is_active: true,
        website: data.website || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated sub-business data:', createData);
      const result = await orgChartApi.createSubBusiness(createData);
      console.log('✅ Sub-business created:', result);

      toast.success('Business unit created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating sub-business:', err);
      toast.error('Failed to create business unit. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGeographicalUnit = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating geographical unit with data:', data);

      // Prepare create data
      const createData = {
        geo_unit_name: data.geo_unit_name,
        description: data.description || null,
        parent_geo_unit_id: data.parent_geo_unit_id || null,
        level: data.level || 1,
        path: data.path || data.geo_unit_name,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        is_active: true,
      };

      console.log('✅ Validated geographical unit data:', createData);
      const result = await orgChartApi.createGeographicalUnit(createData);
      console.log('✅ Geographical unit created:', result);

      toast.success('Geographical unit created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating geographical unit:', err);
      toast.error('Failed to create geographical unit. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTemplate = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating template with data:', data);

      // Prepare create data
      const createData = {
        template_name: data.template_name,
        template_type: data.template_type || 'STANDARD_OFFICE',
        structure_data: data.structure_data || {},
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated template data:', createData);
      const result = await orgChartApi.createTemplate(createData);
      console.log('✅ Template created:', result);

      toast.success('Template created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating template:', err);
      toast.error('Failed to create template. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateRole = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating role with data:', data);

      // Prepare create data
      const createData = {
        name: data.name,
        permissions: data.permissions || {
          users: [],
          invoices: [],
          reports: [],
        },
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated role data:', createData);
      // const result = await orgChartApi.createRole(createData);
      // console.log('✅ Role created:', result);

      toast.success('Role creation functionality coming soon!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating role:', err);
      toast.error('Failed to create role. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateBusinessGeoAssignment = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('✅ Creating business-geo assignment with data:', data);

      // Prepare create data
      const createData = {
        sub_business_id: data.sub_business_id,
        geographical_unit_id: data.geographical_unit_id,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        operation_type: data.operation_type || 'Regional Office',
        description: data.description || 'Business-Geographical assignment',
        start_date: data.start_date || new Date().toISOString(),
        end_date: data.end_date || null,
        is_active: true,
        employee_count: data.employee_count || 0,
        annual_revenue: data.annual_revenue || 0,
        market_share_percentage: data.market_share_percentage || 0,
        contact_person: data.contact_person || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
      };

      console.log('✅ Validated business-geo assignment data:', createData);
      const result = await orgChartApi.createBusinessGeoAssignment(createData);
      console.log('✅ Business-geo assignment created:', result);

      toast.success('Business-Geographical assignment created successfully!');
      onRefreshData();
      setShowCreateMenu(false);
    } catch (err) {
      console.error('Error creating business-geo assignment:', err);
      toast.error(
        'Failed to create business-geographical assignment. Please try again.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const openCreateModal = (type: string) => {
    setShowCreateMenu(false);

    // Call the appropriate parent handler based on type
    switch (type) {
      case 'department':
        onAddDepartment();
        break;
      case 'location':
        onAddLocation();
        break;
      case 'sub-business':
        onAddSubBusiness();
        break;
      case 'geographical-unit':
        onAddGeographicalUnit();
        break;
      case 'user-assignment':
        onAddUserAssignment();
        break;
      default:
        console.warn('Unknown create type:', type);
    }
  };

  return (
    <div className="mb-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Create Dropdown */}
          <CreateDropdown
            isOpen={showCreateMenu}
            onToggle={() => setShowCreateMenu(!showCreateMenu)}
            onSelectType={openCreateModal}
          />

          <button
            onClick={onExportData}
            className="px-4 py-2 bg-[#A0E86F] text-black hover:bg-[#89D353] transition-colors flex items-center space-x-2"
          >
            <span>Export</span>
          </button>

          <button
            onClick={onImportData}
            className="px-4 py-2 bg-[#A0E86F] text-black hover:bg-[#89D353] transition-colors flex items-center space-x-2"
          >
            <span>Import</span>
          </button>
        </div>

        {/* Help Button */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          ?
        </button>
      </div>

      {/* Help Guide */}
    </div>
  );
}
