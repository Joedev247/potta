"use client";
import ProductTable from ".";
import React, { FC, useState } from "react";


export interface DataRow {
    date: string;
    transaction: string;
    chanel: string;
    order: string;
    currency: string;
    total: string;
}

const data: DataRow[] = [
    {
        date: "4/23/2022",
        transaction: "Payment",
        chanel: "Billboards",
        order: 'FO112ED34B2',
        currency: 'XAF',
        total: '400',
    },
];

const TableTransaction: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default TableTransaction