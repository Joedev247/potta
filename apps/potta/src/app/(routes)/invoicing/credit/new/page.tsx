import react, { useState } from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@potta/components/resizable';
import RootLayout from '../../../layout';
const NewSalesReciept = () => {
  return (
    <RootLayout>
      <div className="max-h-[98vh]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={40} defaultSize={60}>
            <div className="py-8  h-[98vh] flex justify-center">
              {/* Left */}
              <Left />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className=" h-[98vh]  bg-[#F2F2F2]">
              <PdfView />
              {/* Pdf View */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </RootLayout>
  );
};

export default NewSalesReciept;
