'use client';
import Link from 'next/link';
import { useState } from 'react';
import RootLayout from '../../layout';
import PolicyTable from '../../policies/components/table';

const Invoice = () => {
  const [detailsModal, setDetailsModal] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  return (
    <RootLayout>
      <div className="px-14">
        <div className="">
          <PolicyTable />
        </div>
      </div>
    </RootLayout>
  );
};

export default Invoice;
