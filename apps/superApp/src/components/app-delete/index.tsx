import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { Button, Modal } from '@instanvi/ui-components'
import React, { FC } from 'react'

type Props = {
  title: string
  isOpen: boolean
  loading: boolean
  onClose: () => void
  deleteAction?: () => void
}

const AppDelete: FC<Props> = ({ isOpen, onClose, title, loading, deleteAction }) => {

  return (
    <Modal title={`delete ${title}`} width='sm' isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-4">
        <span className='p-3 text-center bg-red-100 flex items-center gap-2'>
          <InformationCircleIcon color='red' width={20} height={20} />
          <h6 className="">Are you sure you want to delete this {title}</h6>
        </span>
        <div className="flex justify-end gap-2">
          <Button
            color='gray'
            value="Close"
            type="button"
            onClick={onClose}
          />
          <Button
            color='red'
            type="button"
            onClick={deleteAction}
            value={loading ? "Deleting..." : "Yes, Delete"}
          />
        </div>
      </div>
    </Modal>
  )
}

export default AppDelete