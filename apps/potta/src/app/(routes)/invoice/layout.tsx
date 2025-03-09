'use client'
import React, { FC, ReactNode } from "react";
import RootLayout from "../layout";

interface Props {
    children: ReactNode
}

const InvoiceLayout: FC<Props> = ({ children }) => {
    return (
        <RootLayout>
            <div className="w-full h-screen">
                <div className="h-[100vh] w-full overflow-hidden  relative  p-0 ">
                    {children}
                </div>
            </div>
        </RootLayout>
    )
}
export default InvoiceLayout;