

'use client';


import React from 'react';
import 'chart.js/auto';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// remove all the legend

export const options = {
  responsive: true,
  fill: 0,

  plugins: {
    legend: {
      display: false,
      

      
    },
  },
  
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      min: 0,
    },
  }
};

const labels = Array.from(Array(19), () => '');

export const data = {
  labels,
  datasets: [
    {
      data: [8, 8, 7, 6, 7, 7, 8, 7, 8, 7, 10, 11, 8, 9, 8, 7, 8, 6, 7],
      fill: true,
    }
  ],
};


export default function HighCharts() {

  return (
    <div>
      <div>
      <Line options={options} data={data} />

      </div>
    </div>
  )
}
