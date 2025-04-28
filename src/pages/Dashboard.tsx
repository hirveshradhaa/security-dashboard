import { useState } from 'react';
import { useVulnerabilityData } from '../hooks/useVulnerabilityData';
import { VulnerabilityTable } from '../components/VulnerabilityTable';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';

function extractAllVulnerabilities(data: any) {
  const vulnerabilities: any[] = [];

  for (const groupKey in data.groups) {
    const group = data.groups[groupKey];
    for (const repoKey in group.repos) {
      const repo = group.repos[repoKey];
      for (const imageKey in repo.images) {
        const image = repo.images[imageKey];
        if (Array.isArray(image.vulnerabilities)) {
          vulnerabilities.push(...image.vulnerabilities);
        }
      }
    }
  }

  return vulnerabilities;
}

function Dashboard() {
  const { data, isLoading, error } = useVulnerabilityData();
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (isLoading) {
    return <div>Loading vulnerability data...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  const vulnerabilities = extractAllVulnerabilities(data);

  // Apply filtering
  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    const matchesSeverity = severityFilter ? vuln.severity?.toLowerCase() === severityFilter.toLowerCase() : true;
    const matchesSearch = searchTerm ? vuln.cve?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesSeverity && matchesSearch;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Security Vulnerability Dashboard
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <VulnerabilityTable vulnerabilities={filteredVulnerabilities} />
    </Box>
  );
}

export default Dashboard;
