import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ProblemProvider } from './contexts/ProblemContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProblemList from './pages/ProblemList';
import EventPage from './pages/EventPage';
import ProblemSolver from './pages/ProblemSolver';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import EventResultsPage from './pages/EventResultsPage';

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle redirections after login/signup
  React.useEffect(() => {
    if (user) {
      // Only redirect if user is on login page or root page
      if (location.pathname === '/login' || location.pathname === '/') {
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className={user ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
          <Route path="/" element={!user ? <LandingPage /> : <Dashboard />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/problems" element={user ? <ProblemList /> : <Navigate to="/login" />} />
          <Route path="/events" element={user ? <EventPage /> : <Navigate to="/login" />} />
          <Route path="/events/:eventId/problems" element={user ? <ProblemList /> : <Navigate to="/login" />} />
          <Route path="/events/:eventId/results" element={user ? <EventResultsPage /> : <Navigate to="/login" />} />
          <Route path="/problem/:id" element={user ? <ProblemSolver /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <ProblemProvider>
            <Router>
              <AppContent />
            </Router>
          </ProblemProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
