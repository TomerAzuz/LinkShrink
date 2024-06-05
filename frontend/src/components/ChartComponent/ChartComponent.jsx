import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import Box from '@mui/material/Box';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartComponent = ({ data, metric, timeScale }) => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66',
    '#FF66B2', '#66B2FF', '#FFDB66', '#66FFCC', '#B266FF', '#FF6666', '#66FF99',
    '#6699FF'
  ];

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

  let chartData;

  switch (metric) {
    case 'country':
    case 'deviceType':
    case 'browser': {
      const groupedData = groupBy(data, item => item[metric]);
      const labels = Object.keys(groupedData);
      const accessCounts = Object.values(groupedData);
      const backgroundColors = labels.map((_, index) => colors[index % colors.length]);

      chartData = {
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
          <Box>
            <Pie data={chartData} />
          </Box>
        </Box>
      );
    }
    case 'accessTime': {
      let getKey;
      switch (timeScale) {
        case 'hour':
          getKey = item => format(parseISO(item.accessTime), 'HH:00');
          break;
        case 'day':
          getKey = item => format(parseISO(item.accessTime), 'yyyy-MM-dd');
          break;
        case 'week':
          getKey = item => format(startOfWeek(parseISO(item.accessTime)), 'yyyy-MM-dd');
          break;
        case 'month':
          getKey = item => format(startOfMonth(parseISO(item.accessTime)), 'yyyy-MM');
          break;
        default:
          getKey = item => item.accessTime;
      }

      const groupedData = groupBy(data, getKey);
      const labels = Object.keys(groupedData).sort();
      const accessCounts = labels.map(label => groupedData[label]);
      const backgroundColors = labels.map((_, index) => colors[index % colors.length]);

      chartData = {
        labels: labels,
        datasets: [{
          label: `Access count by ${timeScale}`,
          data: accessCounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('FF', 'AA')),
          borderWidth: 1
        }]
      };

      return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Box width="600px" height="300px">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: true,
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
            },
            layout: {
              padding: {
                left: 50,
                right: 50,
                top: 20,
                bottom: 20
              }
            }
          }}
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
