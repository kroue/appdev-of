import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddUser.css';

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    gender: '',
    age: '',
    phoneNumber: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User added successfully!');
        navigate('/admin');
      } else {
        alert('Failed to add user.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding user.');
    }
  };

  return (
    <div className="add-user-container">
      <div className="add-user-card">
        <h2>Add New User</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          
          {/* Gender dropdown */}
          <select
            value={newUser.gender}
            onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          
          <input
            type="number"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newUser.phoneNumber}
            onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <button type="submit" className="add-user-btn-primary">Add User</button>
          <button type="button" className="add-user-btn-secondary" onClick={() => navigate('/admin')}>Back to Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
