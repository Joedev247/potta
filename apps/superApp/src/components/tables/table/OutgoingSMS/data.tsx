"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    item: string;
    cost: string;
    operator: string;
    price: string;
}

const data: DataRow[] = [
    {
        item: "SMS",
        cost: "10XAF",
        operator: "MTN Cameroon",
        price: 'Message',
    },
];

const OutgoingSMS: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default OutgoingSMS