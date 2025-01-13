import Input from '@/components/input'
import Select from '@/components/select'
import react from 'react'

const Address = () => {
    return (
        <div>
            <div className='w-full'>
                <Input type={'text'} label='Address' name={''} />
            </div>
            <div className='w-full mt-5 grid grid-cols-2 gap-2'>
                <div>
                    <Input type={'text'} label='City' name={''} />
                </div>
                <div>
                    <p>State</p>
                    <Select options={[{ label: "Littoral", value: "Littoral" }]} selectedValue={'Littoral'} onChange={() => { }} bg={''} />
                </div>
            </div>
            <div className='w-full mt-5 grid grid-cols-2 gap-2'>
                <div>
                    <Input type={'text'} label='Postal Code' name={''} />
                </div>
                <div>
                    <p>Country</p>
                    <Select options={[{ label: "Cameroon", value: "Cameroon" }]} selectedValue={'Cameroon'} onChange={() => { }} bg={''} />
                </div>
            </div>
        </div>

    )
}
export default Address