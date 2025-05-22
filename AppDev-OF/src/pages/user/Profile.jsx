import React, { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
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

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
      setFullName(loggedInUser.fullName || '');
      setGender(loggedInUser.gender || '');
      setAge(loggedInUser.age || '');
      setPhone(loggedInUser.phone || '');
      setEmail(loggedInUser.email || '');
      setPassword(loggedInUser.password || '');
    }
  }, []);

  const handleToggleEdit = () => {
    if (isEditing) {
      const updatedUser = {
        ...user,
        fullName,
        gender,
        age,
        phone,
        email,
        password,
      };
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
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
          <h3>{user.fullName}</h3>
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

        {/* Gender Dropdown */}
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
