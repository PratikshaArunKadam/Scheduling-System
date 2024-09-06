import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './components/UserDashboard';  // Import UserDashboard
import Login from './pages/Login';
import SessionForm from './components/SessionForm';

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/session" element={<SessionForm />} />
        <Route path="/" element={<Login setUser={setUser} />} />

        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} />  */}
      </Routes>
    </Router>
  );
};

export default App;
