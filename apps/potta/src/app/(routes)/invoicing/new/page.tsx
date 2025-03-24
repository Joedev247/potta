import react, { useState } from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@potta/components/resizable';
import RootLayout from '../../../layout';
const NewInvoice = () => {
  return (

      <div className="h-[91.5vh]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={50} defaultSize={60}>
            <div className="py-8 px-10  h-full overflow-y-auto flex justify-center">
              {/* Left */}
              <Left />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className=" h-full overflow-y-auto bg-[#F2F2F2]">
              <PdfView />
              {/* Pdf View */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

  );
};

export default NewInvoice;
