import Input from '@potta/components/input';
import Select from '@potta/components/select';
import react from 'react';
import BenefitTable from './components/benefitTable';
import TaxTable from './components/taxtable';

const Benefit = () => {
  return (
    <div className="w-full pt-10 px-14">
      <div className="mt-5">
        <div className="">
          <p>Add Benefits</p>
          <Select
            options={[{ label: 'Health Insurance', value: 'Health Insurance' }]}
            selectedValue={'Health Insurance'}
            onChange={undefined}
            bg={''}
          />
        </div>
        {/* table d1 here  */}
        <div className="my-5">
          <BenefitTable />
        </div>
        <h4 className="text-lg font-medium mt-5">Other Post-Tax deductions</h4>
        <p>
          Deduct recurring amount from employee after tax. Deductions are done
          on same intervals as your paycheck
        </p>
        <div className="my-5">
          <TaxTable />
        </div>
        {/* table here  */}

        <div className="mt-5">
          <div className="w-full p-3 border-2 border-gray-300 border-dashed">
            <div className="flex space-x-3 w-full">
              <div className="w-[45%]">
                <p>Motif</p>
                <Input type={'text'} name={''} />
              </div>
              <div className="w-[50%] flex">
                <div className="w-[90%]">
                  <p>Amount</p>
                  <Input type={'number'} name={''} />
                </div>
                <div className="mt-8">
                  <Select
                    options={[{ label: 'XAF', value: 'XAF' }]}
                    selectedValue={'XAF'}
                    onChange={undefined}
                    bg={''}
                  />
                </div>
              </div>
              <div className="flex justify-cente mt-10">
                <button className="h-8 w-8 rounded-full text-white bg-green-500">
                  <i className="ri-add-line text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-green-500 ">
            <i className="ri-add-line"></i> Add new
          </p>
        </div>
      </div>
    </div>
  );
};
export default Benefit;
