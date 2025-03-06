import Button from '@potta/components/button'
import react from 'react'

const PdfView = () => {
    return (
        <div className='h-[100vh] w-full bg-[#F2F2F2]'>
            <div className='p-8  w-full'>
                <h3 className='text-2xl font-semibold'>PDF Preview</h3>
                <div className='mt-5 h-36 w-full bg-green-800'>

                </div>
                <div className='p-5 bg-white'>
                    <p className='text-3xl mt-5 font-semibold '>Invoice</p>
                    <div className='mt-5 w-full flex space-x-5 '>
                        <div className='flex w-[40%] space-x-2'>
                            <h3>From : </h3>
                            <div className='space-y-2 text-sm text-gray-400 flex-col'>
                                <p>ABC Company</p>
                                <p>hello@ABCcompany.com</p>
                                <p>ABC, Street, D'la Cameroon</p>
                                <p>+237 695904751</p>
                            </div>
                        </div>
                        <div className='flex space-x-2'>
                            <h3>To : </h3>
                            <div className='space-y-2 text-sm text-gray-400 flex-col'>
                                <p>ABC Company</p>
                                <p>hello@ABCcompany.com</p>
                                <p>ABC, Street, D'la Cameroon</p>
                                <p>+237 695904751</p>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full table-auto mt-10 border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className=" px-4 py-2 text-left font-bold">ID</th>
                                <th className=" px-4 py-2 text-left font-bold">Item</th>
                                <th className=" px-4 py-2 text-left font-bold">Qty</th>
                                <th className=" px-4 py-2 text-left font-bold">UP</th>
                                <th className=" px-4 py-2 text-left font-bold">Tax</th>
                                <th className=" px-4 py-2 text-left font-bold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b px-4 py-2">1</td>
                                <td className="border-b px-4 py-2">Item Name</td>
                                <td className="border-b px-4 py-2">2</td>
                                <td className="border-b px-4 py-2">6,500</td>
                                <td className="border-b px-4 py-2">1,255</td>
                                <td className="border-b px-4 py-2">13,000</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Subtotal and Tax Rows */}
                    <div className='w-full mt-10 flex'>
                        <div className='w-[50%]'>

                        </div>
                        <div className='w-[50%]'>
                            <div className="mt-4 flex justify-between ">
                                <div className="w-1/2">Sub Total:</div>
                                <div className="w-1/2 text-right pr-20">13,000</div>
                            </div>

                            <div className="mt-2 flex justify-between ">
                                <div className="w-1/2">Tax(19.25%):</div>
                                <div className="w-1/2 text-right pr-20">2,570</div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-t-2 border-gray-300" />
                    <div className='w-full mt-10 flex'>
                        <div className='w-[50%]'>

                        </div>
                        <div className='w-[50%] '>
                            <div className="flex justify-between font-bold">
                                <div className="w-1/2">Total:</div>
                                <div className="w-1/2 text-right pr-20">15,580</div>
                            </div>
                        </div>
                    </div>



                </div>
                <div className='flex mt-10 justify-center'>
                    <Button text={'Download'} icon={<i className="ri-download-line"></i>} type={'submit'} />
                </div>
            </div>
        </div>
    )
}
export default PdfView
