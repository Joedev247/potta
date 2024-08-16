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
        name: <div className="w-full text-[17px] text-left pl-5">Item</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left pl-5">{row.item}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-left pl-5">Cost</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left pl-5">{row.cost}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-left pl-5">Price per</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-left pl-5">{row.price}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-center">Compliance Check</div>,
        cell: (row) => <div className="w-full text-center">
            <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
        </div>,
        sortable: false,
    }
];

const VoiceTable: FC<Props> = ({ data, records, setRecords }) => {
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
                className="border ">
                <DataTable
                    columns={columns}
                    data={records}
                    className="relative md:overflow-x-hidden"
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default VoiceTable;
