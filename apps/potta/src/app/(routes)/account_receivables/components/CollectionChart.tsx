'use client';
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CollectionChartProps {
  data: any[];
  formatCurrency: (amount: number) => string;
}

const CollectionChart: React.FC<CollectionChartProps> = ({
  data,
  formatCurrency,
}) => {
  const chartData = useMemo(() => {
    // Group data by month
    const monthlyData: Record<string, number> = {};

    data.forEach((bill: any) => {
      if (bill.issuedDate) {
        const date = new Date(bill.issuedDate);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        if (!monthlyData[monthName]) {
          monthlyData[monthName] = 0;
        }
        monthlyData[monthName] += parseFloat(bill.invoiceTotal) || 0;
      }
    });

    const months = Object.keys(monthlyData).sort();
    const amounts = months.map((month) => monthlyData[month]);

    return {
      labels: months,
      datasets: [
        {
          label: 'Collection Amount',
          data: amounts,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Collection Trends',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Collection: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 border border-gray-200 shadow-sm">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CollectionChart;
