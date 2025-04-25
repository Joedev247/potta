import Input from '@potta/components/input';
import Select from '@potta/components/select';
import react from 'react';

const Schedule = () => {
  return (
    <div className="w-full pt-10 px-14">
      <div className="grid grid-cols-2 gap-5">
        <div className="">
          <div className="">
            <Input type={'date'} label="First Pay Date" name={''} />
          </div>
          <div className="mt-8">
            <Input type={'date'} label="End Pay Date" name={''} />
          </div>
          <div className="mt-8">
            <p>Payment Method</p>
            <Select
              options={[{ label: 'Direct Deposite', value: 'Direct Deposite' }]}
              selectedValue={'Direct Deposite'}
              onChange={undefined}
              bg={''}
            />
          </div>
          <div className="mt-8">
            <Input type={'text'} label="Pay Cycle Name" name={''} />
          </div>
        </div>
        <div className="">
          <div className="md:w-[90%] p-5 bg-[#F9F9F9] flex w-full">
            <div className="w-[70%] space-y-2">
              <h3 className="text-lg font-medium">Pay Period</h3>
              <p>01/03/2024 - 01/04/2024</p>
            </div>
            <div className="w-[30%] space-y-2">
              <h3 className="text-lg font-medium">Pay Date</h3>
              <p> 01/04/2024</p>
            </div>
          </div>
          <div className="md:w-[90%] mt-5 p-5 bg-[#F9F9F9] flex w-full">
            <div className="w-[70%] space-y-2">
              <h3 className="text-lg font-medium">Pay Period</h3>
              <p>01/03/2024 - 01/04/2024</p>
            </div>
            <div className="w-[30%] space-y-2">
              <h3 className="text-lg font-medium">Pay Date</h3>
              <p> 01/04/2024</p>
            </div>
          </div>
          <div className="md:w-[90%] mt-5 p-5 bg-[#F9F9F9] flex w-full">
            <div className="w-[70%] space-y-2">
              <h3 className="text-lg font-medium">Pay Period</h3>
              <p>01/03/2024 - 01/04/2024</p>
            </div>
            <div className="w-[30%] space-y-2">
              <h3 className="text-lg font-medium">Pay Date</h3>
              <p> 01/04/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
