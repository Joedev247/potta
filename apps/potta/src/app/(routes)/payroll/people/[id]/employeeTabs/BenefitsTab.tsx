import React from 'react';
import MyTable from '@potta/components/table';

const BenefitsTab = ({ employee }: { employee: any }) => (
  <div className="mt-6">
    <MyTable
      columns={[
        { name: 'Name', selector: (row: any) => row.name },
        { name: 'Type', selector: (row: any) => row.type },
        { name: 'Value', selector: (row: any) => row.value },
        { name: 'Provider', selector: (row: any) => row.provider },
      ]}
      data={employee?.benefits || []}
      ExpandableComponent={null}
      expanded
      pagination={(employee?.benefits?.length || 0) > 9}
    />
  </div>
);

export default BenefitsTab;
