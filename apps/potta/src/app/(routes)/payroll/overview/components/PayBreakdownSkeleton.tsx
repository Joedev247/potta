import React from 'react';

const PayBreakdownSkeleton: React.FC = () => {
  return (
    <div className="">
      <div className="w-full border-r border-l bg-[#F3FBFB] border-t font-bold px-4 py-2">
        <p>Pay Breakdown</p>
      </div>
      <div className="w-full text-center grid grid-cols-4 border max-h-[126px] min-h-[126px]">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="h-full w-full py-5 flex justify-center">
            <div className="pl-4 border-r pr-3 w-full animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayBreakdownSkeleton;
