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
        item: "Whatsapp Message",
        cost: "5XAF",
        price: 'Message',
    },
];

const Whatsapp: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Whatsapp