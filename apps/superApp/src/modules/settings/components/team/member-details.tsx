import { Button, Modal } from '@instanvi/ui-components'
import React, { FC } from 'react'
import { IMember } from '../../utils/team/types'
import MemberChip from './member-chip'

type Props = {
  isOpen: boolean
  onClose: () => void
  data: IMember
}

const MemberDetails: FC<Props> = ({ isOpen, onClose, data }) => {

  return (
    <Modal title='Team Details' width='xl' isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-2 ">
        <section className="grid grid-cols-2 gap-2">
          <div>
            <h6 className="">First Name</h6>
            <p>{data?.firstname}</p>
          </div>
          <div>
            <h6 className="">Last Name</h6>
            <p>{data?.lastname}</p>
          </div>
          <div>
            <h6 className="">Email</h6>
            <p>{data?.email}</p>
          </div>
          <div>
            <h6 className="">Status</h6>
            <MemberChip status={data?.status} />
          </div>
          <div>
            <h6 className="">Role</h6>
            <p>{data?.role}</p>
          </div>
        </section>
        <div className="flex justify-end">
          <div className="max-w-fit">
            <Button value="Close" type="button" onClick={onClose} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default MemberDetails