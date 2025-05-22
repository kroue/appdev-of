import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Schedules.css';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ date: '', time: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const response = await fetch('http://localhost:5000/api/schedules');
    const data = await response.json();
    setSchedules(data);
  };

  const handleAddSchedule = async () => {
    const response = await fetch('http://localhost:5000/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSchedule),
    });
    if (response.ok) {
      fetchSchedules();
      setNewSchedule({ date: '', time: '' });
    }
  };

  const handleDeleteSchedule = async (id) => {
    await fetch(`http://localhost:5000/api/schedules/${id}`, { method: 'DELETE' });
    fetchSchedules();
  };

  return (
    <div className="sched-schedules-container">
      <div className="sched-schedules">
        <h2>Manage Schedules</h2>
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              {schedule.date} - {schedule.time}
              <button className="delete-btn" onClick={() => handleDeleteSchedule(schedule.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h4>Add Schedule</h4>
        <div className="schedules-inputs">
          <input
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
          />
          <input
            type="time"
            value={newSchedule.time}
            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
          />
        </div>

        <div className="schedules-buttons">
          <button type="submit" className="schedule-btn-primary" onClick={handleAddSchedule}>
            Add Schedule
          </button>
          <button type="button" className="schedule-btn-secondary" onClick={() => navigate('/admin')}>
            Back to Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
