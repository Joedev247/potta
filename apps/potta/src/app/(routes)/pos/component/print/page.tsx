"use client"
import React, { Fragment, useState, useContext, useEffect, useRef, FC } from "react";
import { ContextData } from "@/components/context";
import Barcode from 'react-barcode';
import moment from 'moment';
// import '../../../../../../public/font.css';

const Print: FC = () => {
    const Context = useContext(ContextData);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const handlePrint = (): void => {
        const printContent: string = document.getElementById('printable-div')!.innerHTML;
        const iframe: HTMLIFrameElement | null = iframeRef.current;

        if (iframe) {
            const doc: Document = iframe.contentWindow!.document;
            doc.open();
            doc.write('<html><head><title>Print</title>');
            doc.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />');
            doc.write('</head><body>');
            doc.write(printContent);
            doc.write('</body></html>');
            doc.close();
            const logoUrl: string = `${window.location.origin}/icons/logo.svg`;
            const img: HTMLImageElement = new Image();
            img.src = logoUrl;

            img.onload = () => {
                iframe.contentWindow!.focus();
                iframe.contentWindow!.print();
            };

        }
    };

    const randomnumber: number = Math.floor(Math.random() * (200000000 - 100000000 + 1)) + 100000000;
    return (
        <div className="flex border-l -mt-4 justify-center">
            <div className=" w-96   h-[92.3vh] ">
                <div className="pt-10 -mt-5 w-full h-[76vh] overflow-y-auto">
                    <div id="printable-div" className="w-full">
                        <div className='flex  prints w-full  print justify-center'>
                            <div className='w-full '>
                                <center><img src="/icons/logo.svg" className='h-16 text-center w-auto' alt="" /></center>
                                <p className=' prints text-center text-xl font-medium'>Food Rep </p>
                                <p className=' prints font-thin text-center'>Douala - Cameroon</p>
                                <p className=' prints font-thin text-center'>Monday&nbsp;-&nbsp;Sunday</p>
                                <p className=' prints font-thin text-center'>From  08H00 - 22H00</p>
                                <p className=' prints font-thin text-center text-xl'>----------------</p>
                                <div className='w-full justify-center mt-5'>
                                    <div className='w-full flex justify-between'>
                                        <table className='w-full'>
                                            <tr className='w-full'  >
                                                <td className='w-full' style={{ flex: '1' }}>
                                                    <p className='font-thin prints'>Bill Number</p>
                                                </td>
                                                <td className='w-full flex justify-end '>
                                                    <p className='font-thin prints'>{randomnumber}</p>
                                                </td>
                                            </tr>
                                            {Context?.data !== undefined && Context?.data.map((items: { quantity: number; name: string; price: number }, id: number) => {
                                                return (
                                                    <tr key={id} className='w-full my-1 '>
                                                        <td className='w-full my-1 prints'><p className='font-thin prints'>{items.quantity} x {items.name}</p> </td>
                                                        <td className='w-full my-1 flex justify-right prints '><p className='font-thin prints'>{items.price * items.quantity}</p></td>
                                                    </tr>
                                                )
                                            })}
                                            <tr className='w-full'>
                                                <td className='w-full my-5 '><p className='font-thin prints'>Qty</p></td>
                                                <td className='w-full my-5 flex justify-right '><p className='font-thin prints'>{Context?.data !== undefined && Context?.data.length}</p></td>
                                            </tr>
                                            <tr className='w-full '>
                                                <td className='w-full mt-5 prints'><p className='font-thin prints'>Total Price : </p></td>
                                                <td className='w-full mt-1 flex justify-right '><p className='font-thin prints'>2000 XAf</p></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <p className="font-thin text-center  my-2 prints"> {moment().format('MM Do YYYY, h:mm:ss a')}</p>
                                <p className='font-thin text-center  my-2 prints' >Thank you for your fidelity</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-center   relative">
                            <Barcode value={randomnumber.toString()} fontSize={16} height={32} lineColor="gray" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center mx-5 w-full space-x-4">
                    <div className="flex space-x-3">
                        <button className="bg-green-500 w-64 py-2 text-white" onClick={handlePrint} >Print</button>
                        <button className="bg-red-500 w-64 py-2 text-white" onClick={() => Context?.setToggle(true)}>Return</button>
                    </div>
                </div>
                <iframe
                    ref={iframeRef}
                    style={{ display: 'none' }}
                    title="Print Frame"
                />
            </div>
        </div>
    );
};
export default Print;