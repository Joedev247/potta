'use client';
import Box from '../layout/navbar/box';
import InvoiceTableComponents from './components/table';

import Link from 'next/link';

import { useState } from 'react';


import PolicyTable from './components/table';
const Invoice = () => {
  const [detailsModal, setDetailsModal] = useState<boolean>(false);
  const [page, setPage] = useState(1);





  return (
    <div className=" px-14">




      {/* <CustomInput />
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose an option"
      /> */}
      <div className="">
        <PolicyTable/>
        
      </div>

    </div>
  );
};

export default Invoice;
