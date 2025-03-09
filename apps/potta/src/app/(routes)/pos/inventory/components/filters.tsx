'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';

import CreateProduct from './slides/components/create_product';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('createdAt:ASC'); // Set your default value here

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="w-full flex justify-between ">
      <div className="flex space-x-2 w-[60%]">
        <div className=" w-[60%]">
          <Search />
        </div>
        <div className="flex mt-2 w-[40%] space-x-2">
          <div>
            <Select
              options={[
                { label: 'Created At:ASC', value: 'createdAt:ASC' },
                { label: 'Created At:DESC', value: 'createdAt:DESC' },
                { label: 'Updated At:ASC', value: 'updatedAt:ASC' },
                { label: 'Updated At:DESC', value: 'updatedAt:DESC' },
              ]}
              selectedValue={selectedValue}
              onChange={handleChange}
              bg=" " // Add your desired background class here
            />
          </div>
        </div>
      </div>
      <div className=" w-[25%] mt-4 ">
        <div className="flex w-full space-x-3">
          <div className="w-full  flex space-x-3 justify-end ">
            <Button
              type={'button'}
              color
              text="Export"
              icon={<img src="/images/export.svg" />}
              theme="lightGreen"
            />

            <CreateProduct />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
