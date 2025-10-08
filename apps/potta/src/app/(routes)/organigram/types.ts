export interface OrganizationalStructure {
  id: string;
  department_name: string;
  description?: string;
  structure_type?: 'STANDARD_OFFICE' | 'TECH_STARTUP' | 'REGIONAL_OFFICE';
  path: string;
  level: number;
  parent_structure_id?: string;
  locationId?: string;
  sub_business_unit_id?: string; // Updated field name
  current_employees: number;
  max_employees: number;
  budget: number;
  is_active: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Invitation {
  id: string;
  email: string;
  recipientName: string;
  inviterId: string;
  organizationId: string;
  organizationName: string;
  roleId: string;
  roleName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface InvitationListResponse {
  invitations: Invitation[];
  total: number;
  pending: number;
  accepted: number;
}

export interface BulkInviteResponse {
  results: Invitation[];
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface Session {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}

export interface UserSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  username: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  bio: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorBackupCodes: string | null;
}

export interface OrganizationSession {
  id: string;
  name: string;
  slug: string;
}

export interface RoleSession {
  id: string;
  name: string;
  permissions: Record<string, any>;
}

export interface SessionResponse {
  session: Session;
  user: UserSession;
  organization: OrganizationSession;
  roles: RoleSession[];
  hierarchy: any;
}

export interface UserAssignment {
  id: string;
  user_id: string;
  organization_id: string;
  organizational_structure_id: string;
  location_id?: string;
  geographical_unit_id?: string;
  sub_business_id?: string;
  job_title?: string;
  assignment_type: 'PRIMARY' | 'SECONDARY' | 'TEMPORARY' | 'CONSULTANT';
  start_date?: string;
  end_date?: string;
  responsibilities?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  location_name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  capacity?: number;
  geographical_unit_id?: string; // Updated field name
  organization_id: string;
  organ_structure_template_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GeographicalUnit {
  id: string;
  geo_unit_name: string;
  description?: string;
  parent_geo_unit_id?: string;
  level?: number;
  path?: string;
  organization_id: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubBusiness {
  id: string;
  sub_business_name: string;
  description?: string;
  industry?: string;
  parent_sub_business_id?: string;
  organization_id: string;
  location_id?: string; // Added location_id field
  max_employees?: number;
  current_employees?: number;
  annual_revenue?: number;
  established_year?: number;
  is_active?: boolean;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessGeoAssignment {
  id: string;
  sub_business_id: string;
  geographical_unit_id: string;
  organization_id: string;
  operation_type: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  employee_count: number;
  annual_revenue: number;
  market_share_percentage: number;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: {
    users?: string[];
    invoices?: string[];
    reports?: string[];
  };
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id: string;
  template_name: string;
  template_type: 'STANDARD_OFFICE' | 'CUSTOM';
  structure_data: any;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

// New interface for the main organization
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  headquarters_location?: string;
  total_employees?: number;
  annual_revenue?: number;
  established_year?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Updated OrgChartNode to support different node types
export interface OrgChartNode {
  id: string;
  type:
    | 'organization'
    | 'geographical'
    | 'location'
    | 'business'
    | 'structure'
    | 'employee';
  data: {
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    entity?:
      | Organization
      | GeographicalUnit
      | Location
      | SubBusiness
      | OrganizationalStructure
      | UserAssignment;
  };
  position: { x: number; y: number };
  children?: OrgChartNode[];
  employees?: UserAssignment[];
  expanded?: boolean;
}

export interface OrgChartFilters {
  location: string;
  businessUnit: string;
  geographicalUnit: string;
  // New enhanced filters
  department?: string;
  employeeStatus?: 'active' | 'inactive' | 'all';
  structureType?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  maxEmployees?: number;
  budgetRange?: {
    min: number | null;
    max: number | null;
  };
  // Hierarchical filters
  showOnlyActive?: boolean;
  showOnlyWithEmployees?: boolean;
  showOnlyWithBudget?: boolean;
  // View-specific filters
  viewDepth?: number; // How many levels deep to show
  groupBy?: 'location' | 'business' | 'geography' | 'department' | 'none';
}

// New filter state management
export interface FilterState {
  filters: OrgChartFilters;
  isActive: boolean;
  appliedCount: number;
  lastApplied: Date | null;
}

// Filter preset for quick access
export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: OrgChartFilters;
  isDefault?: boolean;
}

// Updated ViewMode to match our new structure
export type ViewMode =
  | 'general'
  | 'geographical'
  | 'business'
  | 'organizational'
  | 'employees';

export interface OrgChartApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Node action types
export type NodeAction =
  | 'assign_employee'
  | 'edit'
  | 'delete'
  | 'view_details'
  | 'add_child'
  | 'copy_info'
  | 'view_employees'
  | 'view_departments'
  | 'view_locations'
  | 'view_geo_assignments'
  | 'view_business_assignments'
  | 'get_coordinates'
  | 'deactivate'
  | 'view_user_details'
  | 'view_department'
  | 'view_location'
  // Specific entity actions
  | 'edit_department'
  | 'edit_location'
  | 'edit_business'
  | 'edit_geo_unit'
  | 'edit_employee'
  | 'delete_department'
  | 'delete_location'
  | 'delete_business'
  | 'delete_geo_unit'
  | 'delete_employee'
  | 'add_child_department'
  | 'add_child_location'
  | 'add_child_business'
  | 'add_child_geo_unit';
