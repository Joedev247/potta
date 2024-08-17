"use client";
import React, { FC, useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DataRow } from "./data";
import CustomLoader from "../Loader";
// import MoreIcon from "../more";


interface Props {
    data: DataRow[];
    records: DataRow[];
    setRecords: React.Dispatch<React.SetStateAction<DataRow[]>>;
}

const columns: TableColumn<DataRow>[] = [
    {
        name: <div className="w-full text-[17px]">First Name</div>,
        cell: (row: any) => <div className="font-medium text-[16px] text-gray-900 capitalize flex gap-1 items-center">

            {row.firstname}
        </div>,
    },
    {
        name: <div className="w-full text-[17px]">Last Name</div>,
        cell: (row: any) => (
            <div className="font-medium text-[16px] text-gray-900 capitalize">{row.lastname}</div>
        ),

        sortable: true,
    },
    {
        name: <div className="w-full text-[17px]">email</div>,
        cell: (row: any) => (
            <div className="font-medium text-[16px] text-gray-900 capitalize">{row.email}</div>
        ),
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px]">Roles</div>,
        cell: (row: any) => <div className="font-medium text-[16px] text-gray-900 capitalize">{row.roles}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-center text-[17px]">Status</div>,
        cell: (row: any) => (
            <div className="text-center w-full">
                <span
                    className={`${row.status === "active"
                        ? "bg-green-500"
                        : row.status === "paused"
                            ? "bg-red-500 text-white"
                            : ""
                        } px-3 py-0.5 rounded-full capitalize`}
                >
                    {row.status}
                </span>
            </div>
        ),
        sortable: true,
    },

    // {
    //     name: <div className="w-1/2"></div>,
    //     cell: (row: any) => (
    //         <div className="font-medium w-full justify-center flex text-gray-900 w-fu">
    //             <MoreIcon />
    //         </div>
    //     ),
    //     sortable: true,
    // },
];

const TeamTable: FC<Props> = ({ data, records, setRecords }) => {
    const [pending, setPending] = useState<boolean>(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRecords(data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    //  Internally, customStyles will deep merges your customStyles with the default styling.
    const customStyles = {
        headCells: {
            style: {
                paddingLeft: "8px", // override the cell padding for head cells
                paddingRight: "8px",
            },
        },
        headRow: {
            style: {
                backgroundColor: "#f3fbfb",
            },
        },
        rows: {
            style: {
                minHeight: "72px", // override the row height
            },
        },

        cells: {
            style: {
                paddingLeft: "8px", // override the cell padding for data cells
                paddingRight: "8px",
            },
        },
    };

    return (
        <div className="flex flex-col">
            <div
                //   style={{ padding: "50px, 10%", backgroundColor: "gray" }}
                className="border rounded-[2px]"
            >
                <DataTable
                    columns={columns}
                    data={records}
                    selectableRows
                    className="relative md:overflow-x-hidden"
                    pagination
                    customStyles={customStyles}
                    fixedHeader
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                />
            </div>
        </div>
    );
};

export default TeamTable;
