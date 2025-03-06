'use client'
import React, { FC, ReactNode } from "react";
import RootLayout from "../layout";
import NextUiProvider from '@potta/app/(routes)/invoicing/components/provider';

interface Props {
    children: ReactNode
}

const InvoiceLayout: FC<Props> = ({ children }) => {
    return (
      <NextUiProvider>
        <RootLayout>
            <div className="w-full h-screen">
                <div className="h-[100vh] w-full overflow-hidden  relative  p-0 ">
                    {children}
                </div>
            </div>
        </RootLayout>
      </NextUiProvider>
    )
}
export default InvoiceLayout;
