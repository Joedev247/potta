'use client';

import InvoiceTableComponents from './components/table';

import Link from 'next/link';
import SliderInvoice from './components/slideNewInvoice';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import Button from '@potta/components/button';
import { useState } from 'react';
import ModalInvoice from '@potta/app/(routes)/invoice/components/modal';
import useGetAllInvoice from '@potta/app/(routes)/invoice/_hooks/useGetAllInvoice';
import { v4 as uuid } from 'uuid';
import DataGrid from './components/DataGrid';
import CustomInput from './components/CustomInput';
import CustomSelect, { IOption } from './components/CustomSelect';
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
