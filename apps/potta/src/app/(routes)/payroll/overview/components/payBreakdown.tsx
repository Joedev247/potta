import react from 'react'

const PayBreakDown = () => {
    return (
        <div>
            <div className='w-full border-r border-l bg-[#F3FBFB] border-t px-4 py-2'>
                <p>Pay Breakdown</p>
            </div>
            <div className='w-full grid grid-cols-4 border'>
                <div className='h-full w-full py-5 flex justify-center '>
                    <div className='border-r pr-5'>
                        <p>Total Off hours</p>
                        <h3 className='mt-1 text-green-700 text-xl'>XAF 8.69M</h3>
                        <p className='mt-2 text-sm'>2 people</p>
                    </div>
                </div>
                <div className='h-full w-full py-5 flex justify-center '>
                    <div className='border-r pr-5'>
                        <p>Total hours worked</p>
                        <h3 className='mt-1 text-green-700 text-xl'>XAF 8.69M</h3>
                        <p className='mt-2 text-sm'>2 people</p>
                    </div>
                </div>
                <div className='h-full w-full py-5 flex justify-center '>
                    <div className='border-r pr-5'>
                        <p>Total Overtime</p>
                        <h3 className='mt-1 text-green-700 text-xl'>XAF 8.69M</h3>
                        <p className='mt-2 text-sm'>2 people</p>
                    </div>
                </div>
                <div className='h-full w-full py-5 flex justify-center '>
                    <div className='  pr-5'>
                        <p>Total Commision</p>
                        <h3 className='mt-1 text-green-700 text-xl'>XAF 8.69M</h3>
                        <p className='mt-2 text-sm'>2 people</p>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default PayBreakDown