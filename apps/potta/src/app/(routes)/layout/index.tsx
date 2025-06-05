'use client';
import { Inter } from 'next/font/google';
import Navbar from './navbar';
import Sidebars from './sidebar';
import { useContext, useState } from 'react';

import ChatAI from '../../../app/chatai';
import { ContextData } from '../../../components/context';
import { Toaster } from 'sonner';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [show, setShow] = useState(false);

  const toggleChatAI = () => {
    setShow(!show);
  };
  const context = useContext(ContextData);
  return (
    <div className="relative flex  w-full h-screen">
      {/* <div
        className={`transition-all flex  duration-500  ease-in-out ${
          show ? 'w-[75%]' : 'w-[97.5%]'
        }`}
      > */}
      <div className={`transition-all flex  duration-500  ease-in-out w-full`}>
        <div className="w-full overflow-x-hidden overflow-y-auto scroll z-10 flex">
          <div className="fixed z-50">
            <Sidebars />
          </div>
          <div
            className={`flex  duration-500  ease-in-out ${
              context?.toggle ? 'flex w-full  pl-[35px]' : 'pl-[150px] w-full '
            }`}
          >
            <div className=" w-full relative  mx-0">
              <Navbar />
              <Toaster position="top-center" />
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* <div className={`chat-ai    border-l ${show ? 'show-chat' : ''}`}>
        <ChatAI />
      </div> */}
      {/* <div className={` w-[2.5%] z-40 fixed right-0`}>
        <div className={`  bg-white  h-screen border-l flex justify-center`}>
          <div>
            <div className="">
              <div className="mt-12">
                <div className=" cursor-pointer flex justify-center w-10 items-center hover:bg-gray-200 h-10">
                  <img
                    src={'/icons/instanvi.svg'}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div className=" cursor-pointer flex justify-center w-10 items-center hover:bg-gray-200 h-10">
                  <img
                    src={'/icons/talk.svg'}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div className=" cursor-pointer flex justify-center w-10 items-center hover:bg-gray-200 h-10">
                  <img
                    src={'/icons/Tribu.svg'}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div className=" cursor-pointer flex justify-center w-10 items-center hover:bg-gray-200 h-10">
                  <img
                    src={'/icons/Potta.svg'}
                    alt="logo"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            </div>
            <div className="mt-[30vh] ml-1.5">
              <button
                onClick={toggleChatAI}
                className="bg-green-300 text-white h-7 w-7 flex justify-center items-center"
              >
                <i className="ri-add-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
