'use client';
import Box from '../layout/navbar/box';
import InvoiceTableComponents from './components/table';

import { useState } from 'react';
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
        <InvoiceTableComponents
        />
      </div>

    </div>
  );
};

export default Invoice;
