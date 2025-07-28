'use client';

import { useState } from 'react';
import InvoiceTableComponents from '../../vouchers/components/table';
import { ContextData } from '@potta/components/context';
import { useContext } from 'react';
import RootLayout from '../../layout';
const Invoice = () => {
  const [page, setPage] = useState(1);
  const context = useContext(ContextData);

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'px-14' : 'px-5'
        } py-5`}
      >
        {/* <CustomInput />
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose an option"
      /> */}
        <div className="">
          <InvoiceTableComponents />
        </div>
      </div>
    </RootLayout>
  );
};

export default Invoice;
