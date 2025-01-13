import React from "react";
import RootLayout from "../../layout";
import Filter from "../../expenses/components/filters";
import SaleBoxes from "./components/boxes";
import SaleTable from "./components/table";



const Files = () => {
    return (
        <RootLayout>
            <div className="pl-16 pr-5 w-full mt-10">
                <div className="mb-6">
                    <SaleBoxes />
                </div>
                <Filter />
                <SaleTable />
            </div>
        </RootLayout>
    )
}
export default Files