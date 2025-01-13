import react from 'react'
import RootLayout from '../layout'

const Payroll = () => {
    return (
        <RootLayout>
            <div className='w-full h-[80%] flex justify-center items-center'>
                <div >
                    <div className='flex justify-center'>
                        <img src="/icons/team-work.svg" alt="" />
                    </div>
                    <p className='-mt-20 text-center text-2xl'>Better Pay, Happier Employees</p>

                    <div className='mt-5 flex justify-center'>
                        <div className='flex space-x-2'>
                            <div className='w-48 p-4 '>
                                <div className='w-full h-24 cursor-pointer flex justify-center items-center bg-[#F9F9F9]'>
                                    <img src="/icons/people.svg" className='h-12 w-auto' alt="" />
                                </div>
                                <p className='text-center'>Add People</p>
                            </div>
                            <div className='w-48 p-4 '>
                                <div className='w-full h-24 cursor-pointer flex justify-center items-center bg-[#F9F9F9]'>
                                    <img src="/icons/heart.svg" className='h-12 w-auto' alt="" />
                                </div>
                                <p className='text-center'>Setup Benefits</p>
                            </div>
                            <div className='w-48 p-4 '>
                                <div className='w-full h-24 cursor-pointer flex justify-center items-center bg-[#F9F9F9]'>
                                    <img src="/icons/taxesh.svg" className='h-12 w-auto' alt="" />
                                </div>
                                <p className='text-center'>Setup Taxation and Compliance</p>
                            </div>
                            <div className='w-48 p-4 '>
                                <div className='w-full h-24 cursor-pointer flex justify-center items-center bg-[#F9F9F9]'>
                                    <img src="/icons/pig.svg" className='h-12 w-auto' alt="" />
                                </div>
                                <p className='text-center'>Setup Retirement Compliance</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </RootLayout>
    )
}
export default Payroll