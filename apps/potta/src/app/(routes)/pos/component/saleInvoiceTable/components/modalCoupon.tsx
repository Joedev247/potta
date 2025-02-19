import Button from '@potta/components/button'
import Input from '@potta/components/input'
import Modal from '@potta/components/modal'
import react, { useState } from 'react'

const ModalCoupon = () => {
    const [open, setOpen] = useState(false)
    return (
        <Modal width='w-[600px]' open={open} setOpen={() => { setOpen(!open) }} title='Add Coupon' text='Add Coupon' coupon={true}>
            <div className='h-[35vh] -mt-5 px-2 w-full flex   items-center'>
                <div className='w-full'>
                    <Input type={'text'} name={''} placeholder='023457554' label='Enter Coupon Code' />
                </div>
            </div>
            <div className='border-t px-2 py-2.5 w-full flex justify-end'>
                <Button height={true} text={'Apply'} type={'button'} theme='' icon={<i className='ri-arrow-right-line text-xl'></i>} />
            </div>
        </Modal>
    )
}
export default ModalCoupon
