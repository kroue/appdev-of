import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedShift, setSelectedShift] = useState('');
  const [clockInReason, setClockInReason] = useState('');
  const [clockLog, setClockLog] = useState([]);
  const [clockedInTime, setClockedInTime] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [showSchedulesModal, setShowSchedulesModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation after logout

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/schedules');
        const data = await response.json();
        console.log('Fetched schedules:', data); // <-- Add this
        setSchedules(data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Invalid Date';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Invalid Date';
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

  const getCombinedDateTime = (isoDate, time) => {
    if (!isoDate) return '';
    const datePart = isoDate.split('T')[0];
    let timePart = time || '00:00:00';
    if (timePart.length === 5) timePart += ':00';
    return `${datePart}T${timePart}`;
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    if (!selectedShift) return alert('Please select a shift.');

    const now = new Date();
    const localTime = now.toLocaleString(); // Always use local time

    try {
      await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser.id,
          type: 'in',
          time: localTime, // Only send local time string
          shift: selectedShift,
          reason: clockInReason,
        }),
      });

      setClockLog((prevLog) => [
        ...prevLog,
        { type: 'in', time: localTime, shift: selectedShift, reason: clockInReason },
      ]);
      setClockedInTime(localTime);
      alert('Clocked in successfully.');
    } catch (error) {
      alert('Failed to record clock-in.');
    }
  };

  const handleClockOut = async () => {
    const now = new Date();
    const localTime = now.toLocaleString(); // Always use local time

    try {
      await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser.id,
          type: 'out',
          time: localTime, // Only send local time string
          shift: selectedShift,
        }),
      });

      setClockLog((prevLog) => [
        ...prevLog,
        { type: 'out', time: localTime, shift: selectedShift },
      ]);
      alert('Clocked out successfully.');
    } catch (error) {
      alert('Failed to record clock-out.');
    }
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h3>{loggedInUser ? loggedInUser.fullName : 'Employee Name'}</h3>
          <p>Welcome to the Dashboard</p>
        </div>
        <div className="welcome-actions">
          <button
            className="btn-secondary"
            onClick={() => setShowSchedulesModal(true)}
          >
            Upcoming Schedules
          </button>
          <button
            className="Dash-btn-primary"
            onClick={() => document.getElementById('clock-in-out').scrollIntoView({ behavior: 'smooth' })}
          >
            Clock In / Out
          </button>
        </div>
      </div>

      {/* Schedules Modal */}
      {showSchedulesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Upcoming Schedules</h3>
            <ul>
              {schedules.length === 0 ? (
                <li>No schedules found.</li>
              ) : (
                schedules.map((schedule) => (
                  <li key={schedule.id}>
                    {schedule.date} - {schedule.time}
                  </li>
                ))
              )}
            </ul>
            <button
              className="Dash-btn-primary"
              onClick={() => setShowSchedulesModal(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className="schedules">
        <h3>Upcoming Schedules</h3>
        <p>View your upcoming work shifts</p>
        <div className="shift-list">
          {schedules.map((schedule) => (
            <div className="shift-item" key={schedule.id}>
              <span className="shift-icon">🕒</span>
              <div>
                <strong>Shift Date</strong> <br />
                {schedule.date && schedule.time
                  ? formatDateTime(getCombinedDateTime(schedule.date, schedule.time))
                  : 'Invalid Date'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="clockin-form" id="clock-in-out">
        <h3>Clock In</h3>
        <p>Select your shift and clock in</p>
        <form onSubmit={handleClockIn}>
          <div className="shift-buttons">
            {schedules.map((schedule) => (
              <button
                type="button"
                key={schedule.id}
                onClick={() => setSelectedShift(`${schedule.date} - ${schedule.time}`)}
                className={selectedShift === `${schedule.date} - ${schedule.time}` ? 'active' : ''}
              >
                {formatDateTime(schedule.date, schedule.time)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter a reason for clocking in"
            value={clockInReason}
            onChange={(e) => setClockInReason(e.target.value)}
            required
          />
          <button type="submit" className="Dash-btn-primary">Clock In</button>
          <button type="button" className="Dash-btn-primary" onClick={handleClockOut}>Clock Out</button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
