import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignupForm from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Contact from './pages/user/Contact';
import About from './pages/user/About';
import Terms from './pages/user/Terms';
import Admin from './pages/admin/Admin';
import AddUser from './pages/admin/AddUser';
import Schedules from './pages/admin/Schedules';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes (NO Navbar) */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private routes (WITH Navbar inside Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/schedules" element={<Schedules />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
