"use client";
import { Search } from "@instanvi/ui-components";
import TeamUserModal from "apps/superApp/src/components/modals/teamModal";
import TableTeam from "apps/superApp/src/components/tables/teamTable/data";
import React, { useRef, useState } from "react";


const Team: React.FC = () => {

    const [displays, setDisplays] = useState(false)

    return (
        <div className='w-full md:px-16   '>
            <div className='flex justify-between mt-10'>
                <div className='w-1/2'>
                    <Search placeholder={'Search for team'} />
                </div>

                <TeamUserModal />
            </div>
            <div className='w-full mt-5'>
                <TableTeam />
            </div>
        </div>
    );
};
export default Team;