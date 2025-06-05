import { FC, useState } from 'react'
import Image from 'next/image';
import { CSVLink } from "react-csv";
import { Search } from '@instanvi/ui-components'
import LogsTable from 'apps/superApp/src/components/tables/Logs';

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

const Log: FC = () => {
  const [records, setRecords] = useState<DataRow[]>([]);

  return (
    <div className='w-full md:px-16   '>
      <div className='flex  justify-between mt-10'>
        <div className='w-1/2 xl:w-1/3'>
          <Search placeholder="" />
        </div>
        <CSVLink data={data}>
          <div className="flex gap-2 btn items-center text-white bg-[#237804] hover:bg-[#3a9918] px-6 py-2 rounded-[2px] h-full">
            <img width={24} height={24} src="/icons/db-icon.svg" alt="" />
            Export CSV
          </div>
        </CSVLink>
      </div>
      <div className='w-full mt-5'>
        <LogsTable data={data} records={records} setRecords={setRecords} />
      </div>
    </div>

  )
}
export default Log