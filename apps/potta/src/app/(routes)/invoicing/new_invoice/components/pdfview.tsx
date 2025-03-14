import Button from '@potta/components/button';
import react from 'react';

const PdfView = () => {
  return (
    <div className=" w-full bg-[#F2F2F2]">
      <div className="w-full p-8">
        <h3 className="text-2xl font-semibold">PDF Preview</h3>
        <div className="w-full mt-5 bg-green-800 h-36"></div>
        <div className="p-5 bg-white">
          <p className="mt-5 text-3xl font-semibold ">Invoice</p>
          <div className="flex w-full mt-5 space-x-5 ">
            <div className="flex w-[40%] space-x-2">
              <h3>From : </h3>
              <div className="flex-col space-y-2 text-sm text-gray-400">
                <p>ABC Company</p>
                <p>hello@ABCcompany.com</p>
                <p>ABC, Street, D'la Cameroon</p>
                <p>+237 695904751</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <h3>To : </h3>
              <div className="flex-col space-y-2 text-sm text-gray-400">
                <p>ABC Company</p>
                <p>hello@ABCcompany.com</p>
                <p>ABC, Street, D'la Cameroon</p>
                <p>+237 695904751</p>
              </div>
            </div>
          </div>
          <table className="min-w-full mt-10 border border-collapse border-gray-300 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 font-bold text-left ">ID</th>
                <th className="px-4 py-2 font-bold text-left ">Item</th>
                <th className="px-4 py-2 font-bold text-left ">Qty</th>
                <th className="px-4 py-2 font-bold text-left ">UP</th>
                <th className="px-4 py-2 font-bold text-left ">Tax</th>
                <th className="px-4 py-2 font-bold text-left ">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">1</td>
                <td className="px-4 py-2 border-b">Item Name</td>
                <td className="px-4 py-2 border-b">2</td>
                <td className="px-4 py-2 border-b">6,500</td>
                <td className="px-4 py-2 border-b">1,255</td>
                <td className="px-4 py-2 border-b">13,000</td>
              </tr>
            </tbody>
          </table>

          {/* Subtotal and Tax Rows */}
          <div className="flex w-full mt-10">
            <div className="w-[50%]"></div>
            <div className="w-[50%]">
              <div className="flex justify-between mt-4 ">
                <div className="w-1/2">Sub Total:</div>
                <div className="w-1/2 pr-20 text-right">13,000</div>
              </div>

              <div className="flex justify-between mt-2 ">
                <div className="w-1/2">Tax(19.25%):</div>
                <div className="w-1/2 pr-20 text-right">2,570</div>
              </div>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="my-4 border-t-2 border-gray-300" />
          <div className="flex w-full mt-10">
            <div className="w-[50%]"></div>
            <div className="w-[50%] ">
              <div className="flex justify-between font-bold">
                <div className="w-1/2">Total:</div>
                <div className="w-1/2 pr-20 text-right">15,580</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button
            text={'Download'}
            icon={<i className="ri-download-line"></i>}
            type={'submit'}
          />
        </div>
      </div>
    </div>
  );
};
export default PdfView;
