import react, { useState } from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@potta/components/resizable';
import RootLayout from "../../../layout";
const NewSalesReciept = () => {

  return (
<RootLayout>
<div className='p-4'>

  
      <ResizablePanelGroup direction="horizontal" >
        <ResizablePanel minSize={40} defaultSize={60}>
          <div className="p-10  h-[100vh]">
            {/* Left */}
            <Left />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel
          defaultSize={40}>
          <div className=" h-[100vh]">
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
