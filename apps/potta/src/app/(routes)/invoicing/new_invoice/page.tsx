import react from 'react'
import Left from './components/left'
import PdfView from './components/pdfview'

const NewInvoice = () => {

    return (
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
    )
}

export default NewInvoice