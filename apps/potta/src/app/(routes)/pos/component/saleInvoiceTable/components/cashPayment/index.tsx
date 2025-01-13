import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import React from 'react'

const CashPayment = () => {
    return (
        <div className='p-10'>
            <h3>Other Payment Methods</h3>
            <div className=' mt-10   w-full overflow-auto'>
                <Accordion>
                    <AccordionItem  >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className='flex ml-10 -mt-5 space-x-2'>
                                    <img src="/icons/mtn.svg" alt="" />
                                    <p>MTN Mobile Money</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p>Dial *126# to buy your items</p>
                            <input type="text" className='border mt-1.5 outline-none pl-2 py-1 w-96' />
                            <div className='w-96 mt-2 flex justify-end'>
                                <button className='border px-2 -py-1 bg-green-500 text-white '>Save</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem  >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className='flex ml-10 -mt-5 space-x-2'>
                                    <img src="/icons/om.svg" alt="" />
                                    <p>Orange Money</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p>Dial #150*62# to buy your items</p>
                            <input type="text" className='border mt-1.5 outline-none pl-2 py-1 w-96' />
                            <div className='w-96 mt-2 flex justify-end'>
                                <button className='border px-2 -py-1 bg-green-500 text-white '>Save</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem  >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className='flex ml-10 -mt-5 space-x-3'>
                                    <div className='flex space-x-1'>
                                        <img src="/icons/bitcoin.svg" alt="" />
                                        <img src="/icons/tether.svg" alt="" />
                                        <img src="/icons/crypto.svg" alt="" />
                                    </div>
                                    <p>Crypto</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p>Dial *126# to buy your items</p>
                            <input type="text" className='border mt-1.5 outline-none pl-2 py-1 w-96' />
                            <div className='w-96 mt-2 flex justify-end'>
                                <button className='border px-2 -py-1 bg-green-500 text-white '>Save</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem  >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className='flex ml-10 -mt-5 space-x-3'>
                                    <div className='flex space-x-1'>
                                        <img src="/icons/visas.svg" height={50} width={50} alt="" />
                                        <img src="/icons/master.svg" alt="" />
                                    </div>
                                    <p>Visa / Master</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p>Dial *126# to buy your items</p>
                            <input type="text" className='border mt-1.5 outline-none pl-2 py-1 w-96' />
                            <div className='w-96 mt-2 flex justify-end'>
                                <button className='border px-2 -py-1 bg-green-500 text-white '>Save</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem  >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className='flex ml-10 -mt-5 space-x-2'>
                                    <img src="/icons/giftcard.svg" height={30} width={30} alt="" />
                                    <p className='mt-0.5'>Gift Card</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p>Enter your gift card promo code </p>
                            <input type="text" className='border mt-1.5 outline-none pl-2 py-1 w-96' />
                            <div className='w-96 mt-2 flex justify-end'>
                                <button className='border px-2 -py-1 bg-green-500 text-white '>Save</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
export default CashPayment