'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import OrgChartControls from './components/OrgChartControls';
import OrgChartActions from './components/OrgChartActions';
import DepartmentModal from './components/DepartmentModal';
import UserAssignmentModal from './components/UserAssignmentModal';
import LocationModal from './components/LocationModal';
import GeographicalUnitModal from './components/GeographicalUnitModal';
import SubBusinessModal from './components/SubBusinessModal';
import {
  OrganizationalStructure,
  UserAssignment,
  Location,
  GeographicalUnit,
  SubBusiness,
  ViewMode,
  OrgChartNode,
  Organization,
} from './types';
import { orgChartApi } from './utils/api';
import OrgChartFlowComponent from './components/OrgChartFlowComponent';
import NodeActionBar from './components/NodeActionBar';

export default function OrganigramPage() {
  // Updated view mode to start with general
  const [viewMode, setViewMode] = useState<ViewMode>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    businessUnit: '',
    geographicalUnit: '',
  });

  // Add refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states - only necessary ones
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [userAssignmentModalOpen, setUserAssignmentModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [geographicalUnitModalOpen, setGeographicalUnitModalOpen] =
    useState(false);
  const [subBusinessModalOpen, setSubBusinessModalOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<OrganizationalStructure | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<UserAssignment | null>(null);
  const [selectedGeographicalUnit, setSelectedGeographicalUnit] =
    useState<GeographicalUnit | null>(null);
  const [parentStructure, setParentStructure] =
    useState<OrganizationalStructure | null>(null);

  // Add selected node state for action bar
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);

  // Data state for comprehensive structure
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [subBusinesses, setSubBusinesses] = useState<SubBusiness[]>([]);
  const [geoUnits, setGeoUnits] = useState<GeographicalUnit[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, [refreshTrigger]);

  const loadAllData = async () => {
    try {
      const [
        structuresRes,
        locationsRes,
        subBusinessesRes,
        geoUnitsRes,
        assignmentsRes,
      ] = await Promise.all([
        orgChartApi.getStructures(),
        orgChartApi.getLocations(),
        orgChartApi.getSubBusinesses(),
        orgChartApi.getGeographicalUnits(),
        orgChartApi.getAssignments(),
      ]);

      setStructures(structuresRes.data || []);
      setLocations(locationsRes.data || []);
      setSubBusinesses(subBusinessesRes.data || []);
      setGeoUnits(geoUnitsRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load organigram data');
    }
  };

  // CRUD Handlers
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setParentStructure(null);
    setDepartmentModalOpen(true);
  };

  const handleEditDepartment = (id: string) => {
    const department = structures.find((s) => s.id === id);
    if (department) {
      setSelectedDepartment(department);
      setDepartmentModalOpen(true);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await orgChartApi.deleteStructure(id);
        setRefreshTrigger((prev) => prev + 1);
        toast.success('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const handleSaveDepartment = async (
    formData: Partial<OrganizationalStructure>
  ) => {
    try {
      if (selectedDepartment) {
        await orgChartApi.updateStructure(selectedDepartment.id, formData);
        toast.success('Department updated successfully');
      } else {
        await orgChartApi.createStructure(formData);
        toast.success('Department created successfully');
      }
      setDepartmentModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
    }
  };

  const handleAddUserAssignment = () => {
    setSelectedAssignment(null);
    setUserAssignmentModalOpen(true);
  };

  const handleSaveUserAssignment = async (
    formData: Partial<UserAssignment>
  ) => {
    try {
      if (selectedAssignment) {
        await orgChartApi.updateAssignment(selectedAssignment.id, formData);
        toast.success('User assignment updated successfully');
      } else {
        await orgChartApi.createAssignment(formData);
        toast.success('User assignment created successfully');
      }
      setUserAssignmentModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving user assignment:', error);
      toast.error('Failed to save user assignment');
    }
  };

  const handleAddLocation = () => {
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async (formData: Partial<Location>) => {
    try {
      await orgChartApi.createLocation(formData);
      setLocationModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Location created successfully');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  const handleAddGeographicalUnit = () => {
    setSelectedGeographicalUnit(null);
    setGeographicalUnitModalOpen(true);
  };

  const handleEditGeographicalUnit = (id: string) => {
    const geoUnit = geoUnits.find((g) => g.id === id);
    if (geoUnit) {
      setSelectedGeographicalUnit(geoUnit);
      setGeographicalUnitModalOpen(true);
    }
  };

  const handleDeleteGeographicalUnit = async (id: string) => {
    if (confirm('Are you sure you want to delete this geographical unit?')) {
      try {
        await orgChartApi.deleteGeographicalUnit(id);
        setRefreshTrigger((prev) => prev + 1);
        toast.success('Geographical unit deleted successfully');
      } catch (error) {
        console.error('Error deleting geographical unit:', error);
        toast.error('Failed to delete geographical unit');
      }
    }
  };

  const handleSaveGeographicalUnit = async (
    formData: Partial<GeographicalUnit>
  ) => {
    try {
      if (selectedGeographicalUnit) {
        await orgChartApi.updateGeographicalUnit(
          selectedGeographicalUnit.id,
          formData
        );
        toast.success('Geographical unit updated successfully');
      } else {
        await orgChartApi.createGeographicalUnit(formData);
        toast.success('Geographical unit created successfully');
      }
      setGeographicalUnitModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving geographical unit:', error);
      toast.error('Failed to save geographical unit');
    }
  };

  const handleAddSubBusiness = () => {
    setSubBusinessModalOpen(true);
  };

  const handleSaveSubBusiness = async (formData: Partial<SubBusiness>) => {
    try {
      await orgChartApi.createSubBusiness(formData);
      setSubBusinessModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Sub-business created successfully');
    } catch (error) {
      console.error('Error saving sub-business:', error);
      toast.error('Failed to save sub-business');
    }
  };

  // Node action handlers for the action bar
  const handleNodeSelect = (node: OrgChartNode) => {
    setSelectedNode(node);
  };

  const handleAssignEmployee = () => {
    if (selectedNode) {
      setUserAssignmentModalOpen(true);
    }
  };

  const handleEditDepartmentFromNode = () => {
    if (selectedNode && selectedNode.type === 'structure') {
      setSelectedDepartment(
        selectedNode.data.entity as OrganizationalStructure
      );
      setDepartmentModalOpen(true);
    }
  };

  const handleDeleteDepartmentFromNode = () => {
    if (selectedNode && selectedNode.type === 'structure') {
      const structure = selectedNode.data.entity as OrganizationalStructure;
      handleDeleteDepartment(structure.id);
    }
  };

  const handleAddSubDepartment = () => {
    if (selectedNode && selectedNode.type === 'structure') {
      setParentStructure(selectedNode.data.entity as OrganizationalStructure);
      setDepartmentModalOpen(true);
    }
  };

  const handleViewDetails = () => {
    if (selectedNode) {
      // Show detailed information in a toast for now
      const entity = selectedNode.data.entity;
      if (entity) {
        const details = Object.entries(entity)
          .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        toast.success(`Details for ${selectedNode.data.label}:\n${details}`, {
          duration: 5000,
        });
      }
    }
  };

  const handleImportData = async () => {
    try {
      toast.success('Import functionality coming soon!');
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        structures,
        locations,
        subBusinesses,
        geoUnits,
        assignments,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

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
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organigram</h1>
            <p className="text-sm text-gray-600">
              Professional organizational structure management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Total: {structures.length} departments, {assignments.length}{' '}
              employees
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <OrgChartControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
      </div>

      {/* Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <OrgChartActions
          onAddDepartment={handleAddDepartment}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onAddLocation={handleAddLocation}
          onAddGeographicalUnit={handleAddGeographicalUnit}
          onAddSubBusiness={handleAddSubBusiness}
          onAddUserAssignment={handleAddUserAssignment}
          onImportData={handleImportData}
          onExportData={handleExportData}
          onRefreshData={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Help tooltip */}
        <div className="absolute top-4 right-4 z-10 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 text-lg">💡</div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Quick Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Double-click departments to view employees</li>
                <li>• Use the view modes to see different perspectives</li>
                <li>• Search and filter to find specific items</li>
              </ul>
            </div>
          </div>
        </div>

        <OrgChartFlowComponent
          viewMode={viewMode}
          searchTerm={searchTerm}
          filters={selectedFilters}
          refreshTrigger={refreshTrigger}
          onNodeSelect={handleNodeSelect}
          onViewModeChange={setViewMode}
          onAction={(action, nodeId, entity) => {
            switch (action) {
              case 'edit':
                if (entity?.department_name) {
                  setSelectedDepartment(entity);
                  setDepartmentModalOpen(true);
                }
                break;
              case 'delete':
                if (entity?.id) {
                  handleDeleteDepartment(entity.id);
                }
                break;
              case 'add_sub_department':
                if (entity?.department_name) {
                  setParentStructure(entity);
                  setDepartmentModalOpen(true);
                }
                break;
              case 'assign':
                setUserAssignmentModalOpen(true);
                break;
              case 'view_team':
                // This will be handled by the double-click functionality
                break;
            }
          }}
          onViewEmployees={(filters) => {
            setSelectedFilters(filters);
            setViewMode('employees');
          }}
        />
      </div>

      {/* Modals - Only necessary ones */}
      <DepartmentModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        onSave={handleSaveDepartment}
        department={selectedDepartment}
        parentStructure={parentStructure}
      />

      <UserAssignmentModal
        isOpen={userAssignmentModalOpen}
        onClose={() => setUserAssignmentModalOpen(false)}
        onSave={handleSaveUserAssignment}
        assignment={selectedAssignment}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSave={handleSaveLocation}
      />

      <GeographicalUnitModal
        isOpen={geographicalUnitModalOpen}
        onClose={() => setGeographicalUnitModalOpen(false)}
        onSave={handleSaveGeographicalUnit}
        geographicalUnit={selectedGeographicalUnit}
      />

      <SubBusinessModal
        isOpen={subBusinessModalOpen}
        onClose={() => setSubBusinessModalOpen(false)}
        onSave={handleSaveSubBusiness}
      />
    </div>
  );
}
