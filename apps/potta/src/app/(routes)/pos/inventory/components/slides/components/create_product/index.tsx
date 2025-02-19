import MyDropzone from "@potta/components/dropzone";
import Select from "@potta/components/select";
import React, { useContext, useState } from "react";
import Inventory from "./components/inventory";
import Unit from "./components/units";
import Notes from "./components/notes";
import Attachments from "./components/attachments";
import Button from "@potta/components/button";
import { ContextData } from '@potta/components/context';
const CreateProduct = () => {
    const [data, setData] = useState("units")
    const context = useContext(ContextData);

    const [name, setDate] = useState('')
    
    return (
        <div className="pr-8">
            <div className="w-full">
                <label htmlFor="">Product/Service Name</label>
                <Select options={[{ label: "Product", value: "Product" }]} selectedValue={"Product"} onChange={() => { }} bg={""} />
            </div>
            <div className="w-full grid mt-5 grid-cols-2 gap-2">
                <div className="w-full">
                    <label htmlFor="">Product/Service Name</label>
                    <Select options={[{ label: "Product Category", value: "Product Category" }]} selectedValue={"Product Category"} onChange={() => { }} bg={""} />
                </div>
                <div className="w-full">
                    <label htmlFor="">Category Name</label>
                    <Select options={[{ label: "some Category ", value: "some Category" }]} selectedValue={"some Category"} onChange={() => { }} bg={""} />
                </div>
            </div>
            <div className="w-full mt-5">
                <label htmlFor="">Product/Service Name</label>
                <textarea name="" className="border outline-none w-full mt-2 p-2" id=""></textarea>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5">
                <div>
                    <div>
                        <label htmlFor="">Image</label>
                        <MyDropzone />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Sales Account</label>
                        <Select options={[{ label: "General Sales ", value: "General Sales" }]} selectedValue={"General Sales"} onChange={() => { }} bg={""} />
                    </div>
                </div>
                <div className="w-full">
                    <div className="mt-6">
                        <label htmlFor="">Preferred Vendor</label>
                        <Select options={[{ label: "Select Vendor ", value: "Select Vendor" }]} selectedValue={"Select Vendor"} onChange={() => { }} bg={""} />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="">Tax Code</label>
                        <Select options={[{ label: "Select Vendor ", value: "Select Vendor" }]} selectedValue={"Select Vendor"} onChange={() => { }} bg={""} />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="">Purchase Account</label>
                        <Select options={[{ label: "Purchases ", value: "Purchases" }]} selectedValue={"Purchases"} onChange={() => { }} bg={""} />
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="flex ">
                    <div onClick={() => setData("units")} className={`px-4 py-2 bg-green-50 cursor-pointer ${data == "units" && 'border-b-2 border-green-500 text-green-500'}`}>
                        <p>Units</p>
                    </div>
                    <div onClick={() => setData("inventory")} className={`px-4 py-2 bg-green-50 cursor-pointer ${data == "inventory" && 'border-b-2 border-green-500 text-green-500'}`}>
                        <p>Inventory</p>
                    </div>
                    <div onClick={() => setData("notes")} className={`px-4 py-2 bg-green-50 cursor-pointer ${data == "notes" && 'border-b-2 border-green-500 text-green-500'}`}>
                        <p>Notes</p>
                    </div>
                    <div onClick={() => setData("attachement")} className={`px-4 py-2 bg-green-50 cursor-pointer ${data == "attachement" && 'border-b-2 border-green-500 text-green-500'}`}>
                        <p>Attachements</p>
                    </div>
                </div>
                <div className="mt-8">
                    {data == "inventory" && <Inventory />}
                    {data == "units" && <Unit />}
                    {data == "notes" && <Notes />}
                    {data == "attachement" && <Attachments />}
                </div>
            </div>
            <div className="w-full mt-16 flex justify-end">
                <div className="flex space-x-2">
                    <div>
                        <Button text={"Save and New"} theme="lightBlue" type={"submit"} />
                    </div>
                    <div>
                        <Button text={"Save in Close"} type={"submit"} />
                    </div>
                </div>
            </div>

        </div>

    )
}
export default CreateProduct
