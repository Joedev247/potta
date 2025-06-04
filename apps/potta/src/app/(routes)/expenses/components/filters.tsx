'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';
import CreateBudgetModal from '../../dashboard/components/createBudgetModal';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('All Time'); // Set your default value here
  const [selectedValue2, setSelectedValue2] = useState('pending'); // Set your default value here
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const handleChange2 = (value: string) => {
    setSelectedValue2(value);
  };

  const handleCreateBudget = (budgetData: {
    name: string;
    goal: string;
    recurrence: string;
    approvalRequirement: string;
    atLeastCount?: number;
  }) => {
    // Here you would typically save the budget data to your backend
    console.log('Budget created:', budgetData);

    // You can add API call here to save the budget
    // Example: saveBudget(budgetData)
  };

  return (
    <>
      <div className="w-full flex justify-between my-4 ">
        <div className="flex space-x-2 w-[50%]">
          <div className=" w-[50%]">
            <Search />
          </div>
          <div className="flex mt-4 w-[50%] space-x-2">
            <div className="flex h-[47px] pt-3 w-full px-2 border">
              <p className="text-[17px] -mt-1">Filter&nbsp;: </p>
              <div className="-mt-3">
                <Select
                  border={true}
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Paid', value: 'paid' },
                  ]}
                  selectedValue={selectedValue2}
                  onChange={handleChange2}
                  bg=" " // Add your desired background class here
                />
              </div>
            </div>
            <div className="flex h-[47px] py-3.5  w-full px-2 border">
              <p className="text-[17px] -mt-1">Date&nbsp;: </p>
              <div className="-mt-3">
                <Select
                  border={true}
                  options={[
                    { label: 'All Time', value: 'All Time' },
                    { label: 'Yesterday', value: 'Yesterday' },
                  ]}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                  bg=" " // Add your desired background class here
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[30%] mt-4 ">
          <div className="flex w-full ">
            <div className="w-full  flex justify-end ">
              <Button
                type={'button'}
                color
                text="Export"
                icon={<img src="/images/export.svg" />}
                theme="lightBlue"
              />
            </div>
            <div className="w-full flex justify-end">
              <Button
                type={'button'}
                text="Create Budget"
                icon={<i className="ri-add-line text-white text-xl "></i>}
                theme="default"
                onClick={() => setIsBudgetModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Budget Creation Modal */}
      <CreateBudgetModal
        open={isBudgetModalOpen}
        setOpen={setIsBudgetModalOpen}
        onSave={handleCreateBudget}
      />
    </>
  );
};

export default Filter;
