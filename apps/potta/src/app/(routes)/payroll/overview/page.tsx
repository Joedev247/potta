import React from "react";
import Boxes from "./components/boxes";
import PayBreakDown from "./components/payBreakdown";
import PayrollTable from "./components/table";
import RootLayout from "../../layout";

const Overview = () => {
    return (
        <RootLayout>
            <div className="px-14">
                <div className="mt-5 flex space-x-8">
                    <div className="w-[50%]">
                        <Boxes />
                    </div>
                    <div className="w-[50%]">
                        <PayBreakDown />
                    </div>
                </div>
                {/* searhc here  */}

                <PayrollTable />
            </div>
        </RootLayout>
    );

}
export default Overview