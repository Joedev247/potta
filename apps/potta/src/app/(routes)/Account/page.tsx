'use client'
import React, { useContext } from "react";

import RootLayout from "../layout";
import TableAccount from "./components/table";

const Account = () => {
    return (
        <RootLayout>
            <div className="px-14 pt-10">
                <TableAccount />
            </div>
        </RootLayout>
    )
}
export default Account 