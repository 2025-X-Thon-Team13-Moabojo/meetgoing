import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ContestListPage from './pages/ContestListPage';
import ContestDetailPage from './pages/ContestDetailPage';
import TeamListPage from './pages/TeamListPage';
import CreateTeamPage from './pages/CreateTeamPage';
import ChatPage from './pages/ChatPage';

import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <AuthProvider>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contests" element={<ContestListPage />} />
          <Route path="/contests/:id" element={<ContestDetailPage />} />
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="/teams/new" element={<CreateTeamPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
