import React, { useEffect, useState } from 'react';
import '../../styles/Profile.css';

const dummyImages = [
  '/assets/sample-prof-photo.png',
  '/assets/sample-prof-photo.png',
  '/assets/sample-prof-photo.png',
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fetch user data from backend
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      fetch(`http://localhost:5000/api/users/${loggedInUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setFullName(data.full_name || '');
          setGender(data.gender || '');
          setAge(data.age || '');
          setPhone(data.phone_number || '');
          setEmail(data.email || '');
          setPassword(''); // Don't prefill password for security
        });
    }
  }, []);

  const handleToggleEdit = async () => {
    if (isEditing && user) {
      // Save changes to backend
      const updatedUser = {
        full_name: fullName,
        gender,
        age,
        phone_number: phone,
        email,
        password: password || undefined, // Only send if changed
      };
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        alert('Profile updated!');
      } else {
        alert('Failed to update profile.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleScroll = (e) => {
    const scrollX = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const slide = Math.round(scrollX / width);
    setCurrentSlide(slide);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>

      <div className="profile-details">
        <div className="profile-pic" />
        <div className="profile-info">
          <h3>{user.full_name}</h3>
          <p>{user.role || 'Basic Employee'}</p>
          <p>Email: {user.email}</p>
          <p>Department: {user.department || 'N/A'}</p>
        </div>
      </div>

      <div className="form-section">
        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={!isEditing}
        />

        <label>Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          disabled={!isEditing}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          disabled={!isEditing}
        />

        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditing}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditing}
          placeholder="Enter new password"
        />
      </div>

      {/* Carousel */}
      <p style={{ marginLeft: '5px', fontWeight: 'bold' }}>Profile Pictures</p>
      <div className="carousel-container" onScroll={handleScroll}>
        <div className="carousel">
          {dummyImages.map((img, index) => (
            <div className="slide" key={index}>
              <img src={img} alt={`Slide ${index}`} className="slide-image" />
            </div>
          ))}
        </div>
        <div className="dots">
          {dummyImages.map((_, idx) => (
            <div key={idx} className={`dot ${idx === currentSlide ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      {/* Save / Edit Button */}
      <button
        className="btn-primary"
        onClick={handleToggleEdit}
        style={{ backgroundColor: isEditing ? '#e53935' : '#0a469e' }}
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default Profile;
