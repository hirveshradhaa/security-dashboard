import { useVulnerabilityData } from '../hooks/useVulnerabilityData';

function Dashboard() {
  const { data, isLoading, error } = useVulnerabilityData();

  if (isLoading) {
    return <div>Loading vulnerability data...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
      <h2>Vulnerability Data (Test)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;

