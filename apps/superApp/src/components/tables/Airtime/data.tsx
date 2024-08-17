"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    item: string;
    discount: string;
}

const data: DataRow[] = [
    {
        item: "Airtime",
        discount: '1.3%',
    },
];

const Airtime: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Airtime