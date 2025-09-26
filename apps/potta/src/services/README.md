# Search Service Integration

This document describes how the Global Search component has been integrated with the API endpoints.

## Files Created/Modified

### 1. Search Service (`searchService.ts`)

- Handles all API calls to the search endpoints
- Provides type-safe interfaces for requests and responses
- Includes utility functions for data transformation

### 2. Global Search Hook (`useGlobalSearch.ts`)

- Manages search state and API interactions
- Provides debounced search functionality
- Handles filter management and pagination

### 3. Updated Global Search Component (`GlobalSearch/index.tsx`)

- Integrated with real API instead of dummy data
- Added loading states and error handling
- Connected filter system to API calls

## API Endpoints Used

### POST /api/search/global

- Main search endpoint for global search across all entities
- Supports advanced filtering, pagination, and sorting
- Returns structured search results with aggregations

### GET /api/search/suggestions

- Provides auto-complete suggestions
- Debounced to avoid excessive API calls
- Returns array of suggestion strings

### GET /api/search/facets

- Returns available filter options and their counts
- Used to populate filter dropdowns dynamically

## Usage Example

```typescript
import { useGlobalSearch } from '../../hooks/useGlobalSearch';

const MyComponent = () => {
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    filters,
    updateFilter,
    performSearch,
    clearSearch,
  } = useGlobalSearch({
    orgId: 'your-org-id',
    locationContextId: 'your-location-id',
  });

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />

      {isSearching && <div>Searching...</div>}

      {searchResults?.results.map((result) => (
        <div key={result.id}>
          <h3>{result.title}</h3>
          <p>{result.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
```

## Key Features

### 1. **Debounced Search**

- 500ms debounce for search queries
- 300ms debounce for suggestions
- Prevents excessive API calls

### 2. **Advanced Filtering**

- Entity type filtering (customers, vendors, employees, etc.)
- Date range filtering
- Status and amount range filtering
- Real-time filter application

### 3. **Pagination**

- Built-in pagination support
- Load more functionality
- Efficient result loading

### 4. **Error Handling**

- Graceful error handling for API failures
- Loading states for better UX
- Fallback to dummy data when needed

### 5. **Type Safety**

- Full TypeScript support
- Type-safe API interfaces
- Compile-time error checking

## Configuration

To use the search functionality, you need to:

1. **Set Organization ID**: Update the `orgId` in the hook call
2. **Configure Location Context**: Set `locationContextId` if needed
3. **Update Context**: Add organization and location data to the app context

## Future Enhancements

1. **Caching**: Implement search result caching for better performance
2. **Analytics**: Add search analytics and usage tracking
3. **Personalization**: Implement personalized search results
4. **Real-time Updates**: Add real-time search result updates
5. **Advanced Filters**: Add more sophisticated filtering options

## Testing

The search functionality can be tested by:

1. Opening the Global Search component in the navbar
2. Typing search queries
3. Applying filters
4. Checking network requests in browser dev tools
5. Verifying API responses match expected format


