// RiskFactorChart.tsx
import React from 'react';
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
import { Box, Typography } from '@mui/material';
import './RiskFactorChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RiskFactorChartProps {
  vulnerabilities: any[];
}

const RiskFactorChart = React.memo(function RiskFactorChart({ vulnerabilities }: RiskFactorChartProps) {
  const riskFactorCounts: Record<string, number> = {};

  vulnerabilities.forEach((vuln) => {
    if (vuln.riskFactors) {
      Object.keys(vuln.riskFactors).forEach((factor) => {
        riskFactorCounts[factor] = (riskFactorCounts[factor] || 0) + 1;
      });
    }
  });

  const data = {
    labels: Object.keys(riskFactorCounts),
    datasets: [
      {
        label: 'Number of Vulnerabilities',
        data: Object.values(riskFactorCounts),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Factors Frequency',
      },
    },
  };

  return (
    <Box className="riskChartContainer">
      <Typography variant="h5" className="riskChartTitle" gutterBottom>
        Risk Factors Frequency
      </Typography>
      <Bar data={data} options={options} />
    </Box>
  );
});

export default RiskFactorChart;
