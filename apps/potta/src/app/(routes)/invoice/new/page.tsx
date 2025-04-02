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

      <div className="max-h-[92.7vh]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={50} defaultSize={60}>
            <div className="py-8 px-14 h-[92.7vh]  overflow-y-auto flex justify-center">
              {/* Left */}
              <Left />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="h-[92.7vh] overflow-y-auto bg-[#F2F2F2]">
              <PdfView />
              {/* Pdf View */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

  );
};

export default NewInvoice;
