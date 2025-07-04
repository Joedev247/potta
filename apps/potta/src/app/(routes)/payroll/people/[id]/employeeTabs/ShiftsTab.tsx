import React from 'react';
import MyTable from '@potta/components/table';

const ShiftsTab = ({ employee }: { employee: any }) => (
  <div className="mt-6">
    <MyTable
      columns={[
        { name: 'Name', selector: (row: any) => row.name },
        { name: 'Start Time', selector: (row: any) => row.start_time },
        { name: 'End Time', selector: (row: any) => row.end_time },
        { name: 'Break (min)', selector: (row: any) => row.break_minutes },
        {
          name: 'Active',
          selector: (row: any) => (row.is_active ? 'Yes' : 'No'),
        },
      ]}
      data={employee?.shifts || []}
      ExpandableComponent={null}
      expanded
      pagination={(employee?.shifts?.length || 0) > 9}
    />
  </div>
);

export default ShiftsTab;
