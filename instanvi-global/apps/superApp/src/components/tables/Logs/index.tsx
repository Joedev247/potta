"use client";
import React, { FC, useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DataRow } from "./data";
import CustomLoader from "../Loader";


interface Props {
    data: DataRow[];
    records: DataRow[];
    setRecords: React.Dispatch<React.SetStateAction<DataRow[]>>;
}

const columns: TableColumn<DataRow>[] = [
    {
        name: <div className="w-full text-[17px] text-left">Datetime</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left">{row.datetime}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-left">User</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left">{row.user}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-left">Action</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left">{row.action}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-left">STATUS</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left">
            <button type="button" className="rounded-full bg-green-500 hover:bg-green-500 font-medium px-4 text-left">
                succes</button>
        </div>,
        sortable: true,
    }
];

const LogsTable: FC<Props> = ({ data, records, setRecords }) => {
    const [pending, setPending] = useState<boolean>(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRecords(data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    // Internally, customStyles will deep merges your customStyles with the default styling.
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f3fbfb",
            },
        },
    };

    return (
        <div className="flex flex-col">
            <div
                className="border rounded-[2px]">
                <DataTable
                    columns={columns}
                    data={records}
                    className="relative md:overflow-x-hidden"
                    pagination
                    customStyles={customStyles}
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                />
            </div>
        </div>
    );
};

export default LogsTable;