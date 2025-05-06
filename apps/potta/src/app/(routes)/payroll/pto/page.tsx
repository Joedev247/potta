'use client';
import React, { useState, useCallback } from 'react';
import RootLayout from '../../layout';
import Search from '@potta/components/search';
import SliderSchedule from './components/sliderSchedule';
import { useFetchPTOPolicies } from './hooks/useFetchPTOPolicies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PTODetailSlider from './components/PTODetailSlider';
import PottaLoader from '@potta/components/pottaloader';

// Create a client
const queryClient = new QueryClient();

// Helper function to get a friendly name for PTO types
const getPTOTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    VACATION: 'Paid Time Off',
    SICK: 'Sick Time Off',
    MATERNITY: 'Maternity Leave',
    PATERNITY: 'Paternity Leave',
    CUSTOM: 'Custom Leave',
  };

  return typeMap[type] || type;
};

// Format days to display (convert to hours for small values)
const formatDaysValue = (days: string): string => {
  const daysNum = parseFloat(days);
  if (daysNum < 5) {
    // Convert to hours (assuming 8-hour workday)
    return `${Math.round(daysNum * 8)}hrs`;
  } else if (daysNum >= 30) {
    // Convert to months for large values (assuming 30 days per month)
    const months = Math.floor(daysNum / 30);
    return `${months} Month${months > 1 ? 's' : ''}`;
  }
  // Return days for medium values
  return `${daysNum} days`;
};

const PtoContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPtoId, setSelectedPtoId] = useState<string | null>(null);
  const [isDetailSliderOpen, setIsDetailSliderOpen] = useState(false);

  const { data: ptoPolicies, isLoading, error } = useFetchPTOPolicies();

  // Handle PTO card click
  const handlePTOCardClick = useCallback((ptoId: string) => {
    console.log('Card clicked, setting PTO ID:', ptoId);
    setSelectedPtoId(ptoId);
    setIsDetailSliderOpen(true);
  }, []);

  // When slider closes, reset the selected PTO ID
  const handleSliderClose = useCallback((isOpen: boolean) => {
    console.log('Setting slider open state:', isOpen);
    setIsDetailSliderOpen(isOpen);
    if (!isOpen) {
      // Reset selected PTO ID when slider closes
      setTimeout(() => {
        setSelectedPtoId(null);
      }, 300); // Small delay to ensure slider animation completes
    }
  }, []);

  if (isLoading) {
    return (
      <div className="fixed z-[9999] backdrop-blur-sm top-0 left-0 h-screen w-screen grid place-content-center">
        <PottaLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading PTO policies. Please try again.
      </div>
    );
  }

  // Filter policies based on search query
  const filteredPolicies = ptoPolicies?.filter((pto) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const typeName = getPTOTypeName(pto.type).toLowerCase();

    return typeName.includes(query);
  });

  return (
    <div className="px-14 py-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        {/* Search input */}
        <div className="relative w-96">
          <Search
            placeholder="Search policy name"
            onchange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>

        <SliderSchedule />
      </div>

      {/* PTO cards grid with scrolling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2">
          {filteredPolicies && filteredPolicies.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {filteredPolicies.map((pto) => (
                <div
                  key={pto.uuid}
                  className="border h-[200px] border-gray-200 rounded-md p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePTOCardClick(pto.uuid)}
                >
                  <p className="text-gray-700 mb-4">
                    {getPTOTypeName(pto.type)}
                  </p>
                  <div className="h-full grid place-content-center">
                    <p className="text-2xl font-semibold w-fit mx-auto">
                      {formatDaysValue(pto.days_remaining)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No PTO policies found</p>
            </div>
          )}
        </div>
      </div>

      {/* PTO Detail Slider */}
      <PTODetailSlider
        ptoId={selectedPtoId}
        open={isDetailSliderOpen}
        setOpen={handleSliderClose}
      />
    </div>
  );
};

const Pto = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <PtoContent />
      </RootLayout>
    </QueryClientProvider>
  );
};

export default Pto;
