// components/DonutChart.tsx

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import React from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DonutChart: React.FC = () => {
    const options: ApexOptions = {
        series: [44, 55, 41, 17, 15],
        chart: {
            width: 380,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
        },
        legend: {
            formatter: function (val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
            }
        },
        title: {
            text: 'Gradient Donut with custom Start-angle',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        }],
    };

    return (
        <div id="chart">
            <ApexChart options={options} series={options.series} type="donut" width={380} />
        </div>
    );
};

export default DonutChart;
