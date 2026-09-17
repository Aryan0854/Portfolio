import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResumePage from './pages/ResumePage';
import CertificatesPage from './pages/CertificatesPage';
import ProjectsPage from './pages/ProjectsPage';
import Chatbot from './components/UI/Chatbot';

function HashToPathRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash } = window.location;
    if (hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <HashToPathRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
