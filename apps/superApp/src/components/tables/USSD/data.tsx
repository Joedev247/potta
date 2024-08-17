"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    item: string;
    operator: string;
    cost: string;
    price: string;
}

const data: DataRow[] = [
    {
        item: "USSD",
        operator: "MTN Cameroon",
        cost: "15XAF",
        price: 'Session',
    },
];

const USSD: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default USSD