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
        item: "Conversations",
        cost: "100XAF",
        price: 'user/month',
    },
];

const Conversations: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Conversations