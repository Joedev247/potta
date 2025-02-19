'use client'
import Select from "@potta/components/select";
import React, { useState } from "react";


const Filter = () => {
    const [selectedValue, setSelectedValue] = useState("All Time");
    const handleChange = (value: string) => {
        setSelectedValue(value);
    };
    return (
        <div className="w-full flex px-4 justify-between">
            <div className="w-[50%]">
                <h2 className="text-3xl">All Files</h2>
            </div>
            <div className="flex w-[50%] justify-end space-x-2 ">
                <div className="flex">
                    <div className="w-[47px] h-[47px] flex justify-center border-y border-l items-center">
                        <i className="ri-align-justify"></i>
                    </div>
                    <div className="w-[47px] h-[47px] flex justify-center border items-center">
                        <i className="ri-layout-grid-fill"></i>
                    </div>
                </div>
                <div>
                    <div className="flex h-[47px] py-3.5  w-full px-2 border">
                        <p className="text-[17px] -mt-1">Group By &nbsp;: </p>
                        <div className="-mt-3">
                            <Select
                                border={true}
                                options={[
                                    { label: "All Time", value: "All Time" },
                                    { label: "Yesterday", value: "Yesterday" }
                                ]}
                                selectedValue={selectedValue}
                                onChange={handleChange}
                                bg=" " // Add your desired background class here
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter
