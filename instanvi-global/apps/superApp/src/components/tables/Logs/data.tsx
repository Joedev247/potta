"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    datetime: string;
    user: string;
    action: string;
}

const data: DataRow[] = [
    {
        datetime: "4/23/2022|03:15",
        user: "myuserabc@gmail",
        action: "New Login to account",
    },
];

const Logs: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Logs