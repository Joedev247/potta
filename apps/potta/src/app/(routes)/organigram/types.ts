export interface OrganizationalStructure {
  id: string;
  department_name: string;
  description?: string;
  structure_type?: string;
  path: string;
  level: number;
  parent_structure_id?: string;
  location_id?: string;
  sub_business_unit_id?: string; // Updated field name
  current_employees: number;
  max_employees: number;
  budget: number;
  is_active: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
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
  geo_unit_id?: string; // Updated field name
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
  | 'copy_info';
