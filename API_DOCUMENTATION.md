# Organigram API Documentation

## Base URL

`/api`

## Organizations

### Create Organization

```
POST /api/organizations
```

**Request Body:**

```json
{
  "name": "Acme Inc.",
  "logo": "https://example.com/logo.png",
  "location_name": "Acme Inc. Headquarters",
  "address": "123 Main Street, Downtown",
  "city": "New York",
  "state": "New York",
  "country": "United States",
  "postal_code": "10001",
  "latitude": 40.7128,
  "longitude": -74.006,
  "phone": "+1 555 123 4567",
  "email": "info@acme.com",
  "website": "https://acme.com",
  "description": "Main office for Acme Inc.",
  "capacity": 100,
  "create_geo_unit": false,
  "geo_unit": {
    "geo_unit_name": "Littoral Region",
    "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
    "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000"
  },
  "create_sub_business": false,
  "sub_business": {
    "sub_business_name": "Instanvi Tech Solutions",
    "description": "Technology solutions and software development division",
    "industry": "Technology",
    "parent_sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "max_employees": 50,
    "current_employees": 25,
    "annual_revenue": 5000000,
    "established_year": 2020,
    "is_active": true,
    "website": "https://tech.instanvi.com",
    "contact_email": "tech@instanvi.com",
    "contact_phone": "+237 123 456 789"
  },
  "create_user_assignment": false,
  "user_assignment": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "location_id": "123e4567-e89b-12d3-a456-426614174000",
    "organizational_structure_id": "123e4567-e89b-12d3-a456-426614174000",
    "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
    "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
    "assignment_type": "PRIMARY",
    "job_title": "Senior Software Engineer",
    "responsibilities": "Lead development of core features and mentor junior developers",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "is_active": true
  }
}
```

### Get All Organizations

```
GET /api/organizations
```

### Get Organization by ID

```
GET /api/organizations/{id}
```

### Update Organization

```
PUT /api/organizations/{id}
```

**Request Body:**

```json
{
  "name": "Acme Inc.",
  "slug": "acme",
  "logo": "https://example.com/logo.png",
  "metadata": {}
}
```

### Delete Organization

```
DELETE /api/organizations/{id}
```

### Check Slug Availability

```
GET /api/organizations/check-slug/{slug}
```

### Set Active Organization

```
POST /api/organizations/set-active
```

**Request Body:**

```json
{
  "organizationId": "org-uuid",
  "organizationSlug": "acme"
}
```

## Members

### Add Member

```
POST /api/members
```

**Request Body:**

```json
{
  "organizationId": "string",
  "email": "string",
  "role": "string"
}
```

### List Members

```
GET /api/members?organizationId={organizationId}
```

### Remove Member

```
DELETE /api/members/{organizationId}/{userId}
```

### Update Member Role

```
PUT /api/members/role
```

**Request Body:**

```json
{
  "organizationId": "string",
  "userId": "string",
  "role": "string"
}
```

### Get Active Member

```
GET /api/members/active
```

## Organizational Structures

### Create Organizational Structure

```
POST /api/organizations/{organizationId}/organizational-structures
```

**Request Body:**

```json
{
  "department_name": "Primary School",
  "description": "Primary education in Akwa",
  "structure_type": "DIVISION",
  "parent_structure_id": "123e4567-e89b-12d3-a456-426614174000",
  "location_id": "123e4567-e89b-12d3-a456-426614174000",
  "sub_business_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "max_employees": 50,
  "current_employees": 25,
  "budget": 1000000,
  "is_active": true
}
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "department_name": "Primary School",
  "description": "Primary education in Akwa",
  "structure_type": "DIVISION",
  "path": "root.primary-school",
  "level": 2,
  "parent_structure_id": "123e4567-e89b-12d3-a456-426614174000",
  "location_id": "123e4567-e89b-12d3-a456-426614174000",
  "sub_business_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "max_employees": 50,
  "current_employees": 25,
  "budget": 1000000,
  "is_active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Organizational Structures

```
GET /api/organizations/{organizationId}/organizational-structures
```

### Get Organizational Structure by ID

```
GET /api/organizations/{organizationId}/organizational-structures/{id}
```

### Update Organizational Structure (PATCH)

```
PATCH /api/organizations/{organizationId}/organizational-structures/{id}
```

**Request Body:**

```json
{
  "department_name": "Primary School",
  "description": "Primary education in Akwa",
  "structure_type": "DIVISION",
  "parent_structure_id": "123e4567-e89b-12d3-a456-426614174000",
  "location_id": "123e4567-e89b-12d3-a456-426614174000",
  "sub_business_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "max_employees": 50,
  "current_employees": 25,
  "budget": 1000000,
  "is_active": true
}
```

### Update Organizational Structure (PUT)

```
PUT /api/organizations/{organizationId}/organizational-structures/{id}
```

### Delete Organizational Structure

```
DELETE /api/organizations/{organizationId}/organizational-structures/{id}
```

**Response:** 204 No Content

## Roles

### Create Role

```
POST /api/organizations/{orgId}/roles
```

**Request Body:**

```json
{
  "name": "manager",
  "permissions": {
    "users": ["view", "create", "update"],
    "invoices": ["view", "create"],
    "reports": ["view"]
  }
}
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "manager",
  "organizationId": "123e4567-e89b-12d3-a456-426614174000",
  "permissions": {
    "users": ["view", "create", "update"],
    "invoices": ["view", "create"],
    "reports": ["view"]
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Roles

```
GET /api/organizations/{orgId}/roles
```

### Get Role by ID

```
GET /api/organizations/{orgId}/roles/{roleId}
```

### Update Role

```
PUT /api/organizations/{orgId}/roles/{roleId}
```

**Request Body:**

```json
{
  "name": "senior-manager",
  "permissions": {
    "users": ["view", "create", "update", "delete"],
    "invoices": ["view", "create", "update"],
    "reports": ["view", "export"]
  }
}
```

### Delete Role

```
DELETE /api/organizations/{orgId}/roles/{roleId}
```

**Response:**

```json
{
  "deleted": true
}
```

## Locations

### Get All Locations

```
GET /api/organizations/{organizationId}/locations
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "location_name": "Instanvi Douala Office",
    "address": "123 Rue de la Paix, Douala, Cameroon",
    "city": "Douala",
    "state": "Littoral",
    "country": "Cameroon",
    "postal_code": "237",
    "latitude": 4.0511,
    "longitude": 9.7679,
    "phone": "+237 123 456 789",
    "email": "douala@instanvi.com",
    "website": "https://instanvi.com/douala",
    "description": "Main office for Instanvi in Douala",
    "capacity": 50,
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Location

```
POST /api/organizations/{organizationId}/locations
```

**Request Body:**

```json
{
  "location_name": "Akwa",
  "address": "Akwa, Douala, Cameroon",
  "city": "Douala",
  "state": "Littoral",
  "country": "Cameroon",
  "postal_code": "237",
  "latitude": 4.0511,
  "longitude": 9.7679,
  "phone": "+237 123 456 789",
  "email": "akwa@instanvi.com",
  "website": "https://instanvi.com/akwa",
  "description": "Akwa neighborhood in Douala",
  "capacity": 100,
  "geo_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Get Location by ID

```
GET /api/organizations/{organizationId}/locations/{id}
```

### Update Location

```
PUT /api/organizations/{organizationId}/locations/{id}
```

**Request Body:**

```json
{
  "location_name": "Akwa",
  "address": "Akwa, Douala, Cameroon",
  "city": "Douala",
  "state": "Littoral",
  "country": "Cameroon",
  "postal_code": "237",
  "latitude": 4.0511,
  "longitude": 9.7679,
  "phone": "+237 123 456 789",
  "email": "akwa@instanvi.com",
  "website": "https://instanvi.com/akwa",
  "description": "Akwa neighborhood in Douala",
  "capacity": 100,
  "geo_unit_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Delete Location

```
DELETE /api/organizations/{organizationId}/locations/{id}
```

**Response:** 204 No Content

## Organizational Structure Templates

### Get All Templates

```
GET /api/templates
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "template_name": "Standard Office Template",
    "description": "Standard organizational structure for office environments",
    "template_type": "STANDARD_OFFICE",
    "structure_definition": {
      "departments": [
        {
          "name": "Engineering",
          "sub_departments": ["Frontend", "Backend", "DevOps"]
        },
        {
          "name": "Sales",
          "sub_departments": ["Inside Sales", "Outside Sales"]
        },
        {
          "name": "Marketing",
          "sub_departments": ["Digital Marketing", "Content"]
        }
      ]
    },
    "hierarchy_levels": 3,
    "max_employees": 100,
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "is_active": true,
    "version": "1.0.0",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Template

```
POST /api/templates
```

**Request Body:**

```json
{
  "template_name": "Standard Office Template",
  "description": "Standard organizational structure for office environments",
  "template_type": "STANDARD_OFFICE",
  "structure_definition": {
    "departments": [
      {
        "name": "Engineering",
        "sub_departments": ["Frontend", "Backend", "DevOps"]
      },
      {
        "name": "Sales",
        "sub_departments": ["Inside Sales", "Outside Sales"]
      },
      {
        "name": "Marketing",
        "sub_departments": ["Digital Marketing", "Content"]
      }
    ]
  },
  "hierarchy_levels": 3,
  "max_employees": 100,
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "is_active": true,
  "version": "1.0.0"
}
```

### Get Template by ID

```
GET /api/templates/{id}
```

### Update Template

```
PUT /api/templates/{id}
```

**Request Body:**

```json
{
  "template_name": "Standard Office Template",
  "description": "Standard organizational structure for office environments",
  "template_type": "STANDARD_OFFICE",
  "structure_definition": {
    "departments": [
      {
        "name": "Engineering",
        "sub_departments": ["Frontend", "Backend", "DevOps"]
      },
      {
        "name": "Sales",
        "sub_departments": ["Inside Sales", "Outside Sales"]
      },
      {
        "name": "Marketing",
        "sub_departments": ["Digital Marketing", "Content"]
      }
    ]
  },
  "hierarchy_levels": 3,
  "max_employees": 100,
  "is_active": true,
  "version": "1.0.0"
}
```

### Delete Template

```
DELETE /api/templates/{id}
```

**Response:** 204 No Content

### Generate Structures from Template

```
POST /api/templates/{id}/generate-structures
```

**Request Body:**

```json
{
  "locationId": "123e4567-e89b-12d3-a456-426614174000",
  "organizationId": "123e4567-e89b-12d3-a456-426614174000",
  "totalBudget": 10000000,
  "employeeAllocations": {
    "Engineering": 40,
    "Sales": 25,
    "Marketing": 15
  },
  "budgetAllocations": {
    "Engineering": 4500000,
    "Sales": 2000000,
    "Marketing": 2000000
  }
}
```

## Geographical Units

### Get All Geographical Units

```
GET /api/organizations/{organizationId}/geographical-units
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "geo_unit_name": "Littoral Region",
    "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
    "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "parent_geo_unit": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "geo_unit_name": "Cameroon",
      "description": "Country of Cameroon"
    },
    "children": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "geo_unit_name": "Douala City",
        "description": "City of Douala"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Geographical Unit

```
POST /api/organizations/{organizationId}/geographical-units
```

**Request Body:**

```json
{
  "geo_unit_name": "Littoral Region",
  "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
  "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Get Geographical Units Hierarchy

```
GET /api/organizations/{organizationId}/geographical-units/hierarchy
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "geo_unit_name": "Littoral Region",
    "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
    "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000",
    "children": ["string"],
    "children_count": 3,
    "total_descendants": 12
  }
]
```

### Get Geographical Unit by ID

```
GET /api/organizations/{organizationId}/geographical-units/{id}
```

### Update Geographical Unit

```
PUT /api/organizations/{organizationId}/geographical-units/{id}
```

**Request Body:**

```json
{
  "geo_unit_name": "Littoral Region",
  "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
  "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Delete Geographical Unit

```
DELETE /api/organizations/{organizationId}/geographical-units/{id}
```

**Response:** 204 No Content

### Get Geographical Unit with Assignments

```
GET /api/organizations/{organizationId}/geographical-units/{id}/with-assignments
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "geo_unit_name": "Littoral Region",
  "description": "Littoral Region of Cameroon, including Douala and surrounding areas",
  "parent_geo_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "parent_geo_unit": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "geo_unit_name": "Cameroon",
    "description": "Country of Cameroon"
  },
  "children": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "geo_unit_name": "Douala City",
      "description": "City of Douala"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "business_geo_assignments": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "sub_business_name": "Instanvi Tech",
      "operation_type": "Regional Office",
      "employee_count": 25,
      "annual_revenue": 2500000
    }
  ],
  "user_assignments": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_email": "john.doe@instanvi.com",
      "job_title": "Regional Manager",
      "assignment_type": "PRIMARY"
    }
  ],
  "business_assignments_count": 5,
  "user_assignments_count": 15
}

## Sub-Businesses

### Get All Sub-Businesses
```

GET /api/organizations/{organizationId}/sub-businesses

````

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "sub_business_name": "Instanvi Tech Solutions",
    "description": "Technology solutions and software development division",
    "industry": "Technology",
    "parent_sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "max_employees": 50,
    "current_employees": 25,
    "annual_revenue": 5000000,
    "established_year": 2020,
    "is_active": true,
    "website": "https://tech.instanvi.com",
    "contact_email": "tech@instanvi.com",
    "contact_phone": "+237 123 456 789",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
````

### Create Sub-Business

```
POST /api/organizations/{organizationId}/sub-businesses
```

**Request Body:**

```json
{
  "sub_business_name": "Instanvi Tech Solutions",
  "description": "Technology solutions and software development division",
  "industry": "Technology",
  "parent_sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "max_employees": 50,
  "current_employees": 25,
  "annual_revenue": 5000000,
  "established_year": 2020,
  "is_active": true,
  "website": "https://tech.instanvi.com",
  "contact_email": "tech@instanvi.com",
  "contact_phone": "+237 123 456 789"
}
```

### Get Sub-Business by ID

```
GET /api/organizations/{organizationId}/sub-businesses/{id}
```

### Update Sub-Business

```
PUT /api/organizations/{organizationId}/sub-businesses/{id}
```

**Request Body:**

```json
{
  "sub_business_name": "Instanvi Tech Solutions",
  "description": "Technology solutions and software development division",
  "industry": "Technology",
  "parent_sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
  "max_employees": 50,
  "current_employees": 25,
  "annual_revenue": 5000000,
  "established_year": 2020,
  "is_active": true,
  "website": "https://tech.instanvi.com",
  "contact_email": "tech@instanvi.com",
  "contact_phone": "+237 123 456 789"
}
```

### Delete Sub-Business

```
DELETE /api/organizations/{organizationId}/sub-businesses/{id}
```

**Response:** 204 No Content

## Business-Geographical Assignments

### Get All Business-Geographical Assignments

```
GET /api/business-geo-assignments
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
    "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "operation_type": "Regional Office",
    "description": "Instanvi Tech Solutions operating in Littoral Region",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "is_active": true,
    "employee_count": 25,
    "annual_revenue": 2500000,
    "market_share_percentage": 15.5,
    "contact_person": "John Doe",
    "contact_email": "littoral@instanvi.com",
    "contact_phone": "+237 123 456 789",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Business-Geographical Assignment

```
POST /api/business-geo-assignments
```

**Request Body:**

```json
{
  "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
  "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "operation_type": "Regional Office",
  "description": "Instanvi Tech Solutions operating in Littoral Region",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "is_active": true,
  "employee_count": 25,
  "annual_revenue": 2500000,
  "market_share_percentage": 15.5,
  "contact_person": "John Doe",
  "contact_email": "littoral@instanvi.com",
  "contact_phone": "+237 123 456 789"
}
```

### Get Business-Geographical Assignment by ID

```
GET /api/business-geo-assignments/{id}
```

### Update Business-Geographical Assignment

```
PUT /api/business-geo-assignments/{id}
```

**Request Body:**

```json
{
  "operation_type": "Regional Office",
  "description": "Instanvi Tech Solutions operating in Littoral Region",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "is_active": true,
  "employee_count": 25,
  "annual_revenue": 2500000,
  "market_share_percentage": 15.5,
  "contact_person": "John Doe",
  "contact_email": "littoral@instanvi.com",
  "contact_phone": "+237 123 456 789"
}
```

### Delete Business-Geographical Assignment

```
DELETE /api/business-geo-assignments/{id}
```

**Response:** 204 No Content

## User Assignments

### Get All User Assignments

```
GET /api/organizations/{organizationId}/user-assignments
```

**Response:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "location_id": "123e4567-e89b-12d3-a456-426614174000",
    "organizational_structure_id": "123e4567-e89b-12d3-a456-426614174000",
    "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
    "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
    "assignment_type": "PRIMARY",
    "job_title": "Senior Software Engineer",
    "responsibilities": "Lead development of core features and mentor junior developers",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "is_active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create User Assignment

```
POST /api/organizations/{organizationId}/user-assignments
```

**Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "location_id": "123e4567-e89b-12d3-a456-426614174000",
  "organizational_structure_id": "123e4567-e89b-12d3-a456-426614174000",
  "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
  "assignment_type": "PRIMARY",
  "job_title": "Senior Software Engineer",
  "responsibilities": "Lead development of core features and mentor junior developers",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "is_active": true
}
```

### Get User Assignment by ID

```
GET /api/organizations/{organizationId}/user-assignments/{id}
```

### Update User Assignment

```
PUT /api/organizations/{organizationId}/user-assignments/{id}
```

**Request Body:**

```json
{
  "location_id": "123e4567-e89b-12d3-a456-426614174000",
  "organizational_structure_id": "123e4567-e89b-12d3-a456-426614174000",
  "geographical_unit_id": "123e4567-e89b-12d3-a456-426614174000",
  "sub_business_id": "123e4567-e89b-12d3-a456-426614174000",
  "assignment_type": "PRIMARY",
  "job_title": "Senior Software Engineer",
  "responsibilities": "Lead development of core features and mentor junior developers",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "is_active": true
}
```

### Delete User Assignment

```
DELETE /api/organizations/{organizationId}/user-assignments/{id}
```

**Response:** 204 No Content

### Get Assignments by User

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}
```

### Get Assignments by Organization

```
GET /api/organizations/{organizationId}/user-assignments/organization/{organizationId}
```

### Get Assignments by Location

```
GET /api/organizations/{organizationId}/user-assignments/location/{locationId}
```

### Get Assignments by Department

```
GET /api/organizations/{organizationId}/user-assignments/department/{structureId}
```

### Get Assignments by Geographical Unit

```
GET /api/organizations/{organizationId}/user-assignments/geo-unit/{geoUnitId}
```

### Get Assignments by Sub-Business

```
GET /api/organizations/{organizationId}/user-assignments/sub-business/{subBusinessId}
```

### Get Full User Context

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}/context
```

**Response:**

```json
{
  "location": {},
  "department": {},
  "geographicalUnit": {},
  "subBusiness": {},
  "assignment": {}
}
```

### Get User Location

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}/location
```

### Get User Department

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}/department
```

### Get User Geographical Unit

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}/geo-unit
```

### Get User Sub-Business

```
GET /api/organizations/{organizationId}/user-assignments/user/{userId}/sub-business
```

### Deactivate User Assignment

```
PUT /api/organizations/{organizationId}/user-assignments/{id}/deactivate
```

**Response:** 200 OK (Returns updated assignment with is_active: false)

```

```
