"use client";
import React from "react";
import Link from "next/link";

import { Search } from "@instanvi/ui-components";
import { Select } from "@instanvi/ui-components";
import Active from "apps/superApp/src/components/tables/APPS/data";

const Apps: React.FC = () => {

    return (
        <div className='w-full md:px-16 '>
            <div className='flex justify-between mt-10'>
                <div className='w-2/3 sm:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-1'>
                    <div className="col-span-2">
                        <Search placeholder={'Search for team'} />
                    </div>
                    <div className="z-10">
                        <Select options={[{ value: "active", label: "Active" }]} />
                    </div>
                </div>

                <div className='w-1/2 flex justify-end'>
                    <Link href={'/newApp'}>
                        <button className="px-4 py-2.5 text-white bg-green-800">New App</button></Link>
                </div>
            </div>
            <div className='w-full mt-5'>
                <Active />
            </div>
        </div>
    );
};
export default Apps;