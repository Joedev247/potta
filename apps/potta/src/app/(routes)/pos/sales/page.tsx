import React from "react";
import RootLayout from "../../layout";
import Filter from "./components/filters";
import SaleTable from "./components/table";



const Files = () => {
    return (
        <RootLayout>
            <div className="pl-16 pr-5 w-full mt-10">
               
                <SaleTable />
            </div>
        </RootLayout>
    )
}
export default Files
