'use client';

import InvoiceTableComponents from './components/table';

import Link from 'next/link';

import { useState } from 'react';


const Invoice = () => {
  const [detailsModal, setDetailsModal] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  




  return (
    <div className="pt-10 px-14">
    



      {/* <CustomInput />
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose an option"
      /> */}
      <div className="mt-5">
        <InvoiceTableComponents
        />
      </div>

    </div>
  );
};

export default Invoice;
