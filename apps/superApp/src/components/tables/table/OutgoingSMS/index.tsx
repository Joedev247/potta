"use client";
import React, { FC, useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DataRow } from "./data";


interface Props {
    data: DataRow[];
    records: DataRow[];
    setRecords: React.Dispatch<React.SetStateAction<DataRow[]>>;
}

const columns: TableColumn<DataRow>[] = [
    {
        name: <div className="w-full text-[17px] text-center">Item</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-center">{row.item}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-center">Cost</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-center">{row.cost}</div>,
        sortable: true,
    },
    {
      name: <div className="w-full text-[17px] text-center">Opertor</div>,
      cell: (row: any) => <div className="w-full text-[17px] text-center">{row.operator}</div>,
      sortable: true,
  },
    {
        name: <div className="w-full text-[17px] text-center">Price per</div>,
        cell: (row: any) => <div className="w-full text-[17px] text-center">{row.price}</div>,
        sortable: true,
    },
    {
        name: <div className="w-full text-[17px] text-center">Compliance Check</div>,
        cell: (row) => <div className="w-full text-center">
          <input type="checkbox" className="rounded-full text-green-500 focus:ring-0 focus:border-transparent"/>
        </div>,
        sortable: false,
    }
];

const OutgoingSMSTable: FC<Props> = ({ data, records, setRecords }) => {
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
                className="border rounded-[2px] m-7">
                <DataTable
                    columns={columns}
                    data={records}
                    className="relative md:overflow-x-hidden"
                    pagination
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default OutgoingSMSTable;