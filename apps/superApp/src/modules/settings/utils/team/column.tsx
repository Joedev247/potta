import { TableColumn } from "react-data-table-component";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

import { IMember } from "./types";

export const memberColumns = ({
  onDelete,
  onDetail,
  onEdit,
}
  : {
    onEdit: (data: IMember) => void,
    onDelete: (data: IMember) => void,
    onDetail: (data: IMember) => void,
  }
): TableColumn<IMember>[] => [
    {
      name: <div className="w-full text-[17px]">First Name</div>,
      cell: (row) => <div className="font-medium text-[16px] text-gray-900 capitalize flex gap-1 items-center">

        {row.firstname}
      </div>,
    },
    {
      name: <div className="w-full text-[17px]">Last Name</div>,
      cell: (row) => (
        <div className="font-medium text-[16px] text-gray-900 capitalize">{row.lastname}</div>
      ),

      sortable: true,
    },
    {
      name: <div className="w-full text-[17px]">Email</div>,
      cell: (row) => (
        <div className="font-medium text-[16px] text-gray-900 capitalize">{row.email}</div>
      ),
      sortable: true,
    },
    {
      name: <div className="w-full text-[17px]">Roles</div>,
      cell: (row) => <div className="font-medium text-[16px] text-gray-900 capitalize pl-3">{row.role}</div>,
      sortable: true,
    },
    {
      name: <div className="w-full text-center text-[17px]">Status</div>,
      cell: (row) => (
        <div className="text-center w-full">
          <span
            className={`${row.status === "active"
              ? "bg-[#52C41A] text-black"
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
    {
      name: <div className="w-1/2"></div>,
      cell: (row) => (
        <div className="font-medium w-full justify-center items-center flex w-fu">
          <Popover placement="bottom-end" showArrow={true}>
            <PopoverTrigger>
              <Button className="flex w-8 h-8 p-2 rounded-full items-center justify-center hover:bg-gray-200">
                <i className="ri-more-2-line text-2xl font-bold cursor-pointer"></i>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-1 bg-white shadow-md flex flex-col gap-2">
                <div className="text-sm cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]" onClick={() => onDetail(row)}>
                  <p>View</p>
                </div>
                <div className="text-sm cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]" onClick={() => onEdit(row)}>
                  <p>Edit</p>
                </div>
                <div className="text-sm cursor-pointer hover:bg-red-200 py-0.5 px-2 rounded-[2px] text-red-600" onClick={() => onDelete(row)}>
                  <p>Delete</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      sortable: false,
    },
  ];