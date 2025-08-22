# Organigram Module

An interactive organizational chart that displays company hierarchy, employee positions, and office locations with real-time updates.

## Features

- **Interactive Org Chart**: Built with React Flow for smooth interactions
- **Multiple View Modes**: Hierarchy, Location, and Business Unit views
- **Advanced Filtering**: Filter by location, business unit, and geographical region
- **Search Functionality**: Search departments and employees
- **Real-time Data**: Live updates from API endpoints
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Data Models

The module uses PostgreSQL's `ltree` for hierarchical data storage:

- **OrganizationalStructure**: Departments with hierarchical paths
- **UserAssignment**: Employee positions and assignments
- **Location**: Physical office locations
- **GeographicalUnit**: Regional groupings
- **SubBusiness**: Business unit divisions

### Key Components

1. **OrgChartComponent**: Main component with React Flow integration
2. **OrgChartNode**: Custom node component for departments
3. **OrgChartControls**: Search and filter controls
4. **OrgChartTable**: Table view for data analysis

## API Endpoints

The module expects the following API structure:

```
/organizations/{organizationId}/
├── organizational-structures
├── user-assignments
├── locations
├── geographical-units
├── sub-businesses
├── business-geo-assignments
└── templates
```

## Usage

```tsx
import OrganigramPage from './organigram/page';

// The page is accessible at /organigram
```

## Development

### Demo Data

Currently using demo data for development. To switch to real API:

1. Update `utils/api.ts` to use real API calls
2. Remove demo data imports
3. Ensure API endpoints are available

### Styling

Uses Tailwind CSS for styling with minimal custom CSS. The design follows the project's design system.

### Dependencies

- **React Flow**: For interactive org chart visualization
- **React Data Table**: For table view (using existing table component)
- **Tailwind CSS**: For styling

## Future Enhancements

1. **Drag & Drop**: Reorganize departments by dragging
2. **Real-time Updates**: WebSocket integration for live updates
3. **Export Features**: PDF/PNG export of org chart
4. **Advanced Analytics**: Employee distribution reports
5. **Mobile Optimization**: Touch-friendly interactions

## Notes

- The module follows the project's patterns for API integration
- Uses the existing table component for consistency
- Implements proper TypeScript types for type safety
- Follows the materialized path system for efficient tree building
