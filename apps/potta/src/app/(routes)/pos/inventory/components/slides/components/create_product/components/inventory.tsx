import Input from '@potta/components/input'
import Select from '@potta/components/select'
import React from 'react'

const Inventory = () => {
    return (
        <div className='flex mt-4 space-x-3 w-full'>
            <div className="mt-2">
                <p className="mb-2">Unit&nbsp;of&nbsp;Measurement</p>
                <Select options={[{ label: "Purchases ", value: "Purchases" }]} selectedValue={"Purchases"} onChange={() => { }} bg={""} />
            </div>
            <div className="mt-2">
                <Input type={'number'} value={15} label='Re-Order Point' name={''} />
            </div>
            <div className="mt-2">
                <Input type={'number'} value={15} label='Inventory on hand' name={''} />
            </div>
            <div className="mt-2">
                <Input type={'date'} value={15} label='As Of' name={''} />
            </div>
        </div>
    )
}

export default Inventory
