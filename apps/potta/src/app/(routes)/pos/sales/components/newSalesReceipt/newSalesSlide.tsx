import react, { useState } from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';
import Slider from '@potta/components/slideover';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@potta/components/resizable';

const NewSalesReciept = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  return (
    <Slider
      open={isSliderOpen}
      setOpen={setIsSliderOpen}
      edit={true}
      buttonText={'New Sales Receipt'}
      title={'Create Sales Receipt'}
    >
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
    </Slider>
  );
};

export default NewSalesReciept;
