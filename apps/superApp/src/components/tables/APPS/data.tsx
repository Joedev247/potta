"use client";
import ProductTable from ".";
import React, { FC, useState} from "react";


export interface DataRow {
    appname: string;
    accountname: string;
}

const data: DataRow[] = [
    {
        appname: "Winter Campaign",
        accountname: 'ABC Channel',
    },
];

const Active: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <ProductTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default Active