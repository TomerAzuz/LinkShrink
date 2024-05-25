import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';

const ChartComponent = ({ data, metric }) => {

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66',
    '#FF66B2', '#66B2FF', '#FFDB66', '#66FFCC', '#B266FF', '#FF6666', '#66FF99',
    '#6699FF'
  ];

  let chartData;

  switch (metric) {
    case 'country':
    case 'deviceType':
    case 'browser': {
      const counts = data.reduce((acc, cur) => {
        const key = cur[metric];
        if (key) {
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});
    
      const labels = Object.keys(counts);
      const accessCounts = Object.values(counts);
      const backgroundColors = labels.map((_, index) => colors[index & colors.length]);
    
      chartData = {
        labels: labels,
        datasets: [{
          label: `Access Count By ${metric}`,
          data: accessCounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('FF', 'AA')),
          borderWidth: 1
        }]
      };
      return (
        <Box display="flex" justifyContent="center" mt={2}>
          <Box width="500px" height="500px">
            <Pie data={chartData} />
          </Box>
        </Box>
      );
    }
    case 'accessTime': {
      const accessTimes = data.map(entry => new Date(entry.accessTime).getHours());
      const labels = Array.from(new Set(accessTimes)).sort();
      const backgroundColors = labels.map((_, index) => colors[index & colors.length]);
      const counts = labels.map(hour => accessTimes.filter(time => time === hour).length);
    
      chartData = {
        labels: labels.map(hour => `${hour}:00-${hour + 1}:00`),
        datasets: [{
          label: 'Access Count By Hour',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('FF', 'AA')),
          borderWidth: 1
        }]
      };
      return (
        <Box display="flex" justifyContent="center" mt={2}>
          <Box width="500px" height="500px">
            <Bar data={chartData} />
          </Box>
        </Box>
      );
    }
    default:
      chartData = {
        labels: [],
        datasets: []
      };
      return (
        <Box display="flex" justifyContent="center" mt={2}>
          <Box width="500px" height="500px">
            <Pie data={chartData} />
          </Box>
        </Box>
      );
  }
};

export default ChartComponent;
