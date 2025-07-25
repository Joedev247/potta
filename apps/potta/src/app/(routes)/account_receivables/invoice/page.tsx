'use client';
import { ContextData } from '@potta/components/context';
import { useContext } from 'react';
import InvoiceTableComponents from '../credit/components/table';
const Invoice = () => {
  const context = useContext(ContextData);

  return (
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
  );
};

export default Invoice;
