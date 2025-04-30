import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
