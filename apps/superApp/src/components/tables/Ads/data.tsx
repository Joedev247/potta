"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    item: string;
    cost: string;
    price: string;
}

const data: DataRow[] = [
    {
        item: "TV & Radio Clearance Fee",
        cost: "50,000XAF",
        price: 'one-time',
    },
];

const Ads: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Ads