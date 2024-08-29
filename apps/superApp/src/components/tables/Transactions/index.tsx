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
        name: <div className="w-full text-left">DATE</div>,
        cell: (row: any) => <div className="w-full text-left ">{row.date}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-left">TRANSACTION</div>,
        cell: (row: any) => <div className="w-full text-left ">
            <h6 className="text-lg">{row.transaction}</h6>
            <small>FI37918778579</small>
        </div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-left">CHANEL</div>,
        cell: (row: any) => <div className="w-full text-left ">{row.chanel}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-left">ORDER NO.</div>,
        cell: (row: any) => <h6 className="w-full text-left">{row.order}</h6>,
        sortable: true,
    },
    {
        name: <div className="w-full text-left">CURRENCY</div>,
        cell: (row) => <div className="w-6ull text-left ">{row.currency}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-left">TOTAL</div>,
        cell: (row: any) => <div className="w-full text-[16px] text-left ">{row.total}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-center">STATUS</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-center">
            <div className="rounded-full bg-[#52C41A] hover:bg-[#046C4E]/90 font-medium py-1 px-3 mx-auto w-fit text-center">
                succesful</div>
        </div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-center">PDF</div>,
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
                backgroundColor: "#FAFAFB",
                fontWeight: "700",
                color: "#8492A6",
                fontSize: ".8rem",
            },
        },
        rows: {
            style: {
                color: "#425466",
                height: "70px",
                fontSize: ".8rem",
            },
        },
    };

    return (
        <div className="flex flex-col w-full">
            <div
                className="border ">
                <DataTable
                    columns={columns}
                    data={records}
                    className="relative overflow-x-scroll md:overflow-x-visible"
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