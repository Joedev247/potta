"use client";
import React, { useRef, useState } from "react";

import Search from "../../inputs/search/normalSearch";
import TableTeam from "../../tables/teamTable/data";
import TeamUserModal from "../../modals/teamModal";



const Team: React.FC = () => {

    const [displays, setDisplays] = useState(false)

    return (
        <div className='w-full md:px-16   '>
            <div className='flex justify-between mt-10'>
                <div className='w-1/2'>
                    <Search onchange={() => { }} text={''} value={''} placeholder={'Search for team'} />
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