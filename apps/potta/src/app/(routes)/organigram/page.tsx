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
import NodeActionPanel from './components/NodeActionPanel';
import DeleteModal from './components/DeleteModal';
import DetailsModal from './components/DetailsModal';
import {
  OrganizationalStructure,
  UserAssignment,
  Location,
  GeographicalUnit,
  SubBusiness,
  ViewMode,
  OrgChartNode,
  Organization,
  OrgChartFilters,
} from './types';
import { orgChartApi } from './utils/api';
import OrgChartFlowComponent from './components/OrgChartFlowComponent';
import NodeActionBar from './components/NodeActionBar';

export default function OrganigramPage() {
  // Updated view mode to start with general
  const [viewMode, setViewMode] = useState<ViewMode>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<OrgChartFilters>({
    location: '',
    businessUnit: '',
    geographicalUnit: '',
    employeeStatus: 'all',
    showOnlyActive: false,
    showOnlyWithEmployees: false,
    showOnlyWithBudget: false,
    viewDepth: 3,
    groupBy: 'none',
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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedSubBusiness, setSelectedSubBusiness] =
    useState<SubBusiness | null>(null);
  const [parentStructure, setParentStructure] =
    useState<OrganizationalStructure | null>(null);
  const [parentSubBusiness, setParentSubBusiness] =
    useState<SubBusiness | null>(null);
  const [parentGeographicalUnit, setParentGeographicalUnit] =
    useState<GeographicalUnit | null>(null);

  // Add selected node state for action bar
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);

  // Node action panel state
  const [actionPanelOpen, setActionPanelOpen] = useState(false);
  const [actionPanelPosition, setActionPanelPosition] = useState({
    x: 0,
    y: 0,
  });

  // New modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<any>(null);
  const [entityToView, setEntityToView] = useState<any>(null);
  const [entityTypeToView, setEntityTypeToView] = useState<string>('');

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
    try {
      await orgChartApi.deleteStructure(id);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
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
    try {
      await orgChartApi.deleteGeographicalUnit(id);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Geographical unit deleted successfully');
    } catch (error) {
      console.error('Error deleting geographical unit:', error);
      toast.error('Failed to delete geographical unit');
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
  const handleNodeSelect = (node: OrgChartNode, event?: React.MouseEvent) => {
    setSelectedNode(node);

    // Open action panel if it's a click event
    if (event) {
      setActionPanelPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setActionPanelOpen(true);
    }
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

  // Additional handlers for other entity types
  const handleDeleteSubBusiness = async (id: string) => {
    try {
      await orgChartApi.deleteSubBusiness(id);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Business unit deleted successfully');
    } catch (error) {
      console.error('Error deleting business unit:', error);
      toast.error('Failed to delete business unit');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await orgChartApi.deleteLocation(id);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleDeactivateAssignment = async (id: string) => {
    try {
      await orgChartApi.deactivateUserAssignment(id);
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Assignment deactivated successfully');
    } catch (error) {
      console.error('Error deactivating assignment:', error);
      toast.error('Failed to deactivate assignment');
    }
  };

  const handleViewEmployees = (entity: any) => {
    // Switch to employees view and set appropriate filters
    setViewMode('employees');

    // Reset filters first
    const baseFilters: OrgChartFilters = {
      location: '',
      businessUnit: '',
      geographicalUnit: '',
      employeeStatus: 'all',
      showOnlyActive: false,
      showOnlyWithEmployees: false,
      showOnlyWithBudget: false,
      viewDepth: 3,
      groupBy: 'none',
    };

    // Set filters based on entity type
    if (entity?.location_id) {
      baseFilters.location = entity.location_id;
    }
    if (entity?.sub_business_unit_id) {
      baseFilters.businessUnit = entity.sub_business_unit_id;
    } else if (entity?.id && entity?.sub_business_name) {
      // If it's a business unit entity itself
      baseFilters.businessUnit = entity.id;
    }
    if (entity?.geo_unit_id) {
      baseFilters.geographicalUnit = entity.geo_unit_id;
    }

    // Update filters
    setSelectedFilters(baseFilters);

    // Debug log to verify filters
    console.log('View Employees - Applied filters:', baseFilters);
    console.log('View Employees - Entity:', entity);

    toast.success(
      `Switched to Employees view for ${
        entity?.department_name ||
        entity?.sub_business_name ||
        entity?.geo_unit_name ||
        entity?.location_name ||
        'selected entity'
      }`
    );
  };

  const handleViewDetails = (entity: any) => {
    // Open details modal
    setEntityToView(entity);
    setEntityTypeToView(
      entity?.department_name
        ? 'structure'
        : entity?.geo_unit_name
        ? 'geographical'
        : entity?.location_name
        ? 'location'
        : entity?.sub_business_name
        ? 'business'
        : entity?.job_title
        ? 'employee'
        : 'unknown'
    );
    setDetailsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entityToDelete) return;

    try {
      switch (entityToDelete.type) {
        case 'department':
          await handleDeleteDepartment(entityToDelete.id);
          break;
        case 'location':
          await handleDeleteLocation(entityToDelete.id);
          break;
        case 'business':
          await handleDeleteSubBusiness(entityToDelete.id);
          break;
        case 'geographical':
          await handleDeleteGeographicalUnit(entityToDelete.id);
          break;
        case 'employee':
          await handleDeactivateAssignment(entityToDelete.id);
          break;
        default:
          toast.error('Unknown entity type for deletion');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete entity');
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
        <div className="absolute top-4 right-4 z-10 bg-green-50 border border-green-200 p-3 max-w-xs">
          <div className="flex items-start space-x-2">
            <div className="text-green-500 text-lg">💡</div>
            <div className="text-sm text-green-800">
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
            console.log('Action triggered:', action, nodeId, entity);

            switch (action) {
              case 'edit_department':
                setSelectedDepartment(entity);
                setDepartmentModalOpen(true);
                break;
              case 'edit_location':
                setSelectedLocation(entity);
                setLocationModalOpen(true);
                break;
              case 'edit_business':
                setSelectedSubBusiness(entity);
                setSubBusinessModalOpen(true);
                break;
              case 'edit_geo_unit':
                setSelectedGeographicalUnit(entity);
                setGeographicalUnitModalOpen(true);
                break;
              case 'edit_employee':
                setSelectedAssignment(entity);
                setUserAssignmentModalOpen(true);
                break;
              case 'delete_department':
                setEntityToDelete({
                  ...entity,
                  type: 'department',
                  name: entity.department_name,
                });
                setDeleteModalOpen(true);
                break;
              case 'delete_location':
                setEntityToDelete({
                  ...entity,
                  type: 'location',
                  name: entity.location_name,
                });
                setDeleteModalOpen(true);
                break;
              case 'delete_business':
                setEntityToDelete({
                  ...entity,
                  type: 'business',
                  name: entity.sub_business_name,
                });
                setDeleteModalOpen(true);
                break;
              case 'delete_geo_unit':
                setEntityToDelete({
                  ...entity,
                  type: 'geographical',
                  name: entity.geo_unit_name,
                });
                setDeleteModalOpen(true);
                break;
              case 'delete_employee':
                setEntityToDelete({
                  ...entity,
                  type: 'employee',
                  name: entity.job_title || 'Employee',
                });
                setDeleteModalOpen(true);
                break;
              case 'add_child_department':
                setParentStructure(entity);
                setDepartmentModalOpen(true);
                break;
              case 'add_child_location':
                setParentGeographicalUnit(entity);
                setLocationModalOpen(true);
                break;
              case 'add_child_business':
                setParentSubBusiness(entity);
                setSubBusinessModalOpen(true);
                break;
              case 'add_child_geo_unit':
                setParentGeographicalUnit(entity);
                setGeographicalUnitModalOpen(true);
                break;
              case 'view_employees':
                handleViewEmployees(entity);
                break;
              case 'view_details':
                handleViewDetails(entity);
                break;
              case 'edit':
                if (entity?.department_name) {
                  setSelectedDepartment(entity);
                  setDepartmentModalOpen(true);
                } else if (entity?.sub_business_name) {
                  setSelectedSubBusiness(entity);
                  setSubBusinessModalOpen(true);
                } else if (entity?.geo_unit_name) {
                  setSelectedGeographicalUnit(entity);
                  setGeographicalUnitModalOpen(true);
                } else if (entity?.location_name) {
                  setSelectedLocation(entity);
                  setLocationModalOpen(true);
                } else if (entity?.job_title || entity?.user_id) {
                  setSelectedAssignment(entity);
                  setUserAssignmentModalOpen(true);
                }
                break;

              case 'delete':
                if (entity?.id) {
                  if (entity?.department_name) {
                    handleDeleteDepartment(entity.id);
                  } else if (entity?.sub_business_name) {
                    handleDeleteSubBusiness(entity.id);
                  } else if (entity?.geo_unit_name) {
                    handleDeleteGeographicalUnit(entity.id);
                  } else if (entity?.location_name) {
                    handleDeleteLocation(entity.id);
                  }
                }
                break;

              case 'add_child':
                if (entity?.department_name) {
                  setParentStructure(entity);
                  setDepartmentModalOpen(true);
                } else if (entity?.sub_business_name) {
                  setParentSubBusiness(entity);
                  setSubBusinessModalOpen(true);
                } else if (entity?.geo_unit_name) {
                  setParentGeographicalUnit(entity);
                  setGeographicalUnitModalOpen(true);
                }
                break;

              case 'assign_employee':
                setUserAssignmentModalOpen(true);
                break;

              // Remove duplicate view_employees case - already handled above

              case 'view_details':
                // Show detailed information modal
                toast.success('View details functionality coming soon');
                break;

              case 'deactivate':
                if (entity?.id) {
                  handleDeactivateAssignment(entity.id);
                }
                break;

              case 'get_coordinates':
                if (entity?.location_name) {
                  setSelectedLocation(entity);
                  setLocationModalOpen(true);
                }
                break;

              default:
                console.log('Action not implemented:', action);
                toast.success(`${action} functionality coming soon`);
            }
          }}
          onViewEmployees={(filters) => {
            // Update filters and switch to employees view
            setSelectedFilters((prev) => ({
              ...prev,
              ...filters,
            }));
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
        mode={selectedDepartment ? 'edit' : 'create'}
      />

      <UserAssignmentModal
        isOpen={userAssignmentModalOpen}
        onClose={() => setUserAssignmentModalOpen(false)}
        onSave={handleSaveUserAssignment}
        assignment={selectedAssignment}
        preselectedDepartment={
          selectedNode?.type === 'structure'
            ? (selectedNode.data.entity as OrganizationalStructure)
            : null
        }
        preselectedLocation={
          selectedNode?.type === 'location'
            ? (selectedNode.data.entity as Location)
            : null
        }
        preselectedBusinessUnit={
          selectedNode?.type === 'business'
            ? (selectedNode.data.entity as SubBusiness)
            : null
        }
        preselectedGeographicalUnit={
          selectedNode?.type === 'geographical'
            ? (selectedNode.data.entity as GeographicalUnit)
            : null
        }
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSave={handleSaveLocation}
        mode="create"
        parentGeographicalUnit={parentGeographicalUnit}
      />

      <GeographicalUnitModal
        isOpen={geographicalUnitModalOpen}
        onClose={() => setGeographicalUnitModalOpen(false)}
        onSave={handleSaveGeographicalUnit}
        geographicalUnit={selectedGeographicalUnit}
        mode={selectedGeographicalUnit ? 'edit' : 'create'}
        parentGeographicalUnit={parentGeographicalUnit}
      />

      <SubBusinessModal
        isOpen={subBusinessModalOpen}
        onClose={() => setSubBusinessModalOpen(false)}
        onSave={handleSaveSubBusiness}
        subBusiness={selectedSubBusiness}
        mode={selectedSubBusiness ? 'edit' : 'create'}
        parentSubBusiness={parentSubBusiness}
      />

      {/* Node Action Panel */}
      <NodeActionPanel
        isOpen={actionPanelOpen}
        onClose={() => setActionPanelOpen(false)}
        node={selectedNode as any}
        onAction={(action, nodeId, entity) => {
          // Close the panel first
          setActionPanelOpen(false);

          // Handle the action
          switch (action) {
            case 'edit_department':
              setSelectedDepartment(entity);
              setDepartmentModalOpen(true);
              break;
            case 'edit_location':
              setSelectedLocation(entity);
              setLocationModalOpen(true);
              break;
            case 'edit_business':
              setSelectedSubBusiness(entity);
              setSubBusinessModalOpen(true);
              break;
            case 'edit_geo_unit':
              setSelectedGeographicalUnit(entity);
              setGeographicalUnitModalOpen(true);
              break;
            case 'edit_employee':
              setSelectedAssignment(entity);
              setUserAssignmentModalOpen(true);
              break;

            case 'delete_department':
              setEntityToDelete({
                ...entity,
                type: 'department',
                name: entity.department_name,
              });
              setDeleteModalOpen(true);
              break;
            case 'delete_location':
              setEntityToDelete({
                ...entity,
                type: 'location',
                name: entity.location_name,
              });
              setDeleteModalOpen(true);
              break;
            case 'delete_business':
              setEntityToDelete({
                ...entity,
                type: 'business',
                name: entity.sub_business_name,
              });
              setDeleteModalOpen(true);
              break;
            case 'delete_geo_unit':
              setEntityToDelete({
                ...entity,
                type: 'geographical',
                name: entity.geo_unit_name,
              });
              setDeleteModalOpen(true);
              break;
            case 'delete_employee':
              setEntityToDelete({
                ...entity,
                type: 'employee',
                name: entity.job_title || 'Employee',
              });
              setDeleteModalOpen(true);
              break;

            case 'add_child_department':
              setParentStructure(entity);
              setDepartmentModalOpen(true);
              break;
            case 'add_child_location':
              setParentGeographicalUnit(entity);
              setLocationModalOpen(true);
              break;
            case 'add_child_business':
              setParentSubBusiness(entity);
              setSubBusinessModalOpen(true);
              break;
            case 'add_child_geo_unit':
              setParentGeographicalUnit(entity);
              setGeographicalUnitModalOpen(true);
              break;

            case 'assign_employee':
              setUserAssignmentModalOpen(true);
              break;

            case 'view_employees':
              handleViewEmployees(entity);
              break;

            case 'view_details':
              handleViewDetails(entity);
              break;

            case 'deactivate':
              if (entity?.id) {
                handleDeactivateAssignment(entity.id);
              }
              break;

            case 'get_coordinates':
              if (entity?.location_name) {
                setSelectedLocation(entity);
                setLocationModalOpen(true);
              }
              break;

            default:
              console.log('Action not implemented:', action);
              toast.success(`${action} functionality coming soon`);
          }
        }}
        position={actionPanelPosition}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this item? This action cannot be undone."
        entityName={entityToDelete?.name || 'Unknown'}
        entityType={entityToDelete?.type || 'Unknown'}
      />

      {/* Details Modal */}
      <DetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        entity={entityToView}
        entityType={entityTypeToView}
      />
    </div>
  );
}
