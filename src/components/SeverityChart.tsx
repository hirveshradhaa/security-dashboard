// SeverityChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography } from '@mui/material';
import './SeverityChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SeverityChartProps {
  vulnerabilities: any[];
}

const SeverityChart = React.memo(function SeverityChart({ vulnerabilities }: SeverityChartProps) {
  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  vulnerabilities.forEach((vuln) => {
    const sev = vuln.severity?.toLowerCase();
    if (severityCounts.hasOwnProperty(sev)) {
      severityCounts[sev]++;
    }
  });

  const data = {
    labels: Object.keys(severityCounts),
    datasets: [
      {
        label: 'Vulnerabilities by Severity',
        data: Object.values(severityCounts),
        backgroundColor: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box className="severityChartContainer">
      <Typography variant="h5" className="severityChartTitle" gutterBottom>
        Vulnerabilities by Severity
      </Typography>
      <div className="severityChartWrapper">
        <Pie data={data} options={options} />
      </div>
    </Box>
  );
});

export default SeverityChart;
