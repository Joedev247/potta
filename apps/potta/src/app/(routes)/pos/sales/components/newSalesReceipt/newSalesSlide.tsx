import react, { useState } from 'react'
import Left from './components/left'
import PdfView from './components/pdfview'
import Slider from '@potta/components/slideover';

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

        <div className='w-full   flex'>
            <div className='w-[50%] p-20'>
                {/* Left */}
                <Left />
            </div>
            <div className='w-[50%]'>
                <PdfView />
                {/* Pdf View */}
            </div>
        </div>
          </Slider>
    )
}

export default NewSalesReciept
