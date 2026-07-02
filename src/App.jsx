import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider, TaskContext } from './context/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import PandaLoader from './components/PandaLoader';

// Lazy loading all pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Auth = React.lazy(() => import('./pages/Auth'));
const OnboardingFlow = React.lazy(() => import('./pages/Onboarding/OnboardingFlow'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Workspaces = React.lazy(() => import('./pages/Workspaces'));
const WorkspaceDetail = React.lazy(() => import('./pages/WorkspaceDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Friends = React.lazy(() => import('./pages/Friends'));
const Settings = React.lazy(() => import('./pages/Settings'));
const SettingsCustomize = React.lazy(() => import('./pages/SettingsCustomize'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Notifications = React.lazy(() => import('./pages/Notifications'));

const ProtectedRoute = ({ children }) => {
  const { currentUser, isOnboarded, loading } = React.useContext(TaskContext);
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><PandaLoader message="Connecting to MasterOS..." duration={1000} /></div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { currentUser, loading } = React.useContext(TaskContext);
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><PandaLoader message="Connecting to MasterOS..." duration={1000} /></div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <TaskProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><PandaLoader message="Loading MasterOS..." duration={1000} /></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Onboarding Flow (can access via interests or general onboarding) */}
              <Route path="/onboarding" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              <Route path="/onboarding/interests" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              <Route path="/onboarding/roadmap" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              <Route path="/onboarding/goal" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              <Route path="/onboarding/timeline" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />

              {/* Authenticated Application Pages */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/workspaces" element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
              <Route path="/workspaces/:id" element={<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/customize" element={<ProtectedRoute><SettingsCustomize /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </TaskProvider>
  );
}

export default App;
