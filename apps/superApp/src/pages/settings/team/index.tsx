/* eslint-disable @nx/enforce-module-boundaries */
import React, { useState } from 'react'
import DataTable from 'react-data-table-component'

import { Button, Search } from '@instanvi/ui-components'
import CustomLoader from 'apps/superApp/src/components/tables/Loader'
import { IMember } from 'apps/superApp/src/modules/settings/utils/team/types'
import { memberColumns } from 'apps/superApp/src/modules/settings/utils/team/column'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'
import MemberForm from 'apps/superApp/src/modules/settings/components/team/memeber-form'
import { useGetMembers } from 'apps/superApp/src/modules/settings/hooks/team/useGetMembers'
import MemberDetails from 'apps/superApp/src/modules/settings/components/team/member-details'
import AppDelete from 'apps/superApp/src/components/app-delete'

const TeamPage: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IMember | undefined>(undefined);
  const { data: members, isPending } = useGetMembers()

  console.log(members)

  const onOpenForm = () => {
    setSelectedMember(undefined)
    setOpenForm(true)
  };

  const onEditMember = (member: IMember) => {
    setOpenForm(true)
    setSelectedMember(member)
  };

  const onOpenDetail = (data: IMember) => {
    setSelectedMember(data)
    setOpenDetail(true)
  };

  const onOpenDelete = (data: IMember) => {
    setSelectedMember(data)
    setOpenDelete(true)
  };

  const onCloseForm = () => {
    setOpenForm(false)
  };

  const onCloseDetail = () => {
    setOpenDetail(false)
    setSelectedMember(undefined)
  };

  const onCloseDelete = () => {
    setOpenDelete(false)
    setSelectedMember(undefined)
  };

  const columnProps = { onEdit: onEditMember, onDetail: onOpenDetail, onDelete: onOpenDelete }

  const data: IMember[] = [
    {
      id: 1,
      firstname: "Jean Paul",
      lastname: "Lamark",
      email: "jean.lamark@gmail.com",
      status: "active",
      role: "member"
    },
  ];

  // useEffect(() => {

  // }, []);

  const customStyles = {
    headCells: {
      style: {
        // paddingLeft: "4px", // override the cell padding for head cells
        // paddingRight: "4px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#fff",
        fontWeight: "700",
      },
    },
    rows: {
      style: {
        minHeight: "50px", // override the row height
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
    <>
      <MemberDetails
        onClose={onCloseDetail}
        isOpen={openDetail}
        data={selectedMember as IMember}
      />
      <AppDelete
        title="team"
        onClose={onCloseDelete}
        isOpen={openDelete}
        deleteAction={() => { console.log("delete") }}
      />

      <MemberForm
        isOpen={openForm}
        onOpen={onOpenForm}
        onClose={onCloseForm}
        data={selectedMember}
      />

      <SettingsLayout>
        <div className='w-full md:px-16 2xl:w-[85%] 2xl:mx-auto'>
          <div className='flex justify-between mt-10'>
            <div className='w-1/3'>
              <Search placeholder='Search for team' />
            </div>
            <Button value={'New ID'} onClick={onOpenForm} icon={'add'} />
          </div>
          <div className='w-full mt-5'>
            <div className="flex flex-col">
              <div className="border rounded-[2px]">
                <DataTable
                  pagination
                  fixedHeader
                  data={data}
                  selectableRows
                  progressPending={isPending}
                  customStyles={customStyles}
                  columns={memberColumns(columnProps)}
                  progressComponent={<CustomLoader />}
                  className="relative md:overflow-x-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsLayout>
    </>
  )
}
export default TeamPage
