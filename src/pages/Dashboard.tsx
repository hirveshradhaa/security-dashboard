// Dashboard.tsx
import React, { useState, Suspense } from 'react';
import { useVulnerabilityData } from '../hooks/useVulnerabilityData';
import { VulnerabilityTable } from '../components/VulnerabilityTable';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import './Dashboard.css';

const SeverityChart = React.lazy(() => import('../components/SeverityChart'));
const RiskFactorChart = React.lazy(() => import('../components/RiskFactorChart'));
const VulnerabilityTrendChart = React.lazy(() => import('../components/VulnerabilityTrendChart'));

function extractAllVulnerabilities(data: any) {
  const vulnerabilities: any[] = [];

  for (const groupKey in data.groups) {
    const group = data.groups[groupKey];
    for (const repoKey in group.repos) {
      const repo = group.repos[repoKey];
      for (const imageKey in repo.images) {
        const image = repo.images[imageKey];
        if (Array.isArray(image.vulnerabilities)) {
          const enrichedVulns = image.vulnerabilities.map((vuln: any, index: number) => {
            const derivedKaiStatus = vuln.kaiStatus?.toLowerCase() || '';
            return {
              ...vuln,
              kaiStatus: derivedKaiStatus,
            };
          });
          vulnerabilities.push(...enrichedVulns);
        }
      }
    }
  }

  return vulnerabilities;
}

function Dashboard() {
  const { data, isLoading, error } = useVulnerabilityData();
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [kaiFilter, setKaiFilter] = useState('');

  if (isLoading) return <div>Loading vulnerability data...</div>;
  if (error) return <div>Error loading data: {(error as Error).message}</div>;
  if (!data) return <div>No data found.</div>;

  const vulnerabilities = extractAllVulnerabilities(data);

  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    const matchesSeverity = severityFilter
      ? vuln.severity?.toLowerCase() === severityFilter.toLowerCase()
      : true;

    const matchesSearch = searchTerm
      ? vuln.cve?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesKaiStatus = kaiFilter && kaiFilter !== ''
      ? vuln.kaiStatus?.toLowerCase() === kaiFilter.toLowerCase()
      : true;

    return matchesSeverity && matchesSearch && matchesKaiStatus;
  });

  function exportToCSV(vulnerabilities: any[]) {
    const headers = ['CVE ID', 'Severity', 'Package', 'Version', 'Published Date', 'Fix Date'];
    const rows = vulnerabilities.map((vuln) => [
      vuln.cve,
      vuln.severity,
      vuln.packageName,
      vuln.packageVersion,
      vuln.published,
      vuln.fixDate,
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vulnerabilities_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleClearFilters() {
    setKaiFilter('');
    setSearchTerm('');
    setSeverityFilter('');
  }

  console.log('kaiFilter is:', kaiFilter);
  console.log('Filtered rows count:', filteredVulnerabilities.length);

  return (
    <Box className="dashboardContainer">
      <Typography variant="h3" className="dashboardTitle" gutterBottom>
        Security Vulnerability Dashboard
      </Typography>

      <Card className="filterCard">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} className="stackSpacing" alignItems="center" mb={2}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Severity</InputLabel>
              <Select
                label="Severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <MenuItem value="">All Severities</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Search CVE ID"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="buttonGroup" alignItems="center" justifyContent="flex-start">
            <Button variant="contained" color="primary" onClick={() => setKaiFilter('invalid - norisk')}>Analysis</Button>
            <Button variant="contained" color="secondary" onClick={() => setKaiFilter('ai-invalid-norisk')}>AI Analysis</Button>
            <Button variant="outlined" onClick={handleClearFilters}>Clear Filter</Button>
            <Button variant="outlined" onClick={() => exportToCSV(filteredVulnerabilities)}>Download CSV</Button>
          </Stack>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading severity chart...</div>}>
        <SeverityChart vulnerabilities={filteredVulnerabilities} />
      </Suspense>

      <Suspense fallback={<div>Loading trend chart...</div>}>
        <VulnerabilityTrendChart vulnerabilities={filteredVulnerabilities} />
      </Suspense>

      <Suspense fallback={<div>Loading risk factor chart...</div>}>
        <RiskFactorChart vulnerabilities={filteredVulnerabilities} />
      </Suspense>

      <VulnerabilityTable vulnerabilities={filteredVulnerabilities} />
    </Box>
  );
}

export default Dashboard;
