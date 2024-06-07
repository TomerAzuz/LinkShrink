import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartComponent = ({ data, metric }) => {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66'];

  const groupBy = (data, getKey) => {
    return data.reduce((result, item) => {
      const key = getKey(item);
      if (!result[key]) {
        result[key] = 0;
      }
      result[key]++;
      return result;
    }, {});
  };

  switch (metric) {
    case 'country':
    case 'deviceType':
    case 'browser': {
      const groupedData = groupBy(data, item => item[metric]);
      const labels = Object.keys(groupedData);
      const accessCounts = Object.values(groupedData);
      const backgroundColors = labels.map((_, index) => colors[index % colors.length]);

      const chartData = {
        labels: labels,
        datasets: [{
          label: `Access count by ${metric}`,
          data: accessCounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('FF', 'AA')),
          borderWidth: 1
        }]
      };

      return (
        <Box display="flex" justifyContent="center" mt={2}>
          <Box width="400px" height="400px">
            <Pie
              data={chartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                }
              }}
            />
          </Box>
        </Box>
      );
    }
    case 'accessTime': {
      const groupedByDate = groupBy(data, item => {
        const date = new Date(item.accessTime);
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
      });

      const accessTimes = Object.keys(groupedByDate).sort().map(date => ({
        x: new Date(date),
        y: groupedByDate[date],
      }));

      const chartData = {
        datasets: [
          {
            label: 'Access Times',
            data: accessTimes,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: false,
          },
        ],
      };

      const options = {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Access Count',
            },
            ticks: {
              stepSize: 1,
              beginAtZero: true,
            },
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      };

      return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Box width="600px" height="300px">
            <Line
              data={chartData}
              options={options}
            />
          </Box>
        </Box>
      );
    }
    default:
      return null;
  }
};

export default ChartComponent;
