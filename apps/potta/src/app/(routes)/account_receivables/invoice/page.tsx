'use client';
import { ContextData } from '@potta/components/context';
import { useContext } from 'react';
import RootLayout from '../../layout';
import InvoiceTable from '../components/table';
const Invoice = () => {
  const context = useContext(ContextData);

  return (
   <RootLayout>
      <div className={`${context?.layoutMode === 'sidebar' ? 'px-14' : 'px-5'}`}>
        {/* <CustomInput />
        <CustomSelect
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
          placeholder="Choose an option"
        /> */}
        <div className="">
          <InvoiceTable />
        </div>
      </div>
   </RootLayout>
  );
};

export default Invoice;
