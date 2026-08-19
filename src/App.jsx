import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TaskProvider, TaskContext } from './context/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import PandaLoader from './components/PandaLoader';
import PWAInstallBanner from './components/PWAInstallBanner';

import AuthRequiredPage from './components/AuthRequiredPage';

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
const Roadmaps = React.lazy(() => import('./pages/Roadmaps'));
const RoadmapDetail = React.lazy(() => import('./pages/RoadmapDetail'));

const RootRoute = () => {
  const { currentUser, isGuestMode, isOnboarded, loading } = React.useContext(TaskContext);

  if (loading) {
    return <PandaLoader appReady={false} />;
  }

  if (currentUser && !isGuestMode) {
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, isOnboarded, loading } = React.useContext(TaskContext);
  const location = useLocation();
  
  if (loading) {
    return <PandaLoader appReady={false} />;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

const SocialRouteGuard = ({ children }) => {
  const { currentUser, isGuestMode, loading } = React.useContext(TaskContext);
  const location = useLocation();

  if (loading) {
    return <PandaLoader appReady={false} />;
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isGuestMode) {
    return <AuthRequiredPage />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { currentUser, isGuestMode, isOnboarded, loading } = React.useContext(TaskContext);

  if (loading) {
    return <PandaLoader appReady={false} />;
  }

  if (currentUser && !isGuestMode) {
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { currentUser, isOnboarded, loading } = React.useContext(TaskContext);

  if (loading) {
    return <PandaLoader appReady={false} />;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  if (isOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppContent() {
  const { loading, appReady } = React.useContext(TaskContext);
  const [loaderComplete, setLoaderComplete] = React.useState(false);

  if (loading || !loaderComplete) {
    return <PandaLoader appReady={appReady} onComplete={() => setLoaderComplete(true)} />;
  }

  return (
    <Router>
      <PWAInstallBanner />
      <Suspense fallback={<PandaLoader appReady={true} />}>
        <Routes>
          {/* Public / Root Guard Route */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/auth" element={<PublicOnlyRoute><Auth /></PublicOnlyRoute>} />
          <Route path="/onboarding" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />

          {/* Protected Main App Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/roadmaps" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
          <Route path="/roadmaps/:id" element={<ProtectedRoute><RoadmapDetail /></ProtectedRoute>} />
          <Route path="/workspaces" element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
          <Route path="/workspaces/:id" element={<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/friends" element={<SocialRouteGuard><Friends /></SocialRouteGuard>} />
          <Route path="/communities" element={<SocialRouteGuard><AuthRequiredPage /></SocialRouteGuard>} />
          <Route path="/messages" element={<SocialRouteGuard><AuthRequiredPage /></SocialRouteGuard>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings/customize" element={<ProtectedRoute><SettingsCustomize /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <TaskProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </TaskProvider>
  );
}

export default App;
