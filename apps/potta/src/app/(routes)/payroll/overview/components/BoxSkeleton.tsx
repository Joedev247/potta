import React from 'react';

const BoxSkeleton: React.FC = () => {
  return (
    <div className="border p-4 h-[166px] animate-pulse">
      <div className="flex w-full justify-between">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="mb-4 mt-10 text-left">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default BoxSkeleton;
