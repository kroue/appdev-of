import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:5000/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const fetchLogs = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/logs?userId=${userId}`);
    const data = await response.json();
    setLogs(data);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchLogs(user.id);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Invalid Date';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Group logs by date (local string version)
  const logsByDate = logs.reduce((acc, log) => {
    // Use log.time_local if available, otherwise log.time
    const date = (log.time_local || log.time).split(',')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Deterministic sales data generator based on date string
  const getSalesDataForDate = (date) => {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash += date.charCodeAt(i);
    }
    return 1000 + (hash % 9000); // Always between 1000 and 9999
  };

  const handleToggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <h2>Admin Panel</h2>

        <section className="admin-section">
          <h3>Users</h3>
          <ul className="admin-users">
            {users.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user)}>
                {user.full_name} ({user.email})
              </li>
            ))}
          </ul>
        </section>

        {selectedUser && (
          <section className="admin-section">
            <h3>Clock-In/Out Logs for {selectedUser.full_name}</h3>
            <div className="admin-logs">
              {Object.keys(logsByDate).length === 0 && <div>No logs yet.</div>}
              {Object.keys(logsByDate).map((date) => (  
                <div
                  key={date}
                  style={{
                    marginBottom: 16,
                    border: '1px solid #e0e0e0',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    padding: 0,
                    background: '#fafbfc',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <button
                    style={{
                      background: expandedDates[date] ? '#1976d2' : '#f5f5f5',
                      color: expandedDates[date] ? '#fff' : '#222',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px 20px',
                      fontSize: 18,
                      borderRadius: 0,
                      outline: 'none',
                      transition: 'background 0.2s, color 0.2s',
                      letterSpacing: 0.5,
                      boxShadow: expandedDates[date] ? '0 2px 8px rgba(25, 118, 210, 0.08)' : 'none',
                    }}
                    onClick={() => handleToggleDate(date)}
                  >
                    <span style={{ marginRight: 12, fontSize: 20, verticalAlign: 'middle' }}>📅</span>
                    {date}
                    <span style={{ float: 'right', fontSize: 20 }}>
                      {expandedDates[date] ? '▲' : '▼'}
                    </span>
                  </button>
                  {expandedDates[date] && (
                    <div style={{ marginTop: 0, padding: '18px 28px', background: '#fff' }}>
                      <div style={{ marginBottom: 8, fontSize: 16 }}>
                        <strong>Sales Data:</strong> <span style={{ color: '#388e3c' }}>₱{getSalesDataForDate(date)}</span>
                      </div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {logsByDate[date].map((log) => (
                          <li key={log.id} style={{ marginBottom: 4, fontSize: 15 }}>
                            <span style={{ fontWeight: 500, color: log.type === 'in' ? '#1976d2' : '#d32f2f' }}>
                              {log.type === 'in' ? 'Clocked In' : 'Clocked Out'}
                            </span>
                            {' at '}
                            {log.time_local || formatDateTime(log.time)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="admin-buttons">
          <button className="admin-btn_primary" onClick={() => navigate('/add-user')}>Add User</button>
          <button className="admin-btn_secondary" onClick={() => navigate('/schedules')}>Manage Schedules</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
