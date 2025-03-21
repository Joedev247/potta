import react, { useState } from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@potta/components/resizable';

const NewSalesReciept = () => {

  return (

      <ResizablePanelGroup direction="horizontal" >
        <ResizablePanel minSize={50} defaultSize={60}>
          <div className="p-10 overflow-y-scroll h-[90vh]">
            {/* Left */}
            <Left />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={40}>
          <div className="overflow-y-scroll h-[90vh]">
            <PdfView />
            {/* Pdf View */}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      

  );
};

export default NewSalesReciept;
