import React from 'react';
import MyTable from '@potta/components/table';

const PTOTab = ({ employee }: { employee: any }) => (
  <div className="mt-6">
    <MyTable
      columns={[
        { name: 'Type', selector: (row: any) => row.type },
        { name: 'Cycle', selector: (row: any) => row.cycle_type },
        { name: 'Accrual Rate', selector: (row: any) => row.accrual_rate },
        {
          name: 'Entitled Days',
          selector: (row: any) => row.total_entitled_days,
        },
        { name: 'Used', selector: (row: any) => row.days_used },
        { name: 'Remaining', selector: (row: any) => row.days_remaining },
        { name: 'Status', selector: (row: any) => row.status },
      ]}
      data={employee?.paid_time_off || []}
      ExpandableComponent={null}
      expanded={false}
      pagination={(employee?.paid_time_off?.length || 0) > 9}
    />
  </div>
);

export default PTOTab;
