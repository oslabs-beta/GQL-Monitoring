import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { ChartContext } from './MetricContainer';
import { Heading } from '@chakra-ui/react';
ChartJS.register(...registerables); // Need this in order for chartjs2 to work with React
import { enUS } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

const Chart = () => {
  const { operation, metricsData } = useContext(ChartContext);

  const chartConfig: any = {
    scales: {
      x: {
        adapters: {
          date: { locale: enUS },
        },
        // type: 'time',
        time: {
          unit: 'month',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: { display: true, text: 'Response Time' },
      },
    },
  };

  return (
    <>
      <Heading size="md" marginBottom="20px">
        {operation}
      </Heading>
      <Bar data={metricsData} options={chartConfig} />
    </>
  );
};

export default Chart;
