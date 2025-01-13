'use client'
import Slider from "@/components/slideover";
import React, { useState } from "react";
import SelectInventory from "./components/selectInventory";
import CreateProduct from "./components/create_product";

const SlideOverInventory = () => {
    const [data_to_show, setData_to_show] = useState("")
    return (
        <Slider edit={false} buttonText="inventory" title={"Inventory"}>
            <div className="w-full">
                {/* <SelectInventory /> */}
                <CreateProduct />
            </div>
        </Slider>
    )
}
export default SlideOverInventory