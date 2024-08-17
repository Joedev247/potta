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
        name: <div className="w-full text-[16px] text-left pl-5">DATE</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left pl-5">{row.date}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[16px] text-left pl-5">TRANSACTION</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left pl-5">{row.transaction}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[16px] text-left pl-5">CHANEL</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left pl-5">{row.chanel}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[16px] text-left pl-5">ORDER NO.</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left pl-5">{row.order}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[16px] text-left pl-5">CURRENCY</div>,
        cell: (row) => <div className="w-6ull text-left pl-5">{row.currency}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[16px] text-left pl-5">TOTAL</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left pl-5">{row.total}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-center">STATUS</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-center">
            <button type="button" className="rounded-full bg-[#0E9F6E] hover:bg-[#046C4E]/90 font-medium px-4 py-1 text-center">
                succesful</button>
        </div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-center">PDF</div>,
        cell: (row) => <div className="w-full grid justify-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 19H21V21H3V19ZM13 13.1716L19.0711 7.1005L20.4853 8.51472L12 17L3.51472 8.51472L4.92893 7.1005L11 13.1716V2H13V13.1716Z"></path></svg>
        </div>,
        sortable: true,
    }
];

const TransactionsTable: FC<Props> = ({ data, records, setRecords }) => {
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
                className="border">
                <DataTable
                    columns={columns}
                    data={records}
                    className="relative md:overflow-x-hidden"
                    selectableRows
                    pagination
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default TransactionsTable;