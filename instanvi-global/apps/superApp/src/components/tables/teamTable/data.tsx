"use client";
import TeamTable from ".";
import React, { FC, useState, useEffect } from "react";

export interface DataRow {
    firstname: string;
    lastname: string;
    email: string;
    roles: string;
    status: string;
}

const data: DataRow[] = [
    {
        firstname: "Jean Paul",
        lastname: "Lamark",
        email: "jean.lamark@gmail.com",
        status: "active",
        roles: "4"
    },
];

const TableTeam: FC = () => {
    const [records, setRecords] = useState<DataRow[]>([]);
    return (
        <div className="">
            <TeamTable data={data} records={records} setRecords={setRecords} />
        </div>
    );
};

export default TableTeam;