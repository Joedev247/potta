import Box from './components/box';
import InvoiceTableComponents from './components/table';

import Link from 'next/link';
import SliderInvoice from './components/slideNewInvoice';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import Button from '@potta/components/button';

const Invoice = () => {
  return (
    <div className="px-14 pt-10">
      <Box />
      <div className="w-full flex justify-between">
        <div className="mt-5 w-[50%] flex space-x-2">
          <div className="w-[65%]">
            <Search />
          </div>
          <div className="w-[17%] mt-4">
            <Select
              options={[{ label: 'Filter', value: 'Filter' }]}
              selectedValue={'Filter'}
              onChange={undefined}
              bg={''}
            />
          </div>
          <div className="w-[17%] mt-4">
            <Select
              options={[{ label: 'Filter', value: 'Filter' }]}
              selectedValue={'Filter'}
              onChange={undefined}
              bg={''}
            />
          </div>
        </div>
        <div className="w-[50%] flex justify-end">
          <div className="flex mt-10 space-x-2">
            <div>
              <Link href={'/invoice/new_invoice'}>
                <Button
                  text={'Export'}
                  icon={<i className="ri-upload-2-line"></i>}
                  theme="lightBlue"
                  type={'button'}
                />
              </Link>
            </div>
            <div>
              <SliderInvoice />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <InvoiceTableComponents />
      </div>
    </div>
  );
};

export default Invoice;
