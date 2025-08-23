'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { orgChartApi } from '../utils/api';
import {
  OrganizationalStructure,
  Location,
  SubBusiness,
  GeographicalUnit,
} from '../types';
import CreateDropdown from './CreateDropdown';
import CreateModal from './CreateModal';
import HelpGuide from './HelpGuide';

interface OrgChartActionsProps {
  onAddDepartment: () => void;
  onEditDepartment: (id: string) => void;
  onDeleteDepartment: (id: string) => void;
  onAddLocation: () => void;
  onAddGeographicalUnit: () => void;
  onAddSubBusiness: () => void;
  onAddUserAssignment: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onRefreshData: () => void;
  structures?: any[];
}

export default function OrgChartActions({
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddLocation,
  onAddGeographicalUnit,
  onAddSubBusiness,
  onAddUserAssignment,
  onExportData,
  onImportData,
  onRefreshData,
  structures = [],
}: OrgChartActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  // Enhanced create functions with proper validation
  const handleCreateDepartment = async (
    data: Partial<OrganizationalStructure>
  ) => {
    try {
      setIsCreating(true);
      console.log('➕ Creating department with validation:', data);

      // Validation logic
      if (!data.department_name || data.department_name.trim().length < 2) {
        toast.error('Department name must be at least 2 characters long');
        return;
      }

      if (data.max_employees && data.max_employees <= 0) {
        toast.error('Max employees must be greater than 0');
        return;
      }

      if (data.budget && data.budget < 0) {
        toast.error('Budget cannot be negative');
        return;
      }

      // Prepare create data with proper defaults according to API docs
      const createData = {
        department_name: data.department_name,
        description: data.description || `${data.department_name} department`,
        structure_type: data.structure_type || 'STANDARD_OFFICE',
        parent_structure_id: data.parent_structure_id || undefined,
        location_id: data.location_id || undefined,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        max_employees: data.max_employees || 25,
        budget: data.budget || 500000,
        is_active: true,
      };

      console.log('✅ Validated department data:', createData);
      const result = await orgChartApi.createStructure(createData);
      console.log('✅ Department created:', result);

      toast.success(
        `Department "${createData.department_name}" created successfully!`
      );

      onRefreshData();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating department:', err);
      toast.error('Failed to create department. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateLocation = async (data: Partial<Location>) => {
    try {
      setIsCreating(true);
      console.log('📍 Creating location with validation:', data);

      // Validation logic
      if (!data.location_name || data.location_name.trim().length < 2) {
        toast.error('Location name must be at least 2 characters long');
        return;
      }

      if (!data.address || data.address.trim().length < 5) {
        toast.error('Address must be at least 5 characters long');
        return;
      }

      if (!data.city || data.city.trim().length < 2) {
        toast.error('City must be at least 2 characters long');
        return;
      }

      if (!data.country || data.country.trim().length < 2) {
        toast.error('Country must be at least 2 characters long');
        return;
      }

      // Prepare create data according to API docs
      const createData = {
        location_name: data.location_name,
        address: data.address,
        city: data.city,
        state: data.state || '',
        country: data.country,
        postal_code: data.postal_code || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        description: data.description || `${data.location_name} office`,
        capacity: data.capacity || 50,
        geo_unit_id: data.geo_unit_id || undefined,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
      };

      console.log('✅ Validated location data:', createData);
      console.log(
        '📍 About to send location creation request with geo_unit_id:',
        createData.geo_unit_id
      );
      const result = await orgChartApi.createLocation(createData);
      console.log('✅ Location created:', result);

      toast.success(
        `Location "${createData.location_name}" created successfully!`
      );
      onRefreshData();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating location:', err);
      toast.error('Failed to create location. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSubBusiness = async (data: Partial<SubBusiness>) => {
    try {
      setIsCreating(true);
      console.log('💼 Creating sub-business with validation:', data);

      // Validation logic
      if (!data.sub_business_name || data.sub_business_name.trim().length < 2) {
        toast.error('Business name must be at least 2 characters long');
        return;
      }

      if (data.max_employees && data.max_employees <= 0) {
        toast.error('Max employees must be greater than 0');
        return;
      }

      // Prepare create data according to API docs
      const createData = {
        sub_business_name: data.sub_business_name,
        description:
          data.description || `${data.sub_business_name} business unit`,
        industry: data.industry || 'Technology',
        parent_sub_business_id: data.parent_sub_business_id || undefined,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        max_employees: data.max_employees || 50,
        annual_revenue: data.annual_revenue || 5000000,
        established_year: data.established_year || new Date().getFullYear(),
        is_active: true,
        website: data.website || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
      };

      console.log('✅ Validated sub-business data:', createData);
      const result = await orgChartApi.createSubBusiness(createData);
      console.log('✅ Sub-business created:', result);

      toast.success(
        `Business unit "${createData.sub_business_name}" created successfully!`
      );
      onRefreshData();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating sub-business:', err);
      toast.error('Failed to create business unit. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGeographicalUnit = async (
    data: Partial<GeographicalUnit>
  ) => {
    try {
      setIsCreating(true);
      console.log('🌍 Creating geographical unit with validation:', data);

      // Validation logic
      if (!data.geo_unit_name || data.geo_unit_name.trim().length < 2) {
        toast.error(
          'Geographical unit name must be at least 2 characters long'
        );
        return;
      }

      // Prepare create data according to API docs
      const createData = {
        geo_unit_name: data.geo_unit_name,
        description: data.description || `${data.geo_unit_name} region`,
        parent_geo_unit_id: data.parent_geo_unit_id || undefined,
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        is_active: true,
      };

      console.log('✅ Validated geographical unit data:', createData);
      const result = await orgChartApi.createGeographicalUnit(createData);
      console.log('✅ Geographical unit created:', result);

      toast.success(
        `Geographical unit "${createData.geo_unit_name}" created successfully!`
      );
      onRefreshData();
      setShowCreateModal(false);
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
      console.log('📋 Creating template with validation:', data);

      // Validation logic
      if (!data.template_name || data.template_name.trim().length < 2) {
        toast.error('Template name must be at least 2 characters long');
        return;
      }

      if (!data.description || data.description.trim().length < 10) {
        toast.error('Description must be at least 10 characters long');
        return;
      }

      // Prepare create data
      const createData = {
        template_name: data.template_name,
        description: data.description,
        template_type: data.template_type || 'STANDARD',
        structure_definition: data.structure_definition || {},
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        is_active: true,
      };

      console.log('✅ Validated template data:', createData);
      const result = await orgChartApi.createTemplate(createData);
      console.log('✅ Template created:', result);

      toast.success(
        `Template "${createData.template_name}" created successfully!`
      );
      onRefreshData();
      setShowCreateModal(false);
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
      console.log('👤 Creating role with validation:', data);

      // Validation logic
      if (!data.role_name || data.role_name.trim().length < 2) {
        toast.error('Role name must be at least 2 characters long');
        return;
      }

      if (!data.description || data.description.trim().length < 10) {
        toast.error('Description must be at least 10 characters long');
        return;
      }

      // Prepare create data
      const createData = {
        role_name: data.role_name,
        description: data.description,
        permissions: data.permissions || [],
        organization_id: '876ca221-9ced-4388-8a98-019d2fdd3399',
        is_active: true,
      };

      console.log('✅ Validated role data:', createData);
      const result = await orgChartApi.createRole(createData);
      console.log('✅ Role created:', result);

      toast.success(`Role "${createData.role_name}" created successfully!`);
      onRefreshData();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating role:', err);
      toast.error('Failed to create role. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Export/Import functionality
  const handleExportData = () => {
    try {
      console.log('📤 Exporting organigram data...');
      onExportData();
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handleImportData = () => {
    try {
      console.log('📥 Importing organigram data...');
      onImportData();
    } catch (err) {
      console.error('Error importing data:', err);
      toast.error('Failed to import data. Please try again.');
    }
  };

  const handleCreateBusinessGeoAssignment = async (data: any) => {
    try {
      setIsCreating(true);
      console.log('🔗 Creating business-geo assignment with validation:', data);

      // Validation logic
      if (!data.sub_business_id) {
        toast.error('Business unit is required');
        return;
      }

      if (!data.geographical_unit_id) {
        toast.error('Geographical unit is required');
        return;
      }

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
      setShowCreateModal(false);
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
    setCreateType(type);
    setShowCreateModal(true);
    setShowCreateMenu(false);
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

      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal}
        createType={createType}
        isCreating={isCreating}
        onClose={() => setShowCreateModal(false)}
        onCreateDepartment={handleCreateDepartment}
        onCreateLocation={handleCreateLocation}
        onCreateSubBusiness={handleCreateSubBusiness}
        onCreateGeographicalUnit={handleCreateGeographicalUnit}
        onCreateTemplate={handleCreateTemplate}
        onCreateRole={handleCreateRole}
        onCreateBusinessGeoAssignment={handleCreateBusinessGeoAssignment}
        onCreateUserAssignment={onAddUserAssignment}
      />

      {/* Help Guide */}
      <HelpGuide isVisible={showActions} />
    </div>
  );
}
