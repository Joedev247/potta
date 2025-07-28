'use client';
import { ContextData } from '@potta/components/context';
import { useContext } from 'react';
import InvoiceTableComponents from '../credit/components/table';
import RootLayout from '../../layout';
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
          <InvoiceTableComponents />
        </div>
      </div>
   </RootLayout>
  );
};

export default Invoice;
