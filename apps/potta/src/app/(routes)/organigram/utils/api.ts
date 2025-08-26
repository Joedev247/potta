import axios from 'config/axios.config';
import {
  OrganizationalStructure,
  UserAssignment,
  Location,
  GeographicalUnit,
  SubBusiness,
  BusinessGeoAssignment,
  Template,
  OrgChartApiResponse,
  PaginatedResponse,
  Organization,
} from '../types';

const organizationId = '4c926765-d683-4e66-a62f-382d5b54c47a';

export const orgChartApi = {
  // Organization
  getOrganization: async (orgId: string = organizationId) => {
    const result = await axios.get<Organization>(`/organizations/${orgId}`);
    return {
      data: result.data,
      success: true,
      message: 'Organization loaded successfully',
    };
  },

  // Organizational Structures
  getStructures: async (orgId: string = organizationId) => {
    const result = await axios.get<OrganizationalStructure[]>(
      `/organizations/${orgId}/organizational-structures`
    );
    return {
      data: result.data,
      success: true,
      message: 'Organizational structures loaded successfully',
    };
  },

  getStructure: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get<OrganizationalStructure>(
      `/organizations/${orgId}/organizational-structures/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Organizational structure loaded successfully',
    };
  },

  createStructure: async (
    data: Partial<OrganizationalStructure>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post<OrganizationalStructure>(
      `/organizations/${orgId}/organizational-structures`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Organizational structure created successfully',
    };
  },

  updateStructure: async (
    id: string,
    data: Partial<OrganizationalStructure>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.patch<OrganizationalStructure>(
      `/organizations/${orgId}/organizational-structures/${id}`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Organizational structure updated successfully',
    };
  },

  deleteStructure: async (id: string, orgId: string = organizationId) => {
    await axios.delete(
      `/organizations/${orgId}/organizational-structures/${id}`
    );
    return {
      success: true,
      message: 'Organizational structure deleted successfully',
    };
  },

  // User Assignments
  getAssignments: async (orgId: string = organizationId) => {
    const result = await axios.get<UserAssignment[]>(
      `/organizations/${orgId}/user-assignments`
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignments loaded successfully',
    };
  },

  getAssignment: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get<UserAssignment>(
      `/organizations/${orgId}/user-assignments/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignment loaded successfully',
    };
  },

  getAssignmentsByUser: async (
    userId: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<UserAssignment[]>(
      `/organizations/${orgId}/user-assignments/user/${userId}`
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignments loaded successfully',
    };
  },

  getAssignmentsByDepartment: async (
    structureId: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<UserAssignment[]>(
      `/organizations/${orgId}/user-assignments/department/${structureId}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Department assignments loaded successfully',
    };
  },

  getAssignmentsByLocation: async (
    locationId: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<UserAssignment[]>(
      `/organizations/${orgId}/user-assignments/location/${locationId}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Location assignments loaded successfully',
    };
  },

  getAssignmentsBySubBusiness: async (
    subBusinessId: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<UserAssignment[]>(
      `/organizations/${orgId}/user-assignments/sub-business/${subBusinessId}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Business unit assignments loaded successfully',
    };
  },

  getFullUserContext: async (
    userId: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<any>(
      `/organizations/${orgId}/user-assignments/user/${userId}/context`
    );
    return {
      data: result.data,
      success: true,
      message: 'User context loaded successfully',
    };
  },

  getUserLocation: async (userId: string, orgId: string = organizationId) => {
    const result = await axios.get<any>(
      `/organizations/${orgId}/user-assignments/user/${userId}/location`
    );
    return {
      data: result.data,
      success: true,
      message: 'User location loaded successfully',
    };
  },

  getUserDepartment: async (userId: string, orgId: string = organizationId) => {
    const result = await axios.get<any>(
      `/organizations/${orgId}/user-assignments/user/${userId}/department`
    );
    return {
      data: result.data,
      success: true,
      message: 'User department loaded successfully',
    };
  },

  deactivateUserAssignment: async (
    id: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.put<UserAssignment>(
      `/organizations/${orgId}/user-assignments/${id}/deactivate`
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignment deactivated successfully',
    };
  },

  createAssignment: async (
    data: Partial<UserAssignment>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post<UserAssignment>(
      `/organizations/${orgId}/user-assignments`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignment created successfully',
    };
  },

  updateAssignment: async (
    id: string,
    data: Partial<UserAssignment>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.put<UserAssignment>(
      `/organizations/${orgId}/user-assignments/${id}`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'User assignment updated successfully',
    };
  },

  deleteAssignment: async (id: string, orgId: string = organizationId) => {
    await axios.delete(`/organizations/${orgId}/user-assignments/${id}`);
    return {
      success: true,
      message: 'User assignment deleted successfully',
    };
  },

  // Locations
  getLocations: async (orgId: string = organizationId) => {
    const result = await axios.get<Location[]>(
      `/organizations/${orgId}/locations`
    );
    return {
      data: result.data,
      success: true,
      message: 'Locations loaded successfully',
    };
  },

  getLocation: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get<Location>(
      `/organizations/${orgId}/locations/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Location loaded successfully',
    };
  },

  createLocation: async (
    data: Partial<Location>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post<Location>(
      `/organizations/${orgId}/locations`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Location created successfully',
    };
  },

  updateLocation: async (
    id: string,
    data: Partial<Location>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.put<Location>(
      `/organizations/${orgId}/locations/${id}`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Location updated successfully',
    };
  },

  deleteLocation: async (id: string, orgId: string = organizationId) => {
    await axios.delete(`/organizations/${orgId}/locations/${id}`);
    return {
      success: true,
      message: 'Location deleted successfully',
    };
  },

  // Geographical Units
  getGeographicalUnits: async (orgId: string = organizationId) => {
    const result = await axios.get<GeographicalUnit[]>(
      `/organizations/${orgId}/geographical-units`
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical units loaded successfully',
    };
  },

  getGeographicalUnit: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get<GeographicalUnit>(
      `/organizations/${orgId}/geographical-units/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical unit loaded successfully',
    };
  },

  getGeographicalUnitWithAssignments: async (
    id: string,
    orgId: string = organizationId
  ) => {
    const result = await axios.get<any>(
      `/organizations/${orgId}/geographical-units/${id}/with-assignments`
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical unit with assignments loaded successfully',
    };
  },

  getGeographicalUnitsHierarchy: async (orgId: string = organizationId) => {
    const result = await axios.get<GeographicalUnit[]>(
      `/organizations/${orgId}/geographical-units/hierarchy`
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical units hierarchy loaded successfully',
    };
  },

  createGeographicalUnit: async (
    data: Partial<GeographicalUnit>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post<GeographicalUnit>(
      `/organizations/${orgId}/geographical-units`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical unit created successfully',
    };
  },

  updateGeographicalUnit: async (
    id: string,
    data: Partial<GeographicalUnit>,
    orgId: string = organizationId
  ) => {
    const result = await axios.put<GeographicalUnit>(
      `/organizations/${orgId}/geographical-units/${id}`,
      data
    );
    return {
      data: result.data,
      success: true,
      message: 'Geographical unit updated successfully',
    };
  },

  deleteGeographicalUnit: async (
    id: string,
    orgId: string = organizationId
  ) => {
    await axios.delete(`/organizations/${orgId}/geographical-units/${id}`);
    return {
      success: true,
      message: 'Geographical unit deleted successfully',
    };
  },

  // Sub-Businesses
  getSubBusinesses: async (orgId: string = organizationId) => {
    const result = await axios.get<SubBusiness[]>(
      `/organizations/${orgId}/sub-businesses`
    );
    return {
      data: result.data,
      success: true,
      message: 'Sub-businesses loaded successfully',
    };
  },

  getSubBusiness: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get<SubBusiness>(
      `/organizations/${orgId}/sub-businesses/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Sub-business loaded successfully',
    };
  },

  createSubBusiness: async (
    data: Partial<SubBusiness>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post<SubBusiness>(
      `/organizations/${orgId}/sub-businesses`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Sub-business created successfully',
    };
  },

  updateSubBusiness: async (
    id: string,
    data: Partial<SubBusiness>,
    orgId: string = organizationId
  ) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.put<SubBusiness>(
      `/organizations/${orgId}/sub-businesses/${id}`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Sub-business updated successfully',
    };
  },

  deleteSubBusiness: async (id: string, orgId: string = organizationId) => {
    await axios.delete(`/organizations/${orgId}/sub-businesses/${id}`);
    return {
      success: true,
      message: 'Sub-business deleted successfully',
    };
  },

  // Business-Geographical Assignments
  getBusinessGeoAssignments: async () => {
    const result = await axios.get<BusinessGeoAssignment[]>(
      `/business-geo-assignments`
    );
    return {
      data: result.data,
      success: true,
      message: 'Business-geographical assignments loaded successfully',
    };
  },

  getBusinessGeoAssignment: async (id: string) => {
    const result = await axios.get<BusinessGeoAssignment>(
      `/business-geo-assignments/${id}`
    );
    return {
      data: result.data,
      success: true,
      message: 'Business-geographical assignment loaded successfully',
    };
  },

  createBusinessGeoAssignment: async (data: Partial<BusinessGeoAssignment>) => {
    const result = await axios.post<BusinessGeoAssignment>(
      `/business-geo-assignments`,
      data
    );
    return {
      data: result.data,
      success: true,
      message: 'Business-geographical assignment created successfully',
    };
  },

  updateBusinessGeoAssignment: async (
    id: string,
    data: Partial<BusinessGeoAssignment>
  ) => {
    const result = await axios.put<BusinessGeoAssignment>(
      `/business-geo-assignments/${id}`,
      data
    );
    return {
      data: result.data,
      success: true,
      message: 'Business-geographical assignment updated successfully',
    };
  },

  deleteBusinessGeoAssignment: async (id: string) => {
    await axios.delete(`/business-geo-assignments/${id}`);
    return {
      success: true,
      message: 'Business-geographical assignment deleted successfully',
    };
  },

  // Templates
  getTemplates: async () => {
    const result = await axios.get<Template[]>(`/templates`);
    return {
      data: result.data,
      success: true,
      message: 'Templates loaded successfully',
    };
  },

  getTemplate: async (id: string) => {
    const result = await axios.get<Template>(`/templates/${id}`);
    return {
      data: result.data,
      success: true,
      message: 'Template loaded successfully',
    };
  },

  createTemplate: async (data: Partial<Template>) => {
    const result = await axios.post<Template>(`/templates`, data);
    return {
      data: result.data,
      success: true,
      message: 'Template created successfully',
    };
  },

  updateTemplate: async (id: string, data: Partial<Template>) => {
    const result = await axios.put<Template>(`/templates/${id}`, data);
    return {
      data: result.data,
      success: true,
      message: 'Template updated successfully',
    };
  },

  deleteTemplate: async (id: string) => {
    await axios.delete(`/templates/${id}`);
    return {
      success: true,
      message: 'Template deleted successfully',
    };
  },

  generateStructuresFromTemplate: async (id: string, data: any) => {
    const result = await axios.post(
      `/templates/${id}/generate-structures`,
      data
    );
    return {
      data: result.data,
      success: true,
      message: 'Structures generated from template successfully',
    };
  },

  // Roles
  getRoles: async (orgId: string = organizationId) => {
    const result = await axios.get(`/organizations/${orgId}/roles`);
    return {
      data: result.data,
      success: true,
      message: 'Roles loaded successfully',
    };
  },

  getRole: async (id: string, orgId: string = organizationId) => {
    const result = await axios.get(`/organizations/${orgId}/roles/${id}`);
    return {
      data: result.data,
      success: true,
      message: 'Role loaded successfully',
    };
  },

  createRole: async (data: any, orgId: string = organizationId) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.post(`/organizations/${orgId}/roles`, payload);
    return {
      data: result.data,
      success: true,
      message: 'Role created successfully',
    };
  },

  updateRole: async (id: string, data: any, orgId: string = organizationId) => {
    const payload = {
      ...data,
      organization_id: orgId,
    };
    const result = await axios.put(
      `/organizations/${orgId}/roles/${id}`,
      payload
    );
    return {
      data: result.data,
      success: true,
      message: 'Role updated successfully',
    };
  },

  deleteRole: async (id: string, orgId: string = organizationId) => {
    await axios.delete(`/organizations/${orgId}/roles/${id}`);
    return {
      success: true,
      message: 'Role deleted successfully',
    };
  },
};
