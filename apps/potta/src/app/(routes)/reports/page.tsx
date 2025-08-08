'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';

import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import { reportCategories, reportData } from './utils/dummyData';
import { ReportCategoryId, ReportCategory, Report } from './utils/types';
import { ContextData } from '@potta/components/context';
import { reportCharts } from './components/DashboardSampleCards';
import ReportChartCard from './components/ReportChartCard';
import RootLayout from '../layout';
import ApiDebugTest from './analytics/ApiDebugTest';
import AnalyticsChartCard from './analytics/AnalyticsChartCard';

const ReportsPage: React.FC = () => {
  const context = useContext(ContextData);
  const [activeTab, setActiveTab] = useState<ReportCategory['id']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isGlobalSearch, setIsGlobalSearch] = useState(true); // Default to global search
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [initialOpenSubmenu, setInitialOpenSubmenu] = useState<
    string | undefined
  >(undefined);

  // Get all reports
  const getAllReports = (): Report[] => {
    return Object.values(reportData).flat();
  };

  // Get reports for the active tab
  const getActiveReports = (): Report[] => {
    if (activeTab === 'all') {
      return getAllReports();
    }
    return [];
  };

  // Filter reports based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReports(getActiveReports());
      return;
    }

    const query = searchQuery.toLowerCase();

    // If global search is enabled, search across all reports
    const reportsToSearch = isGlobalSearch
      ? getAllReports()
      : getActiveReports();

    const filtered = reportsToSearch.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
    );

    setFilteredReports(filtered);
  }, [searchQuery, activeTab, isGlobalSearch]);

  // When tab changes and no search is active, reset filtered reports
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReports(getActiveReports());
    }
  }, [activeTab]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Get the active tab category info
  const activeTabInfo = reportCategories.find((cat) => cat.id === activeTab);

  const handleSubmenuClick = (submenuId: string) => {
    const el = cardRefs.current[submenuId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <RootLayout>
      <div className="pl-8 flex h-[92vh]">
        {/* Vertical Sidebar */}
        <Sidebar
          reportCategories={reportCategories}
          activeTab={activeTab}
          setActiveTab={(id) => setActiveTab(id as any)}
          onSubmenuClick={handleSubmenuClick}
          initialOpenSubmenu={initialOpenSubmenu}
        />

        {/* Main Content - Only this section scrolls */}
        <main className="flex-1 px-4 py-4 overflow-y-auto h-full">
          {/* Search bar and heading */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 mb-4 ">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleClearSearch={handleClearSearch}
            />
          </div>

          {/* Tab title heading */}
          <div className="mb-3 mt-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-medium text-gray-800">
                {activeTabInfo?.label || 'Reports'}
              </h1>
            </div>
          </div>

          {/* Reports grid with more dummy chart cards */}
          {activeTab === 'api_debug' ? (
            <ApiDebugTest />
          ) : [
              'revenue_analytics',
              'expense_analytics',
              'financial_analytics',
            ].includes(activeTab) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {activeTabInfo?.submenus?.map((submenu) => {
                const analyticsSubmenu = submenu as any;
                return (
                  <div
                    key={submenu.id}
                    id={`card-${submenu.id}`}
                    ref={(el) => {
                      cardRefs.current[submenu.id] = el;
                    }}
                  >
                    <AnalyticsChartCard
                      title={submenu.label}
                      description={`${submenu.label} analytics data`}
                      factName={analyticsSubmenu.factName || 'revenue'}
                      metrics={analyticsSubmenu.metrics || ['total_revenue']}
                      dimensions={analyticsSubmenu.dimensions || ['time']}
                      chartType="bar"
                    />
                  </div>
                );
              })}
            </div>
          ) : activeTab === 'all' ? (
            <div className="flex flex-col gap-8">
              {reportCategories
                .filter((cat) => cat.id !== 'all')
                .map((cat) => {
                  const firstTwo = cat.submenus?.slice(0, 2) || [];
                  return (
                    <div
                      key={cat.id}
                      className="pb-6 mb-6 border-b border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-black">
                          {cat.label}
                        </h2>
                        <button
                          className="text-green-700 font-semibold underline hover:underline text-sm px-3 py-1"
                          onClick={() => {
                            setActiveTab(cat.id as ReportCategoryId);
                            setInitialOpenSubmenu(cat.id);
                            setTimeout(
                              () => setInitialOpenSubmenu(undefined),
                              100
                            ); // reset after open
                          }}
                        >
                          View All
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {firstTwo.map((submenu) => {
                          const chartConfig = reportCharts[
                            submenu.chartKey as keyof typeof reportCharts
                          ] as any;
                          return (
                            <div key={submenu.id}>
                              {chartConfig ? (
                                <ReportChartCard
                                  title={chartConfig.title}
                                  description={chartConfig.description}
                                  chartType={chartConfig.chartType}
                                  data={chartConfig.data}
                                  options={chartConfig.options}
                                  summary={chartConfig.summary}
                                />
                              ) : (
                                <div className="border border-dashed border-green-300 p-8 text-center text-gray-400">
                                  {submenu.label} (No chart config)
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {activeTabInfo?.submenus?.map((submenu) => {
                const chartConfig = (reportCharts as any)[submenu.chartKey];
                return (
                  <div
                    key={submenu.id}
                    id={`card-${submenu.id}`}
                    ref={(el) => {
                      cardRefs.current[submenu.id] = el;
                    }}
                  >
                    {chartConfig ? (
                      <ReportChartCard
                        title={chartConfig.title}
                        description={chartConfig.description}
                        chartType={chartConfig.chartType}
                        data={chartConfig.data}
                        options={chartConfig.options}
                        summary={chartConfig.summary}
                      />
                    ) : (
                      <div className="border border-dashed border-green-300 p-8 text-center text-gray-400">
                        {submenu.label} (No chart config)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </RootLayout>
  );
};

export default ReportsPage;
