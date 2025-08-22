'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OrgChartControls from './components/OrgChartControls';
import OrgChartActions from './components/OrgChartActions';
import DepartmentModal from './components/DepartmentModal';
import UserAssignmentModal from './components/UserAssignmentModal';
import LocationModal from './components/LocationModal';
import GeographicalUnitModal from './components/GeographicalUnitModal';
import SubBusinessModal from './components/SubBusinessModal';
import RoleModal from './components/RoleModal';
import TemplateModal from './components/TemplateModal';
import BusinessGeoAssignmentModal from './components/BusinessGeoAssignmentModal';
import {
  OrganizationalStructure,
  UserAssignment,
  Location,
  GeographicalUnit,
  SubBusiness,
  Role,
  Template,
  BusinessGeoAssignment,
} from './types';
import { orgChartApi } from './utils/api';
import OrgChartFlowComponent from './components/OrgChartFlowComponent';

export default function OrganigramPage() {
  const [viewMode, setViewMode] = useState<
    'hierarchy' | 'location' | 'business'
  >('hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    businessUnit: '',
    geographicalUnit: '',
  });

  // Modal states
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [userAssignmentModalOpen, setUserAssignmentModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [geographicalUnitModalOpen, setGeographicalUnitModalOpen] =
    useState(false);
  const [subBusinessModalOpen, setSubBusinessModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [businessGeoAssignmentModalOpen, setBusinessGeoAssignmentModalOpen] =
    useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<OrganizationalStructure | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<UserAssignment | null>(null);
  const [parentStructure, setParentStructure] =
    useState<OrganizationalStructure | null>(null);

  // Data state for export/import
  const [structures, setStructures] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [subBusinesses, setSubBusinesses] = useState<any[]>([]);
  const [geoUnits, setGeoUnits] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  // CRUD Handlers
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setParentStructure(null);
    setDepartmentModalOpen(true);
  };

  const handleEditDepartment = (id: string) => {
    // TODO: Fetch department by ID and set it
    setSelectedDepartment(null);
    setDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await orgChartApi.deleteStructure(id);
        // TODO: Refresh the organigram data
        console.log('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleSaveDepartment = async (
    department: Partial<OrganizationalStructure>
  ) => {
    try {
      if (selectedDepartment) {
        await orgChartApi.updateStructure(selectedDepartment.id, department);
      } else {
        await orgChartApi.createStructure(department);
      }
      // TODO: Refresh the organigram data
      console.log('Department saved successfully');
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleAddUserAssignment = () => {
    setSelectedAssignment(null);
    setUserAssignmentModalOpen(true);
  };

  const handleSaveUserAssignment = async (
    assignment: Partial<UserAssignment>
  ) => {
    try {
      if (selectedAssignment) {
        await orgChartApi.updateAssignment(selectedAssignment.id, assignment);
      } else {
        await orgChartApi.createAssignment(assignment);
      }
      // TODO: Refresh the organigram data
      console.log('User assignment saved successfully');
    } catch (error) {
      console.error('Error saving user assignment:', error);
    }
  };

  // Additional CRUD Handlers
  const handleAddLocation = () => {
    setLocationModalOpen(true);
  };

  const handleAddGeographicalUnit = () => {
    setGeographicalUnitModalOpen(true);
  };

  const handleAddSubBusiness = () => {
    setSubBusinessModalOpen(true);
  };

  const handleAddRole = () => {
    setRoleModalOpen(true);
  };

  const handleAddTemplate = () => {
    setTemplateModalOpen(true);
  };

  const handleAddBusinessGeoAssignment = () => {
    setBusinessGeoAssignmentModalOpen(true);
  };

  // Save handlers for new modals
  const handleSaveLocation = async (location: Partial<Location>) => {
    try {
      await orgChartApi.createLocation(location);
      console.log('Location saved successfully');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleSaveGeographicalUnit = async (
    geographicalUnit: Partial<GeographicalUnit>
  ) => {
    try {
      await orgChartApi.createGeographicalUnit(geographicalUnit);
      console.log('Geographical unit saved successfully');
    } catch (error) {
      console.error('Error saving geographical unit:', error);
    }
  };

  const handleSaveSubBusiness = async (subBusiness: Partial<SubBusiness>) => {
    try {
      await orgChartApi.createSubBusiness(subBusiness);
      console.log('Sub-business saved successfully');
    } catch (error) {
      console.error('Error saving sub-business:', error);
    }
  };

  const handleSaveRole = async (role: Partial<Role>) => {
    try {
      await orgChartApi.createRole(role);
      console.log('Role saved successfully');
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleSaveTemplate = async (template: Partial<Template>) => {
    try {
      await orgChartApi.createTemplate(template);
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleSaveBusinessGeoAssignment = async (
    businessGeoAssignment: Partial<BusinessGeoAssignment>
  ) => {
    try {
      await orgChartApi.createBusinessGeoAssignment(businessGeoAssignment);
      console.log('Business-Geo assignment saved successfully');
    } catch (error) {
      console.error('Error saving business-geo assignment:', error);
    }
  };

  // Export/Import functionality
  const handleExportData = async () => {
    try {
      console.log('📤 Exporting organigram data...');

      // Get all data for export
      const exportData = {
        structures: structures || [],
        locations: locations || [],
        subBusinesses: subBusinesses || [],
        geoUnits: geoUnits || [],
        templates: templates || [],
        assignments: assignments || [],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organigram-export-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Organigram data exported successfully!');
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handleImportData = async () => {
    try {
      console.log('📥 Importing organigram data...');

      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // Validate import data structure
            if (
              !importData.structures ||
              !importData.locations ||
              !importData.subBusinesses
            ) {
              toast.error('Invalid import file format');
              return;
            }

            // TODO: Implement actual import logic
            // For now, just show success message
            toast.success(
              `Import file loaded: ${importData.structures.length} structures, ${importData.locations.length} locations`
            );

            console.log('📥 Import data:', importData);
          } catch (err) {
            console.error('Error parsing import file:', err);
            toast.error(
              'Failed to parse import file. Please check file format.'
            );
          }
        }
      };
      input.click();
    } catch (err) {
      console.error('Error importing data:', err);
      toast.error('Failed to import data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Organizational Chart
          </h1>
          <p className="text-gray-600 mt-2">
            Interactive organizational hierarchy with real-time employee data
          </p>
        </div>

        {/* Actions */}
        <OrgChartActions
          onAddDepartment={handleAddDepartment}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onAddLocation={handleAddLocation}
          onAddGeographicalUnit={handleAddGeographicalUnit}
          onAddSubBusiness={handleAddSubBusiness}
          onAddRole={handleAddRole}
          onAddTemplate={handleAddTemplate}
          onAddBusinessGeoAssignment={handleAddBusinessGeoAssignment}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onRefreshData={() => {
            // TODO: Implement refresh data functionality
            console.log('Refreshing data...');
          }}
          structures={structures}
        />

        {/* Controls */}
        <OrgChartControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />

        {/* Main Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <OrgChartFlowComponent
            viewMode={viewMode}
            searchTerm={searchTerm}
            filters={selectedFilters}
          />
        </div>

        {/* Modals */}
        <DepartmentModal
          isOpen={departmentModalOpen}
          onClose={() => setDepartmentModalOpen(false)}
          department={selectedDepartment}
          onSave={handleSaveDepartment}
          parentStructure={parentStructure}
        />

        <UserAssignmentModal
          isOpen={userAssignmentModalOpen}
          onClose={() => setUserAssignmentModalOpen(false)}
          assignment={selectedAssignment}
          onSave={handleSaveUserAssignment}
        />

        <LocationModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          location={null}
          onSave={handleSaveLocation}
        />

        <GeographicalUnitModal
          isOpen={geographicalUnitModalOpen}
          onClose={() => setGeographicalUnitModalOpen(false)}
          geographicalUnit={null}
          onSave={handleSaveGeographicalUnit}
        />

        <SubBusinessModal
          isOpen={subBusinessModalOpen}
          onClose={() => setSubBusinessModalOpen(false)}
          subBusiness={null}
          onSave={handleSaveSubBusiness}
        />

        <RoleModal
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          role={null}
          onSave={handleSaveRole}
        />

        <TemplateModal
          isOpen={templateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          template={null}
          onSave={handleSaveTemplate}
        />

        <BusinessGeoAssignmentModal
          isOpen={businessGeoAssignmentModalOpen}
          onClose={() => setBusinessGeoAssignmentModalOpen(false)}
          businessGeoAssignment={null}
          onSave={handleSaveBusinessGeoAssignment}
        />
      </div>
    </div>
  );
}
