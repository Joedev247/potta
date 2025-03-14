import react from 'react';
import Left from './components/left';
import PdfView from './components/pdfview';

const NewInvoice = () => {
  return (
    <div className="relative flex w-full bg-[#F2F2F2]">
      <div className="w-[50%] bg-white p-20 sticky top-3">
        {/* Left */}
        <Left />
      </div>
      <div className="w-[50%] sticky top-3">
        <PdfView />
        {/* Pdf View */}
      </div>
    </div>
  );
};

export default NewInvoice;
